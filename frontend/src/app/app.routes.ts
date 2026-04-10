import { Routes } from '@angular/router';
import { DeviceListComponent } from './device-list/device-list';
import { AuthenticationComponent } from './authentication/authentication';

export const routes: Routes = [
  {
    path: '',
    component: DeviceListComponent
  },
  {
    path: 'auth',
    component: AuthenticationComponent
  }
];
