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
import { ChartsService } from './services/Charts.service';
import { HistoricalReturnService } from './services/historical-return.service';
import { UtilsService } from './services/utils.service';
import { GoldRatioComponent } from './gold-ratio/gold-ratio.component';
import { IndexMatrixComponent } from './index-matrix/index-matrix.component';
import { AssetsPortfolioComponent } from './assets-portfolio/assets-portfolio.component';
import { RelativePerformanceComponent } from './relative-performance/relative-performance.component';
import { StocksStatisticsComponent } from './stocks-statistics/stocks-statistics.component';
import { MarketCapComponent } from './market-cap/market-cap.component';
import { IlsPerformanceComponent } from './ils-performance/ils-performance.component';
import { InterestRatesComponent } from './interest-rates/interest-rates.component';
import { MenuBarComponent } from './icons/menu-bar/menu-bar.component';
import { VMarkComponent } from './icons/v-mark/v-mark.component';
import { OpenTriangleComponent } from './icons/open-triangle/open-triangle.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { RelativePerformance2Component } from './relative-performance-2/relative-performance-2.component';
import { AssetsMenuModalComponent } from './assets-menu-modal/assets-menu-modal.component';
import { ArrowIconComponent } from './icons/arrow-icon/arrow-icon.component';
import { AssetsListFilterPipe } from './pipes/assets-list-filter.pipe';
import { XIconComponent } from './icons/x-icon/x-icon.component';
import { MarketHeadlinesComponent } from './market-headlines/market-headlines.component';
import { CalendarTableComponent } from './calendar-table/calendar-table.component';
import { TriangleIconComponent } from './icons/triangle-icon/triangle-icon.component';
import { DateValidatorDirective } from './directives/date-validator.directive';
import { BrokenLineComponent } from './icons/broken-line/broken-line.component';
import { DatesService } from './services/dates.service';

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
    RelativePerformanceComponent,
    StocksStatisticsComponent,
    MarketCapComponent,
    IlsPerformanceComponent,
    InterestRatesComponent,
    MenuBarComponent,
    VMarkComponent,
    OpenTriangleComponent,
    BarChartComponent,
    LineChartComponent,
    RelativePerformance2Component,
    AssetsMenuModalComponent,
    ArrowIconComponent,
    AssetsListFilterPipe,
    XIconComponent,
    MarketHeadlinesComponent,
    CalendarTableComponent,
    TriangleIconComponent,
    DateValidatorDirective,
    BrokenLineComponent,
  ],
  imports: [
    BrowserModule,
      FormsModule,
      HttpModule,
      appRouterModule
  ],
  providers: [AssetsService,AssetDataService,WindowService,HistoricalReturnService,ChartsService,UtilsService, DatesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
