import {
  DEFAULT_PADDING,
  ImageDataPixelColor,
  DEFAULT_PADDING_COLOR,
  DEFAULT_TRACKER_BAR_COLOR,
} from './utils';

/**
 * Create a solid colored bar to be used to "track" or follow the frame that
 * was last appended to the plot.
 *
 * The tracker bar will be red.  The padding (if any) will be green.
 *
 * Should only need to be called/set once.
 *
 * @param {number} width
 *   Integer representing the width (in pixels) of the tracker bar
 * @param {number} height
 *   Integer representing the height (in pixels) of the tracker bar (without padding)
 * @param {number} [padding]
 *   Integer representing the y-axis padding (in pixels) of the tracker bar.
 *   This should be the same as the padding on the plot.
 *   Defaults to 0.
 *
 * @returns {ImageData}
 *   The tracker bar as an ImageData instance that can be applied to a canvas
 */
export function generateTrackerBarImageData (
  width: number,
  height: number,
  padding = DEFAULT_PADDING,
  paddingColor: ImageDataPixelColor = DEFAULT_PADDING_COLOR,
  color: ImageDataPixelColor = DEFAULT_TRACKER_BAR_COLOR,
): ImageData {
  // Validate ------------------------------------------------------------------
  if (!Number.isInteger(width) && width < 0) {
    throw new Error('valid integer for `width` argument is required to generate the tracker bar');
  }
  if (!Number.isInteger(height) && height < 0) {
    throw new Error('valid integer for `height` argument is required to generate the tracker bar');
  }
  if (!Number.isInteger(padding) && padding < 0) {
    throw new Error('valid integer for `padding` argument is required to generate the tracker bar');
  }
  // ---------------------------------------------------------------------------

  // Calculate the padded height, applying the padding to both top and bottom
  const paddedHeight = height + (padding * 2);

  // The pixel count of the trackerBar multiplied by 4 (1 value for R, G, B, & A)
  const trackerBarDataLength = width * paddedHeight * 4;
  // The array that will hold the pixel/RGBA data
  // @see - https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
  const trackerBarData = new Uint8ClampedArray(trackerBarDataLength);

  for (let i = 0; i < trackerBarDataLength; i += 4) {
    // A pixel starts at every 4th index of the trackerBar data
    const pixelIndex = (i / 4);
    const isPixelInTopPadding = pixelIndex < (width * padding);
    const isPixelInBottomPadding = pixelIndex >= ((trackerBarData.length / 4) - (width * padding));

    if (isPixelInTopPadding || isPixelInBottomPadding) {
      trackerBarData[i + 0] = paddingColor[0];  // R value
      trackerBarData[i + 1] = paddingColor[1];  // G value
      trackerBarData[i + 2] = paddingColor[2];  // B value
      trackerBarData[i + 3] = paddingColor[3];  // A value
      continue;
    }

    trackerBarData[i + 0] = color[0];  // R value
    trackerBarData[i + 1] = color[1];  // G value
    trackerBarData[i + 2] = color[2];  // B value
    trackerBarData[i + 3] = color[3];  // A value
  }

  return new ImageData(trackerBarData, width, paddedHeight);
}
