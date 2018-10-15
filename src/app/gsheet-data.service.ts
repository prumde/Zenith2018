import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
declare var Tabletop: any;

@Injectable({
  providedIn: 'root'
})
export class GsheetDataService {

  private tabletop: any;
  private scoreBoardData = new BehaviorSubject<any>({});
  private participantsData = new BehaviorSubject<any>([]);
  constructor() { }

  getScoreBoardData(): Observable<any[]>{
    return this.scoreBoardData.asObservable();
  }
  
  getParticipantsData(): Observable<any[]>{
    return this.participantsData.asObservable();
  }

  getGoogleSheet( isRefresh ? )
  {
      if(this.tabletop && !isRefresh)
      {
        this._setScoreBoardData(this.tabletop);
        this._setParticipantsData(this.tabletop);
        return;
      }
      var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/10SLVLcLxaAbPByIUlXoWqN7e9ZyXEZ3cZ1WSz--Fqjs/pubhtml';
      //Zenith 'https://docs.google.com/spreadsheets/d/10SLVLcLxaAbPByIUlXoWqN7e9ZyXEZ3cZ1WSz--Fqjs/pubhtml';
      //Kamal 'https://docs.google.com/spreadsheets/d/1LfafYyZGxaDZgKf1yPg7getTx80-ArFBuGl9pF6skDs/pubhtml';
      console.log( 'publicSpreadsheetUrl ---', publicSpreadsheetUrl );
      Tabletop.init(
          {
              key: publicSpreadsheetUrl,
              callback: this._fetchSheetData.bind( this ),
              simpleSheet: true
          }
      )
  }

  private _fetchSheetData( data, tabletop ) 
  {
      console.log( 'Successfully processed!' )
      this.tabletop = tabletop;
      this._setScoreBoardData(tabletop);
      this._setParticipantsData(tabletop);
  }

  private _setScoreBoardData(tabletop)
  {
    var scoreBoardSheetData = tabletop.sheets( "SCHOOL_PARTI" );
    var scoreBoardData = scoreBoardSheetData.elements;
    console.log( "scoreBoardData==>", scoreBoardData );
    var schoolSheetData = tabletop.sheets( "SCHOOLS" );
    var schoolListData = scoreBoardSheetData.elements;

    this.scoreBoardData.next( {'SCHOOL_PARTI' : scoreBoardData , 'SCHOOLS' : schoolListData} );
  }

  private _setParticipantsData(tabletop){
    var participantsSheetData = tabletop.sheets( "PARTICIPANT" );
    var participantsData = participantsSheetData.elements;
    console.log( "participantsData==>", participantsData );
    this.participantsData.next( participantsData );
  }

  groupBy(array, key)
  {
    //console.log('Inside group by',array,key);
    var i = 0;
    var groupedArray = []; //Object.assign([], array);
    var groupUniqueKeys = [];
    if( array )
    {
        array.forEach( function(arrayObj) { 
            if(groupUniqueKeys.indexOf(arrayObj[key]) >= 0) 
            {
                var existingObj = groupedArray.find( function (fobj) { 
                    return fobj.key== arrayObj[key] 
                }); 
                if( existingObj )
                {
                    existingObj.count += 1;
                    existingObj.objects.push(arrayObj);
                }
            } 
            else 
            {
                var objects = [];
                objects.push(arrayObj);
                var groupObj = {'key' : arrayObj[key], 'count' : 1, 'objects' : objects};          
                groupedArray[i] = groupObj;
                groupUniqueKeys[i] = arrayObj[key];
                i++;
            }                    
        });   
    }
    return groupedArray;
  }

  sortBy(array, key, typeOfColumn)
  {
    var sortedArray = Object.assign([], array);
    if( sortedArray )
    {
        if(typeOfColumn=='number'){
            //console.log('SORT function number>>');
            sortedArray.sort( function(a, b) {
            return parseInt(b[key]) - parseInt(a[key]);
            } )   
        
        }
        else if(typeOfColumn=='date'){
           // console.log('SORT function number>>');
            sortedArray.sort( function(a, b) {
            return parseInt(a[key]) - parseInt(b[key]);
            } )   
        
        }
        else{
            sortedArray.sort( function(a, b) {
            //console.log('SORT:::',a[key],b[key]);
            return a[key] > b[key]
                } )   
        }
    }
    //console.log(array, sortedArray);
    return sortedArray;
  }
}
