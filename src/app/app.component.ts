import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import Swiper, { SwiperOptions } from 'swiper';
import { ktdTrackById, KtdGridLayout, KtdGridLayoutItem } from '@katoid/angular-grid-layout';
import { ktdArrayRemoveItem } from './utils';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'node_modules/chart.js'

interface Safe extends GridsterConfig {
  draggable: Draggable;
  resizable: Resizable;
  pushDirections: PushDirections;
}

@Component({
  standalone: true,
  imports: [NgForOf, GridsterComponent, GridsterItemComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Mobalisator-5000';

  randomHex = (): string => {
    let result = '';
    for (let i = 0; i < 7; ++i) {
      const value = Math.floor(16 * Math.random());
      result += value.toString(16);
    }
    return result;
  };

  options: Safe;
  dashboard: Array<GridsterItem>;

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
    { cols: 2, rows: 1, y: 0, x: 0 },
    { cols: 2, rows: 2, y: 0, x: 2 }
  ];;

  public getFirstKey(obj: any): string {
    return Object.keys(obj)[0];
  }

  getConfig() {
    var currentConfig = localStorage.getItem("project_config");
    // Generate a default config iåf no config was ever saved before
    if (currentConfig == null) {
      localStorage.setItem("project_config", "{}");
      return JSON.parse("{}");
    }

    return JSON.parse(currentConfig);
  };

  setConfig(config: Object) {
    localStorage.setItem("project_config", JSON.stringify(config));
    this.slidesArray = Object.entries(config).map(([key, value]) => ({ [key]: value }));
    console.log(config);
  }

  static itemChange(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    console.info('itemChanged', item, itemComponent);
    if (this.ignoreItemModification == false) {
      console.log("loading grid fom config");
      const appComponent = new AppComponent();
      var currentConfig = appComponent.getConfig();
      var hex = itemComponent.el.id;
      var items = [];
      for (let item in itemComponent.gridster.grid) { // Extract all items from the itemComponents grid
        items.push(itemComponent.gridster.grid[item].item);
      }
      currentConfig[hex].grid.layout = items;
      appComponent.setConfig(currentConfig);

      this.ignoreItemModification = true;
      setTimeout(() => {this.ignoreItemModification = false;}, 10000); // delay for one second

    }
  }

  static itemResize(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    //console.info('itemResized', item, itemComponent);
  }

  static itemInit(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    //console.info('itemInitialized', item, itemComponent);
  }

  static itemRemoved(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface,
  ): void {
    //console.info('itemRemoved', item, itemComponent);
  }

  static itemValidate(item: GridsterItem): boolean {
    return item.cols > 0 && item.rows > 0;
  }

  static ignoreItemModification: Boolean = false;

  static gridInit(grid: GridsterComponentInterface): void {
    console.info('gridInit', grid);
    // set a timer which is used to make sure that when items get resized it doesn't craete a infinite loop
    // if an item is resized within one second of initializing the grid, ignore the changes
    this.ignoreItemModification = true;
    console.log("ignoring item modificaiton");
    setTimeout(() => {this.ignoreItemModification = false;}, 10000); // delay for one second
  }

  static gridDestroy(grid: GridsterComponentInterface): void {
    //console.info('gridDestroy', grid);
  }

  static gridSizeChanged(grid: GridsterComponentInterface): void {
    //console.info('gridSizeChanged', grid);
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

  cols: number = 6;
  rowHeight: string = "fit";
  height: number = 100;
  disableRemove: boolean = false;


  onLayoutUpdated(event: KtdGridLayout, hex: string) {
    var newLayout = JSON.stringify(event);
    var currentConfig = this.getConfig();

    currentConfig[hex].grid.layout = newLayout
  };

  onNewSlideClick() {
    // Add slide to the beginning and save the amount of slides
    this.swiper?.appendSlide("<swiper-slide><h1>slide</h1></swiper-slide>");
    localStorage.setItem("project_count", this.swiper!.slides.length.toString());
  }

  onRestoreSlidesClick() {
    var slideCount = Number(localStorage.getItem("project_count"));
    for (let i = 0; i < slideCount; i++) {
      this.swiper?.appendSlide("<swiper-slide><h1>slide</h1></swiper-slide>");
    }
  }

  onAddTileClick() {
    const maxId = this.layout.reduce((acc, cur) => Math.max(acc, parseInt(cur.id, 10)), -1);
    const nextId = maxId + 1;

    const newLayoutItem: KtdGridLayoutItem = {
      id: nextId.toString(),
      x: 0,
      y: 0,
      w: 2,
      h: 2
    };

    // Important: Don't mutate the array, create new instance. This way notifies the Grid component that the layout has changed.
    currentConfig[hex].grid.layout = [
      newLayoutItem,
      ...currentConfig[hex].grid.layout
    ];
    this.setConfig(currentConfig);
    this.restoreSlides();
  }

  // used in the html to get the grid layout in correct form
  public getGridsterLayout(slide: string): GridsterItem[] {
    console.log(slide);
    console.log(this.getConfig()[slide]);
    console.log(this.getConfig()[slide]['grid']);
    console.log(this.getConfig()[slide]['grid']['layout']);

  /** Removes the item from the layout */
  removeItem(id: string, hex: string) {
    var currentConfig = this.getConfig();

    // Important: Don't mutate the array. Let Angular know that the layout has changed creating a new reference.
    // TODO: fix this
    // currentConfig[hex].grid.layout = ktdArrayRemoveItem(currentConfig[hex].grid.layout, (item) => item.id === id);
  }

  // onResetGrid() {
  //   this.layout = [
  //     { id: '0', x: 0, y: 0, w: 3, h: 3 },
  //     { id: '1', x: 3, y: 0, w: 3, h: 3 },
  //     { id: '2', x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
  //     { id: '3', x: 3, y: 3, w: 3, h: 3, minW: 2, maxW: 3, minH: 2, maxH: 5 },
  //   ];
  // }

  sidebarVisible: boolean = false;

  onSidebarOpen() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  slidesArray = Object.entries(this.getConfig()).map(([key, value]) => ({ [key]: value }));

  ngOnInit() {
    const swiperEl = this._swiperRef.nativeElement
    Object.assign(swiperEl, this.swiperOptions)

    swiperEl.initialize()

    this.swiper = this._swiperRef.nativeElement.swiper

    this.createChart()
  }
}

