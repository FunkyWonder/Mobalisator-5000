/**
 * Removes and item from an array. Returns a new array instance (it doesn't mutate the source array).
 * @param array source array to be returned without the element to remove
 * @param condition function that will return true for the item that we want to remove
 */
export function randomHex() : string {
    let result = '';
    for (let i = 0; i < 7; ++i) {
      const value = Math.floor(16 * Math.random());
      result += value.toString(16);
    }
    return result;
}



