import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { MoviesComponent } from './movies/movies.component';
import { SerialsComponent } from './serials/serials.component';
import { AnimationsComponent } from './animations/animations.component';
import { LogInComponent } from './log-in/log-in.component';
import { MoviesPageComponent } from './movies/movies-page/movies-page.component';
import { SerialsPageComponent } from './serials/serials-page/serials-page.component';
import { AnimationsPageComponent } from './animations/animations-page/animations-page.component';
import { MediaDetailsComponent } from './media-details/media-details.component';
import { SearchedPageComponent } from './searched/searched-page/searched-page.component';
import { ProfileComponent } from './profile/profile.component';
import { AddMediaComponent } from './add-media/add-media.component';
import { EditMediaComponent } from './edit-media/edit-media.component';

const routes: Routes = [
  {path:"", component:HomePageComponent},
  { path: "movies", component: MoviesComponent, children: [
    { path: "page/:page", component: MoviesPageComponent }
  ]}, 
  { path:"animations", component:AnimationsComponent, children: [
    { path:"page/:page", component: AnimationsPageComponent }
  ]},
  { path:"serials", component:SerialsComponent, children: [ 
    { path:"page/:page", component: SerialsPageComponent }
  ]},
  { path:"logIn", component: LogInComponent },
  { path: 'profile', component: ProfileComponent },

  { path: '', redirectTo: '/movies/page/1', pathMatch: 'full' },

  { path: 'movies/page/:page', component: MoviesPageComponent },
  { path: 'animations/page/:page', component: AnimationsPageComponent },
  { path: 'serials/page/:page', component: SerialsPageComponent },

  { path: 'admin/upload', component: AddMediaComponent },

  { path: 'edit-media/:id', component: EditMediaComponent },

  { path: 'search', component: SearchedPageComponent }, 

  { path: ':type/:id', component: MediaDetailsComponent },

  { path: '**', redirectTo: '/movies/page/1' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
