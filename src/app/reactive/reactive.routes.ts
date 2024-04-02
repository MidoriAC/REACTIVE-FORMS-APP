import { Routes } from '@angular/router';
import {
  BasicPageComponent,
  DinamicPageComponent,
  SwitchesPageComponent,
} from './pages';

export const ReactiveRoutes: Routes = [
  {
    path: 'basic',
    component: BasicPageComponent,
  },
  {
    path: 'dynamic',
    component: DinamicPageComponent,
  },
  {
    path: 'switches',
    component: SwitchesPageComponent,
  },
];
