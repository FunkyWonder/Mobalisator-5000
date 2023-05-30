import { GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid, GridsterComponentInterface, GridsterItemComponentInterface, GridsterItemComponent } from 'angular-gridster2';
import { TextItem, PictureItem, ApiStatusItem, LastActivityItem, ProjectBuildStatusItem, ProjectIdItem, QueueStatusItem } from './interfaces';
import { randomHex } from './utils';

export const swiperOptions = {
    slidesPerView: 1,
    zoom: true,
    enabled: true,
    pagination: {
        clickable: true,
        // dynamicBullets: true,
    },
    autoHeight: true,
    allowTouchMove: false,
    direction: 'vertical',
    keyboard: {
        enabled: true,
    },
    observer: true,
    // loop: true,
};

export const carouselAutoPlayOptions = {
    disabled: false,
    max: 600,
    min: 10,
    step: 10,
    showTickMarks: false,
    discrete: true,
}

export const gridsterOptions = {
    gridType: GridType.Fit,
    compactType: CompactType.None,
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

export const defaultDashboard: Array<GridsterItem> = [
    { cols: 2, rows: 1, y: 0, x: 0, id: randomHex(), hasItem: false, selectedItem: "" },
    { cols: 2, rows: 2, y: 0, x: 2, id: randomHex(), hasItem: false, selectedItem: "" }
];

// Items which can be added to a tile
// TODO: make it so that instead of matching a string with a particular interface we just straight up match the type
export const tileItems: Array<{friendly_name: string, content: TextItem | PictureItem | ProjectBuildStatusItem | QueueStatusItem | ProjectIdItem | LastActivityItem | ApiStatusItem}> = [
{ "friendly_name": "Text", "content": { type: "text", text: "Click to edit text!" } as TextItem },
{ "friendly_name": "Picture", "content": { type: "picture", path: "https://www.dewerkwijzer.nl/wp-content/uploads/2019/10/MOBA_logo.jpg" } as PictureItem },
{ "friendly_name": "Project Build Status", "content": { type: "project-build-status", title: "Project Build Status:"} as ProjectBuildStatusItem },
{ "friendly_name": "Queue Duration", "content": { type: "queue-status", title: "Queue Duration:" } as QueueStatusItem },
{ "friendly_name": "Project ID", "content": { type: "project-id", title: "Project ID: "} as ProjectIdItem },
{ "friendly_name": "Last Activity", "content": { type: "last-activity", title: "Last activity on:"} as LastActivityItem },
{ "friendly_name": "API Status", "content": { type: "api-status", title: "API Status:", apiConfigurationFinished: false,  } as ApiStatusItem }
];