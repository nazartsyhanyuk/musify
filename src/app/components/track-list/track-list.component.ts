import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { state, style, transition, animate, trigger } from '@angular/animations';
import * as moment from 'moment';

import { SpotifyApiService } from '../../services/spotify.service';
import { AudioService } from '../../services/audio.service';
import { ITrack, StreamState } from '../../types/interfaces';
import { BackgroundService } from '../../services/background.service';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class TrackListComponent implements OnInit {
  public tracks: ITrack[] = [];
  public albumName: string;
  public isPlaylistClosed = true;
  public currentTime$ = new Subject();
  public state: StreamState;
  public currentTrack: ITrack;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyApiService,
    private audioService: AudioService,
    private background: BackgroundService
  ) {
    this.audioService.getState().subscribe(newState => {
      this.state = newState;
    });
  }

  ngOnInit() {
    const albumId = this.route.snapshot.paramMap.get('id');
    this.spotifyService.getAlbum(albumId)
      .subscribe(({ name, tracks, images }: any) => {
        this.background.updateBackgroundUrl(images);
        const audioID = this.audioService.getAudioID();
        this.albumName = name;
        const serviceTracks: ITrack[] = this.audioService.getTrackList();
        if (serviceTracks.length && serviceTracks[0].name === tracks.items[0].name) {
          return this.tracks = serviceTracks;
        }
        this.tracks = tracks.items.map(track => {
          if (audioID === track.id) {
            this.currentTrack = track;
            track.isPlaying = true;
          }
          return track;
        });
      },
        (error: any) => console.log(error)
      );
  }

  playStream(track: ITrack) {
    this.currentTrack = track;
    this.audioService.playStream(track, this.tracks).subscribe((event: Event) => {
      if (event.type === 'ended') {
        // setting track list when switching between albums
        const trackId = this.audioService.getAudioID();
        this.currentTrack = this.tracks.find(track => track.id === trackId);
        this.tracks = this.audioService.getTrackList();
        this.playNextTrack();
      }
    });
  }

  playPause(track: ITrack) {
    if (track.isPlaying) {
      this.pause(track);
    } else {
      this.play(track);
    }
  }

  pause(track: ITrack) {
    track.isPlaying = false;
    this.audioService.pause();
  }

  play(track: ITrack) {
    const id = this.audioService.getAudioID();
    this.stopOtherTracks();
    track.isPlaying = true;
    if (id === track.id) {
      this.audioService.play();
    } else {
      if (this.currentTrack) {
        this.currentTrack.isPlaying = false;
      }
      this.playStream(track);
    }
  }

  stop() {
    this.currentTrack.isPlaying = false;
    this.audioService.stop();
  }

  stopOtherTracks() {
    this.tracks.map(track => {
      track.isPlaying = false;
    });
  }

  onSliderTimeChanged(change) {
    this.audioService.rewindTo(change.value);
  }

  togglePlaylist() {
    this.isPlaylistClosed = !this.isPlaylistClosed;
  }

  displayMillisecInMinSec(ms: number) {
    return moment(ms).format('m:ss');
  }

  playNextTrack() {
    const currentTrackNumber = this.currentTrack.track_number;
    const nextTrack = this.tracks.find(track => track.track_number - 1 === currentTrackNumber);
    const isTrackListEnd = this.tracks.length === currentTrackNumber;
    this.stop();
    if (isTrackListEnd) return;
    this.play(nextTrack);
  }
}
