import { ElementRef, Injectable, ViewChild } from '@angular/core';
import Swiper from 'swiper';

@Injectable({
    providedIn: 'root'
})
export class SwipeService {
    activeIndex: number = 0;
}