import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ajax } from 'rxjs/ajax';
import { ApiDialogComponent } from '../api-dialog/api-dialog.component';
import { ApiStatusItem, TileItem } from '../interfaces';
import { ConfigurationService } from '../services/configuration.service'
import { SwipeService } from '../services/swiper.service'
import { isNumber } from '../utils';

@Component({
  selector: 'api-tile',
  templateUrl: './api-tile.component.html',
  styleUrls: ['./api-tile.component.css']
})
export class ApiTileComponent {
  constructor(   
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public ConfigurationService: ConfigurationService,
    private SwipeService: SwipeService,) {
  }

  @Input() tileId!: string;
  @Input() slideId!: string;
  @Input() config!: ApiStatusItem;

  apiConfigurationFinished: boolean = false;

  tileUrl: string = "";
  tileName: string = ""; 

  tileOnline: boolean = false;

  openApiDialog() {
    const dialogRef = this.dialog.open(ApiDialogComponent, { data: { title: "Enter API info", subtitle: "", apiName: "", apiNameHint: "API name", apiUrl: "", apiUrlHint: "API URL", accept: "Confirm" } });
    dialogRef.afterClosed().subscribe(result => {
      var apiUrl = result[0];
      var apiName = result[1];
      if (apiUrl == "") {
        this._snackBar.open("URL empty");
        return;
      }
      if (apiName == "") {
        this._snackBar.open("Name empty");
        return;
      }

      this.tileUrl = apiUrl;
      this.tileName = apiName;

      this.apiConfigurationFinished = true;
      this.updateConfig();
      this._snackBar.open("Added API succesfully");
    });
  }

  updateConfig() {
    const slideIdValues = Object.values(this.ConfigurationService.slidesArray).map((slide) => slide.hex); // Retrieve the current grid
    const slideIdIndex = slideIdValues.indexOf(this.slideId); // Get slide index

    const tiles = this.ConfigurationService.slidesArray[slideIdIndex].grid.items as Array<TileItem>;

    for (let tile in tiles) {
      if (this.ConfigurationService.slidesArray[slideIdIndex].grid.items[tile].hex == this.tileId) {
        var tileContent = this.ConfigurationService.slidesArray[slideIdIndex].grid.items[tile].content as ApiStatusItem;
        tileContent.apiConfigurationFinished = true;
        tileContent.apiName = this.tileName;
        tileContent.apiUrl = this.tileUrl;
        
        this.ConfigurationService.slidesArray[slideIdIndex].grid.items[tile].content = tileContent;
        this.ConfigurationService.setConfig(this.ConfigurationService.slidesArray);
        return;
      }
    }
  }

  ngOnInit(): void {
    this.apiConfigurationFinished = this.config.apiConfigurationFinished;
    if (this.apiConfigurationFinished == true) {
      this.tileUrl = this.config.apiUrl;
      this.tileName = this.config.apiName;
    }

    setInterval(() => {
      if (this.apiConfigurationFinished) {
        const apiData = ajax(this.tileUrl);
        apiData.subscribe(res => {
          // Handle the API response here
          if (res.status === 200) {
            // API is online
            this.tileOnline = true;
          } else {
            // API is offline or encountered an error
            this.tileOnline = false;
          }
        });
      }
    }, 1000);
  }
}
