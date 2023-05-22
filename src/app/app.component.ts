import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import Swiper from 'swiper';
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid, GridsterComponentInterface, GridsterItemComponentInterface, GridsterItemComponent } from 'angular-gridster2';
import { randomHex, getFirstKey } from './utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TextItem, TileItem, Slide } from './interfaces';
import { GridsterCallbacks } from './gridster-callbacks';
import { swiperOptions, defaultDashboard, gridsterOptions } from './config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private _snackBar: MatSnackBar) {
    // Bind the method to the current instance of AppComponent
    this.onNewSlideClick = this.onNewSlideClick.bind(this);
    this.itemChange = this.itemChange.bind(this);

  }

  title = 'Mobalisator-5000';

  // Items which can be added to a tile
  // TODO: make it so that instead of matching a string with a particular interface we just straight up match the type
  tileItems = ["text", "picture", "bar"];

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
    this.slidesArray.push({hex: newHex, grid: {layout: defaultDashboard, items: []}})
    this.setConfig(this.slidesArray);
    this._snackBar.open("Slide added");
  }

  onRemoveTile(slideId: string, tileId: string) {
    const slideIdIndex = this.slidesArray.findIndex(slide => slide.hex === slideId);

    if (slideIdIndex === -1) {
      return; // Slide not found, exit the function
    }
    
    const slideTilesLayout = this.slidesArray[slideIdIndex].grid.layout;
    const tileIdIndex = this.slidesArray[slideIdIndex].grid.layout.findIndex(tile => tile['id'] === tileId);
    
    if (tileIdIndex === -1) {
      return; // Tile not found, exit the function
    }
    
    slideTilesLayout.splice(tileIdIndex, 1); // Remove the tile

    this.slidesArray[slideIdIndex].grid.layout = slideTilesLayout

    this.setConfig(this.slidesArray);
  }

  onAddContent(slideId: string, tileId: string) {
    const slideIdValues = Object.values(this.slidesArray).map((slide) => slide.hex); // Retrieve the current grid
    const slideIdIndex = slideIdValues.indexOf(slideId); // Get slide index

    // Check if the tile already has content, in that case we don't do anything
    const items = this.slidesArray[slideIdIndex].grid.items as Array<TileItem>;

    items.forEach((item) => {
      if (item.hex === tileId) {
        this._snackBar.open("Failed to add item to tile");
       return;
      }
    });

    // Push the new content into the array
    this.slidesArray[slideIdIndex].grid.items?.push({hex: tileId, content: {type: "text", text: "text"} as TextItem});

    // Update hasItem:
    const tileIdIndex = Object.values(this.slidesArray[slideIdIndex].grid.layout)
    .map(tile => tile['id'])
    .indexOf(tileId);
    
    this.slidesArray[slideIdIndex].grid.layout[tileIdIndex]['hasItem'] = true;

    this.setConfig(this.slidesArray);
  }

  onAddTile() {
    var slideNumber: number = this.swiper?.activeIndex as number;

    var slideId: string = this.slidesArray[slideNumber].hex;

    // Of all the current Gridster items get the coordinates of where it is safe to add a new tile
    
    // Get current slide
    for (let slide in this.slidesArray) {
      if (this.slidesArray[slide].hex != slideId) {
        return;
      }
      // Current slide found

      // Iterate over all slides and get the max x and y and add one to them to get the new position of the tile
      var maxX: number = 0;
      var maxY: number = 0;
      var tiles: Array<GridsterItem> = this.slidesArray[slide].grid.layout;
      for (let tile in tiles) {
        if (tiles[tile].x + tiles[tile].cols > maxX) { // Add the width to the position to get the total width
          maxX = tiles[tile].x;
        } 
        if (tiles[tile].y + tiles[tile].rows > maxY) { // Add the height to the position to get the total height
          maxY = tiles[tile].y;
        } 
      }

      this.slidesArray[slideNumber].grid.layout.push({ cols: 1, rows: 1, y: maxY+2, x: maxX+2, id: randomHex()});
      break;
    }    
    this.setConfig(this.slidesArray);
  }

  onClearConfig() {
    this.setConfig([]);
    this.slidesArray = [];
    this._snackBar.open("Configuration wiped!");
  }

  sidebarVisible: boolean = false;

  onSidebarOpen() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  slidesArray: Array<Slide> = this.getConfig();

  ngOnInit() {
    const swiperEl = this._swiperRef.nativeElement
    Object.assign(swiperEl, swiperOptions)

    swiperEl.initialize()

    this.swiper = this._swiperRef.nativeElement.swiper
    this.completeGridsterOptions = { ...gridsterOptions, 
      itemChangeCallback: this.itemChange,
      itemResizeCallback: this.gridsterCallbacks.itemResize.bind(this),
      itemInitCallback: this.gridsterCallbacks.itemInit.bind(this),
      itemRemovedCallback: this.gridsterCallbacks.itemRemoved.bind(this),
      itemValidateCallback: this.gridsterCallbacks.itemValidate.bind(this),
      gridInitCallback: this.gridsterCallbacks.gridInit.bind(this),
      gridDestroyCallback: this.gridsterCallbacks.gridDestroy.bind(this),
      gridSizeChangedCallback: this.gridsterCallbacks.gridSizeChanged.bind(this),
    };
  }
  ngAfterViewChecked() {
    // Update swiper after running ngfor so that the loaded pages appear
    this.swiper?.update()
  }
}

