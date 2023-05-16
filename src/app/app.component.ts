import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import Swiper, { SwiperOptions } from 'swiper';
import { ktdTrackById, KtdGridLayout, KtdGridLayoutItem } from '@katoid/angular-grid-layout';
import { ktdArrayRemoveItem } from './utils';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'node_modules/chart.js'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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

  options: SwiperOptions = {
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

  defaultCols: number = 6;
  defaultRowHeight: string = "fit";
  defaultHeight: number = 100;

  defaultLayout: KtdGridLayout = [
    { id: '0', x: 0, y: 0, w: 3, h: 3 }, // id 0 always contains the project title which also serves as the project unique identifier
    { id: '1', x: 3, y: 0, w: 3, h: 3 },
    { id: '2', x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
    { id: '3', x: 3, y: 3, w: 3, h: 3, minW: 2, maxW: 3, minH: 2, maxH: 5 },
  ];
  trackById = ktdTrackById;

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
  }


  onLayoutUpdated(event: KtdGridLayout, hex: string) {
    var newLayout = JSON.stringify(event);
    var currentConfig = this.getConfig();

    currentConfig[hex].grid.layout = newLayout
  };

  onNewSlideClick() {
    // 1) Add a new project to the global project configuration file
    // 1.1) Retrieve current config
    var currentConfig = this.getConfig();
    // 1.2) Add a new project
    var hex = this.randomHex();
    currentConfig[hex] = {};
    currentConfig[hex].grid = {};

    // 2) Add the slide to the page
    // TODO: add content back which was located on the slide
    currentConfig[hex].grid.cols = this.defaultCols;
    currentConfig[hex].grid.rowHeight = this.defaultRowHeight;
    currentConfig[hex].grid.height = this.defaultHeight;
    currentConfig[hex].grid.layout = this.defaultLayout;

    this.setConfig(currentConfig);

    this.restoreSlides();
  }

  onRestoreSlidesClick() {
    this.restoreSlides();
  }

  restoreSlides() {
    var currentConfig = this.getConfig();
    console.log(currentConfig);
    var slideCount = Object.keys(currentConfig).length;
    // If slideCount has never been saved
    if (slideCount == null) {
      return
    }

    for (let i = 0; i < Number(slideCount); i++) {
      var hex = currentConfig[slideCount];
      console.log(currentConfig[slideCount]);
      console.log(currentConfig["8557715"]);
      console.log(currentConfig[slideCount]['grid']);
      var cols = currentConfig[slideCount].grid.cols;
      if (cols == null) {
        cols = this.defaultCols;
      }
      var rowHeight = currentConfig[slideCount].grid.rowHeight;
      if (rowHeight == null) {
        rowHeight = this.defaultRowHeight;
      }
      var height = currentConfig[slideCount].grid.height;
      if (height == null) {
        height = this.defaultHeight;
      }
      var layout = currentConfig[slideCount].grid.layout;
      if (layout == null) {
        layout = this.defaultLayout;
      }

      // TODO: add content back which was located on the slide
      this.swiper?.appendSlide(`
      <swiper-slide>
      <ktd-grid [cols]="${cols}" [rowHeight]="${rowHeight}" [layout]="${layout}" (layoutUpdated)="onLayoutUpdated($event, ${hex})">
        <ktd-grid-item *ngFor="let item of ${layout}; trackBy:trackById" [id]="item.id">
          <!-- Your grid item content goes here -->
          <h1>Text</h1>
          <div class="grid-item-remove-handle" *ngIf="!disableRemove" (mousedown)="stopEventPropagation($event)"
            (click)="removeItem(item.id)">
            <h1>Remove</h1>
          </div>
        </ktd-grid-item>
      </ktd-grid>
      <button class="button" (click)="onAddTileClick(${hex})">Add tile</button>
      </swiper-slide>`
      );
    }
  }

  onAddTileClick(hex: string) {
    var currentConfig = this.getConfig();
    const maxId = currentConfig[hex].grid.layout.reduce((acc: number, cur: { id: string; }) => Math.max(acc, parseInt(cur.id, 10)), -1);
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

  /**
  * Fired when a mousedown happens on the remove grid item button.
  * Stops the event from propagating an causing the drag to start.
  * We don't want to drag when mousedown is fired on remove icon button.
  */
  stopEventPropagation(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

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

  // TODO: this needs clean up
  createChart(): void {
    Chart.register(...registerables);

    const data = {
      labels: ['January', 'February', 'March', 'April', 'May'],
      datasets: [{
        label: 'My First dataset',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [10, 5, 2, 20, 30, 45],
      }]
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          display: false
        }
      }
    }
    const config: ChartConfiguration = {
      type: 'line',
      data: data,
      options: options
    }
    const chartItem: ChartItem = document.getElementById('test-chart') as ChartItem;

    new Chart(chartItem, config);
  }

  ngOnInit() {
    const swiperEl = this._swiperRef.nativeElement
    Object.assign(swiperEl, this.options)

    swiperEl.initialize()

    this.swiper = this._swiperRef.nativeElement.swiper

    this.createChart()
  }
}
