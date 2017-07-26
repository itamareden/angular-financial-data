import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import { appRouterModule } from "./app.routes";

import { AppComponent } from './app.component';
import { SearchAssetComponent } from './search-asset/search-asset.component';
import { AssetsService } from './assets.service';
import { AssetFilterPipe } from './asset-filter.pipe';
import { AssetSummaryComponent } from './asset-summary/asset-summary.component';

import { AssetDataService } from './asset-data.service';
import { MainPageComponent } from './main-page/main-page.component';
import { SentimentBarometerComponent } from './sentiment-barometer/sentiment-barometer.component';
import { TopAssetsPerformanceComponent } from './top-assets-performance/top-assets-performance.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchAssetComponent,
    AssetFilterPipe,
    AssetSummaryComponent,
    MainPageComponent,
    SentimentBarometerComponent,
    TopAssetsPerformanceComponent
  ],
  imports: [
    BrowserModule,
      FormsModule,
      HttpModule,
      appRouterModule
  ],
  providers: [AssetsService,AssetDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
