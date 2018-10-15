import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule, Router } from "@angular/router";
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';
import { MaterialModule } from './module';

import { AppComponent } from './app.component';
import { GSheetDataComponent } from './g-sheet-data/g-sheet-data.component';
import { ScoreBoardComponent } from './score-board/score-board.component';
import { GsheetDataService } from './gsheet-data.service';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: GSheetDataComponent },
  { path: "scoreboard", component: ScoreBoardComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GSheetDataComponent,
    ScoreBoardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    QRCodeModule,
    MaterialModule,
    FormsModule
    //RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [GsheetDataService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
