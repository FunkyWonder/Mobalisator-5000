import { GridsterItem } from 'angular-gridster2';
import { ChartOptions } from 'chart.js'

export interface Slide {
    hex: string;
    grid: {
        layout: Array<GridsterItem>,
        items: Array<TileItem>;
    }
}
export interface TileItem {
    hex: string,
    content: PictureItem | TextItem | BarChartItem,
}

export interface PictureItem {
    type: 'picture';
    path: string;
}

export interface TextItem {
    type: 'text';
    text: string;
    style?: {
        size: Number | "auto";
        font: string;
        bold: boolean;
        italic: boolean;
        underlined: boolean;
    }
}

export interface BarChartItem {
    type: 'bar';
    option: ChartOptions;
    data: {
        datasets: Array<any>;
        labels: Array<string>;
    };
}