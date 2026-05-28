import { Doc } from './doc/doc';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: Doc },
  { path: ':slug', component: Doc }
];