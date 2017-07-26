import { Routes,RouterModule } from '@angular/router';
import { SearchAssetComponent } from './search-asset/search-asset.component';
import { AssetSummaryComponent } from './asset-summary/asset-summary.component';
import { MainPageComponent } from './main-page/main-page.component';



// Route config let's you map routes to components
const routes: Routes = [
  
  {
    path: 'Main',
    component: MainPageComponent,
  },
  // map '/' to '/Main' as our default route
  {
    path: '',
    redirectTo: '/Main',
    pathMatch: 'full'
  },
  {
    path: 'asset/:symbol',
    component: AssetSummaryComponent
  }
];


export const appRouterModule = RouterModule.forRoot(routes);
