import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'zenith-2018',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  compName = 'gsheet-qrdata';
  ngOnInit(){
    var elem = document.getElementById('compName');
    if( elem )
    {
      this.compName = elem.innerText || 'gsheet-qrdata';
    }
    console.log('ScoreBoardComponent show [', this.compName, ']');
  }
}
