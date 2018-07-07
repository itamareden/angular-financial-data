import { Routes,RouterModule } from '@angular/router';
import { AssetSummaryComponent } from './asset-summary/asset-summary.component';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { MainPageComponent } from './main-page/main-page.component';
import { GoldRatioComponent } from './gold-ratio/gold-ratio.component';
import { IndexMatrixComponent } from './index-matrix/index-matrix.component';
import { AssetsPortfolioComponent } from './assets-portfolio/assets-portfolio.component';
import { IlsPerformanceComponent } from './ils-performance/ils-performance.component';
import { InterestRatesComponent } from './interest-rates/interest-rates.component';
import { MarketHeadlinesComponent } from './market-headlines/market-headlines.component';



// Route config let's you map routes to components
const routes: Routes = [
  
  {
    path: '',
    component: MainPageComponent,
  },
  // map '/' to '/Main' as our default route
 /* {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },*/
  {
    path: 'asset/:symbol',
    component: AssetSummaryComponent
  },
  {
    path: 'assets',
    component: AssetsListComponent
  },
  {
    path: 'gold-ratio',
    component: GoldRatioComponent
  },
  {
    path: 'interest-rates',
    component: InterestRatesComponent
  },
    {
    path: 'ils-performance',
    component: IlsPerformanceComponent
  },
    {
    path: 'market-headlines',
    component: MarketHeadlinesComponent
  },
];


export const appRouterModule = RouterModule.forRoot(routes);