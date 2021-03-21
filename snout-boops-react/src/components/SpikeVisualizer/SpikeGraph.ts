/**
 * Draw the spike graph as shown in the Snout Boops video:
 *
 * @see - https://www.youtube.com/watch?v=iSutodqCZ74
 * @see - https://marcgg.com/blog/2016/11/01/javascript-audio/
 *
 * @todo:
 *
 * implement logic for floor
 */

import Frame from '../../models/Frame';
import {
  DEFAULT_PADDING,
  ImageDataPixelColor,
  DEFAULT_PADDING_COLOR,
  DEFAULT_GRAPH_BACKGROUND_COLOR,
  DEFAULT_GRAPH_SPIKE_COLOR,
} from './utils';

export function generateSpikeGraphFrame (
  frame: Frame,
  floor: number,
  ceiling: number,
  height: number,
  padding: number = DEFAULT_PADDING,
  paddingColor: ImageDataPixelColor = DEFAULT_PADDING_COLOR,
  backgroundColor: ImageDataPixelColor = DEFAULT_GRAPH_BACKGROUND_COLOR,
  spikeColor: ImageDataPixelColor = DEFAULT_GRAPH_SPIKE_COLOR,
): ImageData {
  if (!Frame.isFrame(frame)) {
    throw new Error('invalid frame');
  }
  if (!Number.isInteger(floor)) {
    throw new Error('valid integer for `floor` argument is required to generate the frame');
  }
  if (!Number.isInteger(ceiling)) {
    throw new Error('valid integer for `ceiling` argument is required to generate the frame');
  }
  if (!Number.isInteger(padding)) {
    throw new Error('valid integer for `padding` argument is required to generate the frame');
  }

  // Each frame is 1 pixel wide
  const width = 1;
  // @todo
  // const height = ceiling - floor;
  // Calculate the padded height, applying the padding to both top and bottom
  const paddedHeight = height + (padding * 2);

  // The pixel count of the frame multiplied by 4 (1 value for R, G, B, & A)
  const frameDataLength = width * paddedHeight * 4;
  // The array that will hold the pixel/RGBA data
  // @see - https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
  const frameData = new Uint8ClampedArray(frameDataLength);

  const spikeCount = (frame.spikeCount * (height / ceiling));

  for (let i = 0; i < frameDataLength; i += 4) {
    // A pixel starts at every 4th index of the frame data
    const pixelIndex = (i / 4);
    const isPixelInTopPadding = pixelIndex < (width * padding);
    const isPixelInBottomPadding = pixelIndex >= ((frameData.length / 4) - (width * padding));
    const isPixelInBackground = pixelIndex < (paddedHeight - spikeCount - padding);

    // @todo - this could probably be made more performant
    if (isPixelInTopPadding || isPixelInBottomPadding) {
      frameData[i + 0] = paddingColor[0];  // R value
      frameData[i + 1] = paddingColor[1];  // B value
      frameData[i + 2] = paddingColor[2];  // G value
      frameData[i + 3] = paddingColor[3];  // A value
      continue;
    }

    if (isPixelInBackground) {
      frameData[i + 0] = backgroundColor[0];  // R value
      frameData[i + 1] = backgroundColor[1];  // B value
      frameData[i + 2] = backgroundColor[2];  // G value
      frameData[i + 3] = backgroundColor[3];  // A value
      continue;
    }

    frameData[i + 0] = spikeColor[0];  // R value
    frameData[i + 1] = spikeColor[1];  // B value
    frameData[i + 2] = spikeColor[2];  // G value
    frameData[i + 3] = spikeColor[3];  // A value
  }

  return new ImageData(frameData, width, paddedHeight);
}
