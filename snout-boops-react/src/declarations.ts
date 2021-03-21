// @see - https://stackoverflow.com/a/43513740
// @see - https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation
declare global {
  interface Window {
    performance: {
      memory: any;
    }
  }
  interface Document {
    msHidden: any;
    webkitHidden: any;
  }
}

export {};
