import { Component, HostListener } from '@angular/core';
import { randomHex, isNumber } from '../utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { swiperOptions, defaultDashboard, gridsterOptions, carouselAutoPlayOptions, tileItems } from '../config';
import { getProjectCoverage, projectCoverageToHexColor, getProjectStatus, getQueueDuration, getLastActivity } from '../api';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ProjectIdDialogComponent } from '../project-id-dialog/project-id-dialog.component';
import { ConfigurationService } from '../services/configuration.service'
import { SwipeService } from '../services/swiper.service'
import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid, GridsterComponentInterface, GridsterItemComponentInterface, GridsterItemComponent } from 'angular-gridster2';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private http: HttpClient,
    public ConfigurationService: ConfigurationService,
    private SwipeService: SwipeService,
  ) {
    this.setupMethods();
  }

  // Methods
  private setupMethods(): void {
    this.onNewSlideClick = this.onNewSlideClick.bind(this);
  }

  carouselAutoPlayOptions = carouselAutoPlayOptions;

  auto_play_duration: number = this.ConfigurationService.getAutoplayDuration();

  onClearConfig() {
    // Prompt the user to make sure they want to clear the config
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: "Are you sure", subtitle: "Do you really want to clear the config?", decline: "No", accept: "Yes" } });

    dialogRef.afterClosed().subscribe(result => {
      if (result != true) { // No was pressed
        return
      }

      this.ConfigurationService.setConfig([]);
      this.ConfigurationService.slidesArray = [];
      this._snackBar.open("Configuration wiped!");
    });
  }

  onNewSlideClick() {
    var newHex = randomHex();
    const dialogRef = this.dialog.open(ProjectIdDialogComponent, { data: { title: "Project ID", subtitle: "A project ID is to view project information", accept: "Confirm", projectId: 0 } });
    dialogRef.afterClosed().subscribe(result => {
      var newHex = randomHex();
      if (isNumber(result) != true) {
        this._snackBar.open("Failed to add slide. The given project ID wasn't a number.");
        return;
      }
      this.ConfigurationService.slidesArray.push({
        hex: newHex,
        projectId: Number(result),
        grid: { layout: defaultDashboard, items: [] },
        info: {
          last_activity_at: getLastActivity(Number(result)),
          project_status: {
            color: projectCoverageToHexColor(getProjectCoverage(Number(result))),
            status: getProjectStatus(Number(result)),
          }
        }
      })
      this.ConfigurationService.setConfig(this.ConfigurationService.slidesArray);
      this._snackBar.open("Slide added");
    });
  }

  onAddTile() {
    var slideIdIndex: number = this.SwipeService.activeIndex as number;

    // Iterate over all slides and get the max x and y and add one to them to get the new position of the tile
    var maxX: number = 0;
    var maxY: number = 0;
    var tiles: Array<GridsterItem> = this.ConfigurationService.slidesArray[slideIdIndex].grid.layout;
    for (let tile in tiles) {
      if (tiles[tile].x + tiles[tile].cols > maxX) { // Add the width to the position to get the total width
        maxX = tiles[tile].x;
      }
      if (tiles[tile].y + tiles[tile].rows > maxY) { // Add the height to the position to get the total height
        maxY = tiles[tile].y;
      }
    }

    this.ConfigurationService.slidesArray[slideIdIndex].grid.layout.push({ cols: 1, rows: 1, y: maxY + 2, x: maxX + 2, id: randomHex() });

    this.ConfigurationService.setConfig(this.ConfigurationService.slidesArray);
  }

  // Open and closing of sidebar
  sidebarVisible: boolean = false;

  onSidebarOpen() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  @HostListener('document:keypress', ['$event'])
  keyDown(event: KeyboardEvent) {
    if (event.key == " ") {
      this.onSidebarOpen();
      // Spacebar pressed
    }
  };
}
