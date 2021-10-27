import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';

// Mfx- Custom Logout and Register components that
// replace NbLogoutComponent and NbRegisterComponent
import { LogoutComponent } from './pages/logout/logout.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth/auth-guard.service';

export const routes: Routes = [
  {
    path: 'pages',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
      },
    ],
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
