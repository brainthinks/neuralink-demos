export const DEFAULT_PADDING = 0;

/**
 * Create a solid colored bar to be used to "track" or follow the frame that
 * was last appended to the plot.
 *
 * The tracker bar will be red.  The padding (if any) will be green.
 *
 * Should only need to be called/set once.
 *
 * @param {Number} width
 *   Integer representing the width (in pixels) of the tracker bar
 * @param {Number} height
 *   Integer representing the height (in pixels) of the tracker bar (without padding)
 * @param {Number} [padding]
 *   Integer representing the y-axis padding (in pixels) of the tracker bar.
 *   This should be the same as the padding on the plot.
 *   Defaults to 0.
 *
 * @returns {ImageData}
 *   The tracker bar as an ImageData instance that can be applied to a canvas
 */
export function generateTrackerBar (width, height, padding = DEFAULT_PADDING) {
  // Sanitize ------------------------------------------------------------------
  width = Number(width);
  height = Number(height);
  padding = Number(padding);
  // ---------------------------------------------------------------------------

  // Validate ------------------------------------------------------------------
  if (!Number.isInteger(width)) {
    throw new Error('valid integer for `width` argument is required to generate the tracker bar');
  }
  if (!Number.isInteger(height)) {
    throw new Error('valid integer for `height` argument is required to generate the tracker bar');
  }
  if (!Number.isInteger(padding)) {
    throw new Error('valid integer for `padding` argument is required to generate the tracker bar');
  }
  // ---------------------------------------------------------------------------

  const paddedHeight = height + (padding * 2);
  const arr = new Uint8ClampedArray(width * paddedHeight * 4);

  for (let i = 0; i < arr.length; i += 4) {
    const pixelIndex = (i / 4);
    const isPixelInTopPadding = pixelIndex < (width * padding);
    const isPixelInBottomPadding = pixelIndex >= ((arr.length / 4) - (width * padding));

    // Make the padding green.
    if (isPixelInTopPadding || isPixelInBottomPadding) {
      arr[i + 1] = 255;  // G value
      arr[i + 3] = 255;  // A value
      continue;
    }

    // Make the tracker bar red.
    arr[i + 0] = 255;  // R value
    arr[i + 3] = 255;  // A value
  }

  return new ImageData(arr, width, paddedHeight);
}
