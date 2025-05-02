import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ShoppingListsComponent } from './pages/shopping-lists/shopping-lists.component';
import { ShoppingListDetailsComponent } from './pages/shopping-list-details/shopping-list-details.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', canActivate: [authGuard], component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'list', canActivate: [authGuard], component: ShoppingListsComponent },
  { path: 'list/:id', canActivate: [authGuard], component: ShoppingListDetailsComponent },
];
