/**
 * Draw the spike plot as shown in the Snout Boops video:
 *
 * @see - https://www.youtube.com/watch?v=iSutodqCZ74
 *
 * References:
 *
 * @see - https://thibaut.io/react-canvas-components
 * @see - https://rembound.com/articles/drawing-pixels-with-html5-canvas-and-javascript
 * @see - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createImageData
 *
 * Known limitations:
 *
 * There is no scaling factor.  Each frame has a width one pixel and a height
 * equal to the number of lace channels (electrodes).  Supporting this scaling
 * feature is not planned, but I thought it was worth noting.
 */

import Frame from '../../models/Frame';
import {
  DEFAULT_PADDING,
  ImageDataPixelColor,
  DEFAULT_PADDING_COLOR,
  DEFAULT_PLOT_SPIKE_COLOR,
  DEFAULT_PLOT_NO_SPIKE_COLOR,
} from './utils';

/**
 * Create a one-pixel-wide frame that represents the spike value of every
 * electrode.
 *
 * Each electrode spike will be represented as a white pixel.
 * If there is no spike, a black pixel will be used for the given electrode.
 *
 * @param {Frame} frame
 *   The frame to plot.
 * @param {Number} [padding]
 *   Integer representing the y-axis padding (in pixels) of the plot.
 *   This should be the same as the padding on the plot.
 *   Defaults to 0.
 *
 * @returns {ImageData}
 *   The frame as an ImageData instance that can be applied to a canvas
 */
export function generateSpikePlotFrame (
  frame: Frame,
  padding: number = DEFAULT_PADDING,
  paddingColor: ImageDataPixelColor = DEFAULT_PADDING_COLOR,
  spikeColor: ImageDataPixelColor = DEFAULT_PLOT_SPIKE_COLOR,
  noSpikeColor: ImageDataPixelColor = DEFAULT_PLOT_NO_SPIKE_COLOR,
): ImageData {
  if (!Frame.isFrame(frame)) {
    throw new Error('invalid frame');
  }
  if (!Number.isInteger(padding) || padding < 0) {
    throw new Error('valid integer for `padding` argument is required to generate the spike plot frame');
  }

  // Each frame is 1 pixel wide
  const width = 1;
  // Each frame has a pixel height equal to the number of electrodes
  const height = frame.length;
  // Calculate the padded height, applying the padding to both top and bottom
  const paddedHeight = height + (padding * 2);

  // The pixel count of the frame multiplied by 4 (1 value for R, G, B, & A)
  const frameDataLength = width * paddedHeight * 4;
  // The array that will hold the pixel/RGBA data
  // @see - https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
  const frameData = new Uint8ClampedArray(frameDataLength);

  for (let i = 0; i < frameDataLength; i += 4) {
    // A pixel starts at every 4th index of the frame data
    const pixelIndex = (i / 4);
    const isPixelInTopPadding = pixelIndex < (width * padding);
    const isPixelInBottomPadding = pixelIndex >= ((frameData.length / 4) - (width * padding));

    // @todo - this could probably be made more performant
    if (isPixelInTopPadding || isPixelInBottomPadding) {
      frameData[i + 0] = paddingColor[0];  // R value
      frameData[i + 1] = paddingColor[1];  // G value
      frameData[i + 2] = paddingColor[2];  // B value
      frameData[i + 3] = paddingColor[3];  // A value
      continue;
    }

    // We can lazily calculate the spike index this way because this will never
    // be evaluated when the index is in the padding frame data.
    const spikeIndex = pixelIndex - padding;
    const isSpike = frame.electrodeReadings.at(spikeIndex);

    if (!isSpike) {
      frameData[i + 0] = noSpikeColor[0];  // R value
      frameData[i + 1] = noSpikeColor[1];  // G value
      frameData[i + 2] = noSpikeColor[2];  // B value
      frameData[i + 3] = noSpikeColor[3];  // A value
      continue;
    }

    frameData[i + 0] = spikeColor[0];  // R value
    frameData[i + 1] = spikeColor[1];  // G value
    frameData[i + 2] = spikeColor[2];  // B value
    frameData[i + 3] = spikeColor[3];  // A value
  }

  return new ImageData(frameData, width, paddedHeight);
}
