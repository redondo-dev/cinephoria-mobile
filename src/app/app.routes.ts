import { Routes } from '@angular/router';
import { AuthGuard } from '../app/guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage),
    // canActivate: [AuthGuard]
  },
  {
    path: 'session-detail/:id',
    loadComponent: () => import('./pages/session-detail/session-detail.page').then( m => m.SessionDetailPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'qrcode-screen',
    loadComponent: () => import('./pages/qrcode-screen/qrcode-screen.page').then( m => m.QrcodeScreenPage)
  },
  {
  path: 'qrcode-screen/:id',
  loadComponent: () => import('./pages/qrcode-screen/qrcode-screen.page').then(m => m.QrcodeScreenPage),
  canActivate: [AuthGuard]
}
];
