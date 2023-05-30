import { Component, ElementRef, HostListener, Inject, NgModule, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid, GridsterComponentInterface, GridsterItemComponentInterface, GridsterItemComponent } from 'angular-gridster2';
import { randomHex, isNumber } from './utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TextItem, TileItem, Slide, ProjectBuildStatusItem, PictureItem, QueueStatusItem, ProjectIdItem, LastActivityItem, ApiStatusItem } from './interfaces';
import { GridsterCallbacks } from './gridster-callbacks';
import { swiperOptions, defaultDashboard, gridsterOptions, carouselAutoPlayOptions, tileItems } from './config';
import { getProjectCoverage, projectCoverageToHexColor, getProjectStatus, getQueueDuration, getLastActivity } from './api';
import { HttpClient } from '@angular/common/http';
import { ajax } from 'rxjs/ajax';
import { ConfigurationService } from './services/configuration.service';
import { SwipeService } from './services/swiper.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private http: HttpClient,
    public ConfigurationService: ConfigurationService,
    private SwipeService: SwipeService,
  ) {
    this.setupMethods();
  }

  // Methods
  private setupMethods(): void {
    this.itemChange = this.itemChange.bind(this);
  }


  getProjectCoverage = getProjectCoverage;
  projectCoverageToHexColor = projectCoverageToHexColor;
  getProjectStatus = getProjectStatus;
  getQueueDuration = getQueueDuration;
  getLastActivity = getLastActivity;
  tileItems = tileItems;
  carouselAutoPlayOptions = carouselAutoPlayOptions;

  title = 'Mobalisator-5000';

  @ViewChild('swiperRef',
    {
      static: true,
    })
  _swiperRef!: ElementRef;
  swiper?: Swiper;

  // getApiStatus(url: string) {
  //   const apiData = ajax(url);
  //   apiData.subscribe(res => this.responseStatus = res.status);
  // }

  queueMinutes: Number = 0;
  queueSeconds: Number = 0;

  private gridsterCallbacks: GridsterCallbacks = new GridsterCallbacks();
  completeGridsterOptions!: GridsterConfig;

  itemChange(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    // console.info('itemChanged', item, itemComponent);

    var hex = itemComponent.el.id;
    const items = Object.values(itemComponent.gridster.grid).map((gridItem) => gridItem.item); // Retrieve the current grid
    const hexValues = this.ConfigurationService.slidesArray.map((item) => item.hex); // Put the hex values of every slide in an array
    this.ConfigurationService.slidesArray[hexValues.indexOf(hex)].grid.layout = items; // Update the slide we're on with the new items

    this.ConfigurationService.setConfig(this.ConfigurationService.slidesArray);
  }

  @HostListener('document:keypress', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.key == "arrowup") {
      this.swiper?.slidePrev();
      //Up arrow pressed
    }

    if (event.key == "arrowdown") {
      this.swiper?.slideNext();
      //Down arrow pressed
    }
  };

  onRemoveTile(slideId: string, tileId: string) {
    // Prompt the user to make sure they want to remove the tile
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: "Are you sure", subtitle: "Do you really want to remove this tile?", decline: "No", accept: "Yes" } });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result != true) { // No was pressed
        return
      }

      const slideIdIndex = this.ConfigurationService.slidesArray.findIndex(slide => slide.hex === slideId);

      if (slideIdIndex === -1) {
        return; // Slide not found, exit the function
      }

      const slideTilesLayout = this.ConfigurationService.slidesArray[slideIdIndex].grid.layout;

      if (slideTilesLayout.length == 1) { // If the slide has no tiles left after we delete this one
        // Remove the slide
        this.ConfigurationService.slidesArray.splice(slideIdIndex, 1);
        this.ConfigurationService.setConfig(this.ConfigurationService.slidesArray);
        return;
      }

      const tileIdIndex = this.ConfigurationService.slidesArray[slideIdIndex].grid.layout.findIndex(tile => tile['id'] === tileId);

      if (tileIdIndex === -1) {
        return; // Tile not found, exit the function
      }

      slideTilesLayout.splice(tileIdIndex, 1); // Remove the tile

      this.ConfigurationService.slidesArray[slideIdIndex].grid.layout = slideTilesLayout

      this.ConfigurationService.setConfig(this.ConfigurationService.slidesArray);
    });
  }

  onAddContent(slideId: string, tileId: string, itemToPush: any) {
    const slideIdValues = Object.values(this.ConfigurationService.slidesArray).map((slide) => slide.hex); // Retrieve the current grid
    const slideIdIndex = slideIdValues.indexOf(slideId); // Get slide index

    // Check if the tile already has content, in that case we don't do anything
    const items = this.ConfigurationService.slidesArray[slideIdIndex].grid.items as Array<TileItem>;

    items.forEach((item) => {
      if (item.hex === tileId) {
        this._snackBar.open("Failed to add item to tile");
        return;
      }
    });

    itemToPush["hex"] = tileId;

    // Push the new content into the array
    this.ConfigurationService.slidesArray[slideIdIndex].grid.items?.push(itemToPush);

    // Update hasItem:
    const tileIdIndex = Object.values(this.ConfigurationService.slidesArray[slideIdIndex].grid.layout)
      .map(tile => tile['id'])
      .indexOf(tileId);

    this.ConfigurationService.slidesArray[slideIdIndex].grid.layout[tileIdIndex]['hasItem'] = true;

    this.ConfigurationService.setConfig(this.ConfigurationService.slidesArray);
  }

  updateTextContent(slideId: string, tileId: string, newTextEvent: Event) {
    console.log(Event);
  }

  updateInfo() {
    // Update all info values in this.slidesArray
    for (let slide in this.ConfigurationService.slidesArray) {
      var projectId = this.ConfigurationService.slidesArray[slide].projectId;
      this.ConfigurationService.slidesArray[slide].info.last_activity_at = getLastActivity(projectId);
      this.ConfigurationService.slidesArray[slide].info.project_status.color = projectCoverageToHexColor(getProjectCoverage(projectId));
      this.ConfigurationService.slidesArray[slide].info.project_status.status = getProjectStatus(projectId);
    }
  }

  ngOnInit() {
    // this.getApiStatus("https://jsonplaceholder.typicode.com");
    // console.log(this.responseStatus);

    this.ConfigurationService.auto_play_duration = this.ConfigurationService.getAutoplayDuration();

    const swiperEl = this._swiperRef.nativeElement
    Object.assign(swiperEl,
      {
        ...swiperOptions,
        autoplay: {
          delay: this.ConfigurationService.auto_play_duration * 1000, // Miliseconds to going back to autoplay
          disableOnInteraction: false,
        }
      })

    swiperEl.initialize()

    this.swiper = this._swiperRef.nativeElement.swiper
    this.completeGridsterOptions = {
      ...gridsterOptions,
      itemChangeCallback: this.itemChange,
      itemResizeCallback: this.gridsterCallbacks.itemResize.bind(this),
      itemInitCallback: this.gridsterCallbacks.itemInit.bind(this),
      itemRemovedCallback: this.gridsterCallbacks.itemRemoved.bind(this),
      itemValidateCallback: this.gridsterCallbacks.itemValidate.bind(this),
      gridInitCallback: this.gridsterCallbacks.gridInit.bind(this),
      gridDestroyCallback: this.gridsterCallbacks.gridDestroy.bind(this),
      gridSizeChangedCallback: this.gridsterCallbacks.gridSizeChanged.bind(this),
    };

    // Call getQueueDuration() every second
    setInterval(() => {
      const queueDuration = this.getQueueDuration();
      this.queueMinutes = queueDuration.minutes;
      this.queueSeconds = queueDuration.seconds;
      this.updateInfo();
    }, 1000);

    setInterval(() => {
      if (this.swiper?.activeIndex !== undefined) {
        this.SwipeService.activeIndex = this.swiper?.activeIndex;
      }
    }, 100);

  }

  ngAfterViewChecked() {
    // Update swiper after running ngfor so that the loaded pages appear
    this.swiper?.update()
  }
}

