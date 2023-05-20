import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { register } from 'swiper/element/bundle';
import { GridsterComponent, GridsterModule } from 'angular-gridster2';
import { NgIconsModule } from '@ng-icons/core';
import { heroTrash, heroPlus } from '@ng-icons/heroicons/outline';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';


register();

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridsterModule,
    NgIconsModule.withIcons({ heroTrash, heroPlus }),
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
