import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'victim/add',
    loadChildren: () =>
      import('./pages/victim/add-victim/add-victim.module').then(
        (m) => m.AddVictimPageModule
      ),
  },
  {
    path: 'victim/edit/:id',
    loadChildren: () =>
      import('./pages/victim/edit-victim/edit-victim.module').then(
        (m) => m.EditVictimPageModule
      ),
  },
  {
    path: 'input-otp',
    loadChildren: () =>
      import('./pages/input-otp/input-otp.module').then(
        (m) => m.InputOtpPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
