import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';

import { appRouterModule } from "./app.routes";

import { AppComponent } from './app.component';
import { SearchAssetComponent } from './search-asset/search-asset.component';
import { AssetsService } from './services/assets.service';
import { AssetFilterPipe } from './pipes/asset-filter.pipe';
import { AssetSummaryComponent } from './asset-summary/asset-summary.component';

import { AssetDataService } from './services/asset-data.service';
import { MarketSentimentService } from './services/market-sentiment.service';
import { MainPageComponent } from './main-page/main-page.component';
import { SentimentBarometerComponent } from './sentiment-barometer/sentiment-barometer.component';
import { TopAssetsPerformanceComponent } from './top-assets-performance/top-assets-performance.component';
import { AssetsTableComponent } from './assets-table/assets-table.component';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { AssetPerformanceBarComponent } from './asset-performance-bar/asset-performance-bar.component';
import { AssetPerformanceBarExplanationComponent } from './asset-performance-bar-explanation/asset-performance-bar-explanation.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { WindowService } from './services/window.service';
import { GoldRatioComponent } from './gold-ratio/gold-ratio.component';
import { IndexMatrixComponent } from './index-matrix/index-matrix.component';
import { AssetsPortfolioComponent } from './assets-portfolio/assets-portfolio.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchAssetComponent,
    AssetFilterPipe,
    AssetSummaryComponent,
    MainPageComponent,
    SentimentBarometerComponent,
    TopAssetsPerformanceComponent,
    AssetsTableComponent,
    AssetsListComponent,
    AssetPerformanceBarComponent,
    AssetPerformanceBarExplanationComponent,
    PageHeaderComponent,
    GoldRatioComponent,
    IndexMatrixComponent,
    AssetsPortfolioComponent,
  ],
  imports: [
    BrowserModule,
      FormsModule,
      HttpModule,
      appRouterModule
  ],
  providers: [AssetsService,AssetDataService,MarketSentimentService,WindowService],
  bootstrap: [AppComponent]
})
export class AppModule { }
