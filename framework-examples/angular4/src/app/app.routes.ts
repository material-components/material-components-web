﻿import { Routes } from '@angular/router';
import { Home } from './components/home';

export const appRoutes: Routes = [
  { path: '', component: Home },
  { path: '**', redirectTo: '' }
];