import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccessDeniedComponent } from './errors/access-denied/access-denied.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot([
    { path: 'home', component: HomeComponent },
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'products', loadChildren: () => import ('src/app/products/products.module').then(m => m.ProductsModule)},
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'access-denied', component: AccessDeniedComponent },
    { path: '**', redirectTo: '/home' }
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
