import { Routes } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [{ path: 'create-user', component: CreateUserComponent },{ path: 'login', component: LoginComponent}];
