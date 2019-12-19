import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatSliderModule,
  MatDividerModule,
  MatButtonModule
} from '@angular/material';

// modules
import { AppRoutingModule } from './app-routing.module';

// services
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { SpotifyApiService } from './services/spotify.service';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { AudioService } from './services/audio.service';

// components
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ItemsListComponent } from './components/items-list/items-list.component';
import { TrackListComponent } from './components/track-list/track-list.component';
import { AlbumComponent } from './components/album/album.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryComponent } from './components/category/category.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { TrackComponent } from './components/track/track.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    NavbarComponent,
    ItemsListComponent,
    TrackListComponent,
    AlbumComponent,
    ProfileComponent,
    CategoriesComponent,
    CategoryComponent,
    PlaylistComponent,
    TrackComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatSliderModule,
    MatDividerModule,
    MatButtonModule
  ],
  providers: [
    AuthService,
    HttpService,
    SpotifyApiService,
    AudioService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
