import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MoviesComponent } from './movies/movies.component';
import { SerialsComponent } from './serials/serials.component';
import { AnimationsComponent } from './animations/animations.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { LogInComponent } from './log-in/log-in.component';
import { HttpClientModule } from '@angular/common/http';
import { MoviesPageComponent } from './movies/movies-page/movies-page.component';
import { AnimationsPageComponent } from './animations/animations-page/animations-page.component';
import { SerialsPageComponent } from './serials/serials-page/serials-page.component';
import { MediaDetailsComponent } from './media-details/media-details.component';
import { SearchedComponent } from './searched/searched.component';
import { SearchedPageComponent } from './searched/searched-page/searched-page.component';
import { ProfileComponent } from './profile/profile.component';
import { CommonModule } from '@angular/common';
import { AddMediaComponent } from './add-media/add-media.component';
import { EditMediaComponent } from './edit-media/edit-media.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomePageComponent,
    MoviesComponent,
    SerialsComponent,
    AnimationsComponent,
    FooterComponent,
    LogInComponent,
    MoviesPageComponent,
    AnimationsPageComponent,
    SerialsPageComponent,
    MediaDetailsComponent,
    SearchedComponent,
    SearchedPageComponent,
    ProfileComponent,
    AddMediaComponent,
    EditMediaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
