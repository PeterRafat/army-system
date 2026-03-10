import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { RecommendationsComponent } from './pages/recommendations/recommendations.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'search', component: SearchComponent },
  { path: 'recommendations', component: RecommendationsComponent },
  { path: '**', redirectTo: '' }
];
