import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViewHeaderComponent } from '../../components/view-header/view-header.component';
import { TrackListComponent } from '../../components/track-list/track-list.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CloudFiles } from '../../models/cloud.model';
import { CloudService } from '../../services/cloud.service';
import { Subscription } from 'rxjs';
import { CustomScrollbarDirective } from '../../directives/custom-scrollbar.directive';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
    ViewHeaderComponent,
    TrackListComponent,
    CommonModule,
    CustomScrollbarDirective,
  ],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements OnInit, OnDestroy {
  playlistFile!: CloudFiles;
  private cloudSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private cloudService: CloudService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.subscribeTo();
  }

  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const playlistId = params['id'];
      if (isPlatformBrowser(this.platformId)) {
        const files: CloudFiles = await this.cloudService.getFiles(playlistId);
        this.cloudService.setFiles(files);
      }
    });
  }

  ngOnDestroy(): void {
    this.cloudSubscription.unsubscribe();
  }

  private subscribeTo(): void {
    this.cloudSubscription = this.cloudService
      .observeFiles()
      .subscribe((files: CloudFiles) => {
        this.playlistFile = files;
      });
  }
}
