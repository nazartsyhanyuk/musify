import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpotifyService } from '../../../services/spotify.service';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss']
})
export class AlbumsListComponent implements OnInit {
  albums: any[] = [];
  subscription: Subscription;

  constructor(private _spotifyService: SpotifyService) {
    this.updateList();
  }

  ngOnInit() {
    this.getAlbums();
  }

  getAlbums() {
    this._spotifyService.getAlbums()
      .subscribe(
        (response: any) => {
          const { albums } = response;
          const { items } = albums;
          this.albums = items;
        },
        (error: any) => console.log(error));
  }

  updateList() {
    this.subscription = this._spotifyService.getMusic()
      .subscribe((response: any) => {
        const { items } = response;
        this.albums = items;
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getCoverImage(album: any) {
    return album && album.images.length ? album.images[1].url : '../assets/no-cover.jpg';
  }
}
