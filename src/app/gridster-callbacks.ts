import { GridsterComponentInterface, GridsterItem, GridsterItemComponentInterface } from "angular-gridster2";

export class GridsterCallbacks {
  itemChange(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    // console.info('itemChanged', item, itemComponent);
    // Add your implementation here
  }

  itemResize(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    // console.info('itemResized', item, itemComponent);
    // Add your implementation here
  }

  itemInit(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface
  ): void {
    // console.info('itemInitialized', item, itemComponent);
    // Add your implementation here
  }

  itemRemoved(
    item: GridsterItem,
    itemComponent: GridsterItemComponentInterface,
  ): void {
    // console.info('itemRemoved', item, itemComponent);
    // Add your implementation here
  }

  itemValidate(item: GridsterItem): boolean {
    // Add your implementation here
    return item.cols > 0 && item.rows > 0;
  }

  gridInit(grid: GridsterComponentInterface): void {
    // console.info('gridInit', grid);
    // Add your implementation here
  }

  gridDestroy(grid: GridsterComponentInterface): void {
    // console.info('gridDestroy', grid);
    // Add your implementation here
  }

  gridSizeChanged(grid: GridsterComponentInterface): void {
    // console.info('gridSizeChanged', grid);
    // Add your implementation here
  }
}