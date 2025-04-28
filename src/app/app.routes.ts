import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ShoppingListsComponent } from './pages/shopping-lists/shopping-lists.component';
import { ShoppingListDetailsComponent } from './pages/shopping-list-details/shopping-list-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'list', component: ShoppingListsComponent },
  { path: 'list/:id', component: ShoppingListDetailsComponent },
];
