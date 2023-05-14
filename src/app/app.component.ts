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

  slides = 3;
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

  cols: number = 6;
  rowHeight: string = "fit";
  height: number = 100;
  disableRemove: boolean = false;

  layout: KtdGridLayout = [
    { id: '0', x: 0, y: 0, w: 3, h: 3 },
    { id: '1', x: 3, y: 0, w: 3, h: 3 },
    { id: '2', x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
    { id: '3', x: 3, y: 3, w: 3, h: 3, minW: 2, maxW: 3, minH: 2, maxH: 5 },
  ];
  trackById = ktdTrackById;

  onLayoutUpdated(event: KtdGridLayout) {
    var newLayout = JSON.stringify(event);
    var currentPageIndex = this.swiper?.activeIndex;
    localStorage.setItem("project" + currentPageIndex, newLayout);
    console.log("Saving layout: " + newLayout + " on page " + currentPageIndex);
  };

  onRestoreGridClick() {
    var currentPageIndex = this.swiper?.activeIndex;
    var newLayout = localStorage.getItem("project" + currentPageIndex);
    console.log("Loading config: " + newLayout);
    this.layout = JSON.parse(newLayout!);
  }

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
    this.layout = [
      newLayoutItem,
      ...this.layout
    ];
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
  removeItem(id: string) {
    // Important: Don't mutate the array. Let Angular know that the layout has changed creating a new reference.
    this.layout = ktdArrayRemoveItem(this.layout, (item) => item.id === id);
  }

  onResetGrid() {
    this.layout = [
      { id: '0', x: 0, y: 0, w: 3, h: 3 },
      { id: '1', x: 3, y: 0, w: 3, h: 3 },
      { id: '2', x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3 },
      { id: '3', x: 3, y: 3, w: 3, h: 3, minW: 2, maxW: 3, minH: 2, maxH: 5 },
    ];
  }

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
