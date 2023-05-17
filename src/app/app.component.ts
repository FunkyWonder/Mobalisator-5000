import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import Swiper, { SwiperOptions } from 'swiper';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'node_modules/chart.js'
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid, GridsterComponentInterface, GridsterItemComponentInterface, GridsterItemComponent } from 'angular-gridster2';
import { randomHex, getFirstKey } from './utils';

export interface slide {
  hex: string;
  grid: {
    layout: Array<GridsterItem>
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor() {
    // Bind the method to the current instance of AppComponent
    this.onNewSlideClick = this.onNewSlideClick.bind(this);
    this.itemChange = this.itemChange.bind(this);
  }

  title = 'Mobalisator-5000';

  @ViewChild('swiperRef', { static: true })
  private _swiperRef!: ElementRef;
  swiper?: Swiper;

  swiperOptions: SwiperOptions = {
    slidesPerView: 1,
    zoom: true,
    enabled: true,
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    autoHeight: true,
    allowTouchMove: false,
    direction: 'vertical',
    keyboard: {
      enabled: true,
    },
    observer: true,
  };
  options: GridsterConfig = {};
  defaultDashboard: Array<GridsterItem> = [
    { cols: 2, rows: 1, y: 0, x: 0, id: randomHex() },
    { cols: 2, rows: 2, y: 0, x: 2, id: randomHex() }
  ];;

  // Save the function form utils here so that the app.component.html file can use it
  getFirstKey = getFirstKey;

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
    console.info('itemChanged', item, itemComponent);

    var hex = itemComponent.el.id;
    var items = [];
    for (let item in itemComponent.gridster.grid) { // Extract all the gridsterItemss from the itemComponents grid
      items.push(itemComponent.gridster.grid[item].item);
    }

    for (let slide in this.slidesArray) {
      if (this.slidesArray[slide].hex != hex) {
        return;
      }
      this.slidesArray[slide].grid.layout = items;
    }
    this.setConfig(this.slidesArray);
  }

  itemResize(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    //console.info('itemResized', item, itemComponent);
  }

  itemInit(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    //console.info('itemInitialized', item, itemComponent);
  }

  itemRemoved(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface,
  ): void {
    //console.info('itemRemoved', item, itemComponent);
  }

  itemValidate(item: GridsterItem): boolean {
    return item.cols > 0 && item.rows > 0;
  }

  gridInit(grid: GridsterComponentInterface): void {
    console.info('gridInit', grid);
  }

  gridDestroy(grid: GridsterComponentInterface): void {
    console.info('gridDestroy', grid);
  }

  gridSizeChanged(grid: GridsterComponentInterface): void {
    console.info('gridSizeChanged', grid);
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
    this.slidesArray.push({hex: newHex, grid: {layout: this.defaultDashboard}})
    this.setConfig(this.slidesArray);
  }

  onAddItemToTile(slideId: string) {
  }

  onRemoveTile(slideId: string, tileId: string) {
    // Get the correct slide using the slideId
    for (let slide in this.slidesArray) {
      if (this.slidesArray[slide].hex != slideId) {
        return;
      }
      var tiles: Array<GridsterItem> = this.slidesArray[slide].grid.layout;
      // Loop through tiles to select the one with tileId
      for (let tile in tiles as Array<GridsterItem>) {
        if (tiles[tile]['id'] == tileId) {
          // Remove the tile
          tiles.splice(Number(tile), 1);
          // Break out of the loop
          break;
        }
      }
      // Break out of the loop
      break;
    }
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

      this.slidesArray[slideNumber].grid.layout.push({ cols: 1, rows: 1, y: maxY+1, x: maxX+1, id: randomHex()});
      break;
    }    
    this.setConfig(this.slidesArray);
  }

  onClearConfig() {
    this.setConfig([]);
  }

  sidebarVisible: boolean = false;

  onSidebarOpen() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  slidesArray: Array<slide> = this.getConfig();

  ngOnInit() {
    const swiperEl = this._swiperRef.nativeElement
    Object.assign(swiperEl, this.swiperOptions)

    swiperEl.initialize()

    this.swiper = this._swiperRef.nativeElement.swiper

    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      initCallback: this.gridInit,
      destroyCallback: this.gridDestroy,
      gridSizeChangedCallback: this.gridSizeChanged,
      itemChangeCallback: this.itemChange,
      itemResizeCallback: this.itemResize,
      itemInitCallback: this.itemInit,
      itemRemovedCallback: this.itemRemoved,
      itemValidateCallback: this.itemValidate,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      useBodyForBreakpoint: false,
      minCols: 1,
      maxCols: 100,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 105,
      fixedRowHeight: 105,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      enableOccupiedCellDrop: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false
    };
  }
  ngAfterViewChecked() {
    // Update swiper after running ngfor so that the loaded pages appear
    this.swiper?.update()
  }
}

