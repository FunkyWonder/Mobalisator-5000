import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid, GridsterComponentInterface, GridsterItemComponentInterface, GridsterItemComponent } from 'angular-gridster2';
import { randomHex } from './utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TextItem, TileItem, Slide, ProjectBuildStatusItem, PictureItem, QueueStatusItem } from './interfaces';
import { GridsterCallbacks } from './gridster-callbacks';
import { swiperOptions, defaultDashboard, gridsterOptions, carouselAutoPlayOptions } from './config';
import { getProjectCoverage, projectCoverageToHexColor, getProjectStatus, getQueueDuration, getWebsiteStatus } from './api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog) {
    // Bind the method to the current instance of AppComponent
    this.onNewSlideClick = this.onNewSlideClick.bind(this);
    this.itemChange = this.itemChange.bind(this);

  }

  getProjectCoverage = getProjectCoverage;
  projectCoverageToHexColor = projectCoverageToHexColor;
  getProjectStatus = getProjectStatus;
  getQueueDuration = getQueueDuration;
  carouselAutoPlayOptions = carouselAutoPlayOptions;

  title = 'Mobalisator-5000';

  // Items which can be added to a tile
  // TODO: make it so that instead of matching a string with a particular interface we just straight up match the type
  tileItems = [
    { "friendly_name": "Text", "content": { type: "text", text: "Click to edit text!" } as TextItem },
    { "friendly_name": "Picture", "content": { type: "picture", path: "https://www.dewerkwijzer.nl/wp-content/uploads/2019/10/MOBA_logo.jpg" } as PictureItem },
    { "friendly_name": "Project Build Status", "content": { type: "project-build-status", title: "Project Build Status:", projectId: 381, status: "success" } as ProjectBuildStatusItem },
    { "friendly_name": "Queue Duration", "content": { type: "queue-status", title: "Queue Duration:" } as QueueStatusItem }
  ];

  queueMinutes: Number = 0;
  queueSeconds: Number = 0;

  private gridsterCallbacks: GridsterCallbacks = new GridsterCallbacks();
  completeGridsterOptions!: GridsterConfig;

  @ViewChild('swiperRef', { static: true })
  private _swiperRef!: ElementRef;
  swiper?: Swiper;

  getConfig() {
    var currentConfig = localStorage.getItem("project_config");
    // Generate a default config if no config was ever saved before
    if (currentConfig == null) {
      this.setConfig([]);
      return [];
    }
    return JSON.parse(currentConfig);
  };

  setConfig(config: Array<any>) {
    localStorage.setItem("project_config", JSON.stringify(config));
  }

  auto_play_duration: number = 60;

  setAutoplayDuration(duration: number) {
    localStorage.setItem("auto_play_duration", String(duration)); // in seconds
  }

  getAutoplayDuration(): number {
    var duration = localStorage.getItem("auto_play_duration"); // in seconds
    if (duration == null) {
      this.setAutoplayDuration(60);
      return 60; // 60 Seconds
    }
    return Number(duration);
  }

  itemChange(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    // console.info('itemChanged', item, itemComponent);

    var hex = itemComponent.el.id;
    const items = Object.values(itemComponent.gridster.grid).map((gridItem) => gridItem.item); // Retrieve the current grid
    const hexValues = this.slidesArray.map((item) => item.hex); // Put the hex values of every slide in an array
    this.slidesArray[hexValues.indexOf(hex)].grid.layout = items; // Update the slide we're on with the new items

    this.setConfig(this.slidesArray);
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

    if (event.key == " ") {
      this.onSidebarOpen();
      // Spacebar pressed
    }
  };

  onNewSlideClick() {
    var newHex = randomHex();
    this.slidesArray.push({ hex: newHex, grid: { layout: defaultDashboard, items: [] } })
    this.setConfig(this.slidesArray);
    this._snackBar.open("Slide added");
  }

  onRemoveTile(slideId: string, tileId: string) {
    // Prompt the user to make sure they want to remove the tile
    const dialogRef = this.dialog.open(ConfirmDialog, { data: { title: "Are you sure", subtitle: "Do you really want to remove this tile?", decline: "No", accept: "Yes" } });

    dialogRef.afterClosed().subscribe(result => {
      if (result != true) { // No was pressed
        return
      }

      const slideIdIndex = this.slidesArray.findIndex(slide => slide.hex === slideId);

      if (slideIdIndex === -1) {
        return; // Slide not found, exit the function
      }

      const slideTilesLayout = this.slidesArray[slideIdIndex].grid.layout;

      if (slideTilesLayout.length == 1) { // If the slide has no tiles left after we delete this one
        // Remove the slide
        this.slidesArray.splice(slideIdIndex, 1);
        this.setConfig(this.slidesArray);
        return;
      }

      const tileIdIndex = this.slidesArray[slideIdIndex].grid.layout.findIndex(tile => tile['id'] === tileId);

      if (tileIdIndex === -1) {
        return; // Tile not found, exit the function
      }

      slideTilesLayout.splice(tileIdIndex, 1); // Remove the tile

      this.slidesArray[slideIdIndex].grid.layout = slideTilesLayout

      this.setConfig(this.slidesArray);
    });
  }

  onAddContent(slideId: string, tileId: string, itemToPush: any) {
    const slideIdValues = Object.values(this.slidesArray).map((slide) => slide.hex); // Retrieve the current grid
    const slideIdIndex = slideIdValues.indexOf(slideId); // Get slide index

    console.log(itemToPush);

    // Check if the tile already has content, in that case we don't do anything
    const items = this.slidesArray[slideIdIndex].grid.items as Array<TileItem>;

    items.forEach((item) => {
      if (item.hex === tileId) {
        this._snackBar.open("Failed to add item to tile");
        return;
      }
    });

    itemToPush["hex"] = tileId;

    // Push the new content into the array
    this.slidesArray[slideIdIndex].grid.items?.push(itemToPush);

    // Update hasItem:
    const tileIdIndex = Object.values(this.slidesArray[slideIdIndex].grid.layout)
      .map(tile => tile['id'])
      .indexOf(tileId);

    this.slidesArray[slideIdIndex].grid.layout[tileIdIndex]['hasItem'] = true;

    this.setConfig(this.slidesArray);
  }

  updateTextContent(slideId: string, tileId: string, newTextEvent: Event) {
    console.log(Event);
  }

  onAddTile() {
    var slideIdIndex: number = this.swiper?.activeIndex as number;

    // Iterate over all slides and get the max x and y and add one to them to get the new position of the tile
    var maxX: number = 0;
    var maxY: number = 0;
    var tiles: Array<GridsterItem> = this.slidesArray[slideIdIndex].grid.layout;
    for (let tile in tiles) {
      if (tiles[tile].x + tiles[tile].cols > maxX) { // Add the width to the position to get the total width
        maxX = tiles[tile].x;
      }
      if (tiles[tile].y + tiles[tile].rows > maxY) { // Add the height to the position to get the total height
        maxY = tiles[tile].y;
      }
    }

    this.slidesArray[slideIdIndex].grid.layout.push({ cols: 1, rows: 1, y: maxY + 2, x: maxX + 2, id: randomHex() });

    this.setConfig(this.slidesArray);
  }

  onClearConfig() {
    // Prompt the user to make sure they want to clear the config
    const dialogRef = this.dialog.open(ConfirmDialog, { data: { title: "Are you sure", subtitle: "Do you really want to clear the config?", decline: "No", accept: "Yes" } });

    dialogRef.afterClosed().subscribe(result => {
      if (result != true) { // No was pressed
        return
      }

      this.setConfig([]);
      this.slidesArray = [];
      this._snackBar.open("Configuration wiped!");
    });
  }

  sidebarVisible: boolean = false;

  onSidebarOpen() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  slidesArray: Array<Slide> = this.getConfig();

  ngOnInit() {
    getWebsiteStatus("https://google.com");

    const swiperEl = this._swiperRef.nativeElement
    Object.assign(swiperEl,
      {
        ...swiperOptions,
        autoplay: {
          delay: this.auto_play_duration*1000, // Miliseconds to going back to autoplay
          disableOnInteraction: true,
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
    }, 1000);

    this.auto_play_duration = this.getAutoplayDuration();
  }

  ngAfterViewChecked() {
    // Update swiper after running ngfor so that the loaded pages appear
    this.swiper?.update()
  }
}

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  title: string;
  subtitle: string;
  decline: string;
  accept: string;
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class ConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}