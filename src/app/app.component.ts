import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import Swiper, { SwiperOptions } from 'swiper';
import { ktdTrackById, KtdGridLayout, KtdGridLayoutItem } from '@katoid/angular-grid-layout';
import { NgStyle } from '@angular/common';

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
    // Add slide to the beginning
    this.swiper?.appendSlide("<swiper-slide><h1>slide</h1></swiper-slide>");
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

  ngOnInit() {
    const swiperEl = this._swiperRef.nativeElement
    Object.assign(swiperEl, this.options)

    swiperEl.initialize()

    this.swiper = this._swiperRef.nativeElement.swiper
  }
}
