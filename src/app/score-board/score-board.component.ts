import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';

import { GsheetDataService } from '../gsheet-data.service';

@Component({
  selector: 'score-board',
  templateUrl: './score-board.component.html',
  styleUrls: ['./score-board.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ScoreBoardComponent implements OnInit, OnDestroy {

  isRefreshComplete = true;
  scoreResult = 0; // TO render Array data 
  displayedColumns: string[]; //TO diplay headers columns such as (name , position )
  displayedColumnsText: {};
  scoreBoardData: any = null;
  scoresDataSubscription : Subscription;
  
  expandedElement;

  constructor(public gsheetDataService: GsheetDataService) { }
  
  ngOnInit() {
      
      this.displayedColumns = ['RANK', 'SCHOOL_NAME', 'SCORE'];
      this.displayedColumnsText = {
        'RANK' :'#Rank' , 
        //'SCHOOL_CODE':'School Code' , 
        'SCHOOL_NAME':'School Name' , 
        'SCORE':'Score' 
      };
    
      console.log("display coloumns ===>",this.displayedColumns);
      
      this.scoreResult = 0;
      console.log("display data source ===>",this.scoreResult);
      this.gsheetDataService.getGoogleSheet();
      this.scoresDataSubscription = this.gsheetDataService.getScoreBoardData().subscribe( scoreBoardData => {
          console.log(" isRefreshComplete ===>",this.isRefreshComplete);
          this._processData(scoreBoardData);
          this.isRefreshComplete = true;
      });
  }

  private _processData(allData)
  {
    var scoreBoardData = allData.SCHOOL_PARTI;
    var schoolList = allData.SCHOOLS;
    var grpData = this.gsheetDataService.groupBy(scoreBoardData, 'SCHOOL_CODE');

    var scoresData = [];
    grpData.forEach(function( schoolData ) {
      var scoreData = {};
      var objectScore = schoolData.objects.reduce(function (acc, object) {
        //console.log( 'object[', object.SCORE, '][', acc, '][', object, ']');
        return acc + parseInt(object.SCORE ? object.SCORE : 0);
      }, 0);
      console.log( schoolData.key , 'objectScore', objectScore);
      scoreData['SCHOOL_CODE'] = schoolData.key;
      scoreData['SCHOOL_NAME'] = schoolData.objects[0].SCHOOL_NAME || schoolData.objects[0].SCHOOL_CODE;
      scoreData['SCORE'] = objectScore;
      scoreData['EVENTS'] = schoolData.objects.filter(function (eventData) {
        return eventData.SCORE !== '' ;
      });
      scoresData.push(scoreData);
    });

    console.log("display data source ===>",scoresData);

    var rank = 1;
    var prvScore = 0;
    this.scoreBoardData = this.gsheetDataService.sortBy( scoresData, 'SCORE', 'number' ).map(function( scoreData ) {
      var currScore = scoreData.SCORE;
      console.log("RANK",rank, "prvScore",prvScore, "currScore",currScore);
      if( prvScore > 0 && prvScore != currScore )
      {
        rank = rank + 1;
      }
      scoreData['RANK'] = '#' + rank;
      prvScore = currScore;
      return scoreData;
    });
    this.scoreResult = scoresData.length;
  }

  refresh()
  {
    console.log(" isRefreshComplete ===>",this.isRefreshComplete);
    this.scoreResult = 0;
    if( this.isRefreshComplete )
    {
      this.gsheetDataService.getGoogleSheet(true);
      this.isRefreshComplete = false;
    }
  }

  toggleElement( element ) {
    console.log(" element ===>",element);
    if( !this.expandedElement || this.expandedElement !== element){
      this.expandedElement = element;
    }
    else{
      this.expandedElement = null;
    }
  }

  ngOnDestroy()
  {
      if( this.scoresDataSubscription )
      {
          this.scoresDataSubscription.unsubscribe();
      }
  }
}
