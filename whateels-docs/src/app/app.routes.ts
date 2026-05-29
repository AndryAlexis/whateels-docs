import { Doc } from './doc/doc';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'category_0/introduction' },
  { path: ':category/:page', component: Doc }
];