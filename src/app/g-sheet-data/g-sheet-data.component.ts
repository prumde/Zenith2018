import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GsheetDataService } from '../gsheet-data.service';

@Component( {
    selector: 'gsheet-qrdata',
    templateUrl: './g-sheet-data.component.html',
    styleUrls: ['./g-sheet-data.component.css']
} )
export class GSheetDataComponent implements OnInit, OnDestroy {

    filterOption = 1;
    showFilter = true;
    noMatchFound = false;

    participants: any = [];
    participantsData: any = null;
    partiDataSubscription : Subscription;
    
    constructor(public gsheetDataService: GsheetDataService) { }

    ngOnInit() 
    {
        this.showFilter = true;
        this.gsheetDataService.getGoogleSheet();
        this.partiDataSubscription = this.gsheetDataService.getParticipantsData().subscribe( participantsData => {
            this.participantsData = participantsData;
        });
    }

    filterData( schoolCodes, partiCodes ) 
    {
        this.participants = [];
        var participants = [];
        console.log( "filterData==>", schoolCodes, partiCodes );
        var schoolCodesArr = [], partiCodesArr = [];
        if ( schoolCodes.indexOf( ',' ) != -1 ) 
        {
            schoolCodesArr = schoolCodes.split( "," ).map( function( schoolCode ) {
                return schoolCode.trim();
            } );
        }
        else 
        {
            schoolCodesArr.push( schoolCodes );
        }
        if ( partiCodes.indexOf( ',' ) != -1 ) 
        {
            partiCodesArr = partiCodes.split( "," ).map( function( partiCode ) {
                return partiCode.trim();
            } );
        }
        else 
        {
            partiCodesArr.push( partiCodes );
        }

        console.log( "filterData==>", schoolCodesArr, partiCodesArr );

        if( this.participantsData )
        {
            this.participantsData.forEach( function( participant ) {
                var isMatch = schoolCodesArr.indexOf( participant.SCHOOL_CODE ) != -1 || partiCodesArr.indexOf( participant.PART_CODE ) != -1;
                if ( isMatch ) 
                {
                    console.log( "isMatch participant==>", participant );
                    participants.push( participant );
                }
            } );
            this.participants = participants;
        }
        if( participants.length > 0 )
        {
            this.showFilter = false;
            this.noMatchFound = false;
        }
        else
        {
            this.noMatchFound = true;
        }
    }

    ngOnDestroy()
    {
        if( this.partiDataSubscription )
        {
            this.partiDataSubscription.unsubscribe();
        }
    }
}
