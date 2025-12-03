import { Routes } from '@angular/router';
import { LoginPageComponent } from './features/login-page/login-page.component';
import { TickerPageComponent } from './features/ticker-page/ticker-page.component';
import { ShellComponent } from './features/shell/shell.component';

export const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    {
        path: '',
        component: ShellComponent,
        children: [
            { path: 'ticker/:symbol', component: TickerPageComponent },
            { path: '', redirectTo: 'ticker/NVDA', pathMatch: 'full' }, // Default dashboard view
        ]
    },
    { path: '**', redirectTo: '' } // Fallback to dashboard
];
