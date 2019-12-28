import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpotifyApiService } from '../../services/spotify.service';
import { BackgroundService } from '../../services/background.service';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  albums: any[] = [];
  categories: any[] = [];
  testItems: any[] = [];
  subscription$: Subscription;

  constructor(private spotifyService: SpotifyApiService, private background: BackgroundService) {}

  ngOnInit() {
    this.getAlbums();
    this.getCategories();
    this.getSearchResult();
    this.experimental();
  }

  getCategories() {
    this.spotifyService.getCategories()
      .subscribe(({categories}) => {
        const { items } = categories;
        this.categories = items;
      });
  }

  experimental() {
    forkJoin(
      this.spotifyService.getCategories(),
      this.spotifyService.getAlbums()
    ).subscribe(data => {
      console.log(data);
      this.testItems = data.reduce((acc, item) => {
        const [[title, {items}]]: any = Object.entries(item);
        acc.push({title, items});
        return acc;
      }, []);

    });
  }

  getAlbums() {
    this.spotifyService.getAlbums()
      .subscribe(({albums}: any) => {
          const { items } = albums;
          this.albums = items;
          this.background.updateBackgroundUrl(items[0].images);
        },
        (error: any) => console.log(error));
  }

  getSearchResult() {
    this.subscription$ = this.spotifyService.dataList$
      .subscribe(({items}: any) => {
        this.albums = items;
        this.background.updateBackgroundUrl(items.length && items[0].images);
      });
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}
