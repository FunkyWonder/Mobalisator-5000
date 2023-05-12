import { Component, ElementRef, ViewChild } from '@angular/core';
import Swiper, { SwiperOptions } from 'swiper';

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

  ngOnInit() {
    const swiperEl = this._swiperRef.nativeElement
    Object.assign(swiperEl, this.options)

    swiperEl.initialize()

    this.swiper = this._swiperRef.nativeElement.swiper
  }
}
