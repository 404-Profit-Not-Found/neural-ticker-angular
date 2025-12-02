import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/login-page/login-page.component';
import { TickerPageComponent } from './features/ticker-page/ticker-page.component';

export const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'ticker/:symbol', component: TickerPageComponent },
    { path: '', redirectTo: 'ticker/NVDA', pathMatch: 'full' },
];
