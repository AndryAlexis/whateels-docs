import { Doc } from './doc/doc';
import { Login } from './login/login';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: Doc },
  { path: 'login', component: Login }
];
