import { Component, ElementRef, ViewChild } from '@angular/core';
import Swiper, { SwiperOptions } from 'swiper';
import { ktdTrackById, KtdGridLayout } from '@katoid/angular-grid-layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mobalisator-5000';
  
  @ViewChild('swiperRef', { static: true })
  private _swiperRef!: ElementRef; 
  swiper?: Swiper

  options: SwiperOptions = {
    slidesPerView: 1,
    zoom: true,
    enabled: true,
    pagination: true,
    autoHeight: true,
    direction: 'vertical',
  }

  disableDrag = false;
  disableResize = false;
  disableRemove = false;
  autoResize = true;
  preventCollision = false;

  cols: number = 6;
  rowHeight: number = 100;
  layout: KtdGridLayout = [
      {id: '0', x: 0, y: 0, w: 3, h: 3},
      {id: '1', x: 3, y: 0, w: 3, h: 3},
      {id: '2', x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3},
      {id: '3', x: 3, y: 3, w: 3, h: 3, minW: 2, maxW: 3, minH: 2, maxH: 5},
  ];
  trackById = ktdTrackById

  onLayoutUpdated(event: KtdGridLayout) {

  };

  ngOnInit() {
    const swiperEl = this._swiperRef.nativeElement
    Object.assign(swiperEl, this.options)

    swiperEl.initialize()

    this.swiper = this._swiperRef.nativeElement.swiper
  }
}
