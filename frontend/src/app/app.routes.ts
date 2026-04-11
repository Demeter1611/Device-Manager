import { Routes } from '@angular/router';
import { DeviceListComponent } from './device-list/device-list';
import { AuthenticationComponent } from './authentication/authentication';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  {
    path: 'devices',
    component: DeviceListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    component: AuthenticationComponent
  },
  {
    path: '',
    redirectTo: '/devices',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/devices'
  }
];
