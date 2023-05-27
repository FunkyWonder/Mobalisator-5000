import { GridsterItem } from 'angular-gridster2';
import { ChartOptions } from 'chart.js'

export interface Slide {
    hex: string;
    projectId: number;
    grid: {
        layout: Array<GridsterItem>,
        items: Array<TileItem>;
    }
}

export interface TileItem {
    hex: string,
    content: PictureItem | TextItem | BarChartItem | ProjectBuildStatusItem | QueueStatusItem | ProjectIdItem | LastActivityItem,
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

export interface ProjectBuildStatusItem {
    type: 'project-build-status';
    //backgroundColor: string; // With hashtag
    title: string;
    status: string;
    projectId: number;
    style?: {
        size: Number | "auto";
        font: string;
        bold: boolean;
        italic: boolean;
        underlined: boolean;
    }
}

export interface ProjectIdItem {
    type: 'project-id';
    title: string;
    style?: {
        size: Number | "auto";
        font: string;
        bold: boolean;
        italic: boolean;
        underlined: boolean;
    }
}

export interface QueueStatusItem {
    type: 'queue-status';
    title: string;
    status: string;
    style?: {
        size: Number | "auto";
        font: string;
        bold: boolean;
        italic: boolean;
        underlined: boolean;
    }
}

export interface LastActivityItem {
    type: 'last-activity';
    title: string;
    lastActivity: string;
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