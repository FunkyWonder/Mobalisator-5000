import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import Swiper, { SwiperOptions } from 'swiper';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'node_modules/chart.js'
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid, GridsterComponentInterface, GridsterItemComponentInterface, GridsterItemComponent}  from 'angular-gridster2';


@Component({
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
    console.log(currentConfig);
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
      // const appComponent = new AppComponent();
      // var currentConfig = appComponent.getConfig();
      // var hex = itemComponent.el.id;
      // var items = [];
      // for (let item in itemComponent.gridster.grid) { // Extract all items from the itemComponents grid
      //   items.push(itemComponent.gridster.grid[item].item);
      // }
      // currentConfig[hex].grid.layout = items;
      // appComponent.setConfig(currentConfig);

      // this.ignoreItemModification = true;
      // setTimeout(() => {this.ignoreItemModification = false;}, 10000); // delay for one second

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

  onNewSlideClick() {
    // 1) Add a new project to the global project configuration file
    // 1.1) Retrieve current config
    var currentConfig = this.getConfig();
    // 1.2) Add a new project
    var hex = this.randomHex();
    currentConfig[hex] = {};
    currentConfig[hex].grid = {};
    currentConfig[hex].grid.layout = this.defaultDashboard;

    // 2) Add the slide to the page, the page automatically updates
    this.setConfig(currentConfig);
  }

  onClearConfig(){
    this.setConfig({});
  }

  // used in the html to get the grid layout in correct form
  public getGridsterLayout(slide: string): GridsterItem[] {
    return this.getConfig()[slide]['grid']['layout'] as Array<GridsterItem>;
  }

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

    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      initCallback: AppComponent.gridInit,
      destroyCallback: AppComponent.gridDestroy,
      gridSizeChangedCallback: AppComponent.gridSizeChanged,
      itemChangeCallback: AppComponent.itemChange,
      itemResizeCallback: AppComponent.itemResize,
      itemInitCallback: AppComponent.itemInit,
      itemRemovedCallback: AppComponent.itemRemoved,
      itemValidateCallback: AppComponent.itemValidate,
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

