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
 * equal to the number of lace channels (electrodes).
 *
 * @todo:
 *
 * fix the timer.
 *
 * canvas stops when tab not in focus?
 *
 * the frames are updated as they come in - need to make them update at a
 * specific frequency to ensure that the x axis correctly corresponds to the
 * configured temporal resolution.
 */

import {
  useEffect,
  useState,
  useRef,
} from 'react';

import Frame from '../models/Frame';
import {
  DEFAULT_PADDING,
  generateTrackerBar,
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
function generateFrame (frame, padding = DEFAULT_PADDING) {
  padding = Number(padding);

  if (!Frame.isFrame(frame)) {
    throw new Error('invalid frame');
  }

  if (!Number.isInteger(padding)) {
    throw new Error('valid integer for `padding` argument is required to generate the frame');
  }

  const width = 1;
  const height = frame.spikes.length;
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

    const spikeIndex = pixelIndex - padding;
    const isSpike = frame.spikes[spikeIndex];

    if (!isSpike) {
      // make it opaque
      arr[i + 3] = 255;  // A value
      continue;
    }

    arr[i + 0] = 255;  // R value
    arr[i + 1] = 255;  // G value
    arr[i + 2] = 255;  // B value
    arr[i + 3] = 255;  // A value
  }

  return new ImageData(arr, width, paddedHeight);
}

const SpikePlot = (props) => {
  const {
    startTime,
    // how many frames per second
    laceFrequency,
    // how many data points per frame
    laceBandwidth,
    // how many seconds should the plot display at one time
    plotTime,
    // padding in pixels for the top and bottom of the plot
    padding,
    // width in pixels for the tracker
    trackerWidth,
    // the frame to append to the plot
    frame,
  } = props;

  // The index to use to get the current frame state
  const [frameCount, setFrameCount] = useState(0);
  // The index to use to display the current frame
  const [frameDisplayIndex, setFrameDisplayIndex] = useState(0);
  // The HTML canvas 2d context that the frames will be drawn to
  const [canvasContext, setCanvasContext] = useState(null);
  const [trackerBar, setTrackerBar] = useState(null);

  const width = laceFrequency * plotTime;
  const height = laceBandwidth;
  const paddedHeight = height + (padding * 2);

  // we use a ref to access the canvas' DOM node
  const canvasRef = useRef(null);

  useEffect(() => {
    console.log('canvas ref changed');

    if (!canvasRef.current) {
      console.log('canvas not yet loaded');
      return;
    }

    setCanvasContext(canvasRef.current.getContext("2d"));
    setTrackerBar(generateTrackerBar(trackerWidth, height, padding));
  }, [canvasRef]);

  useEffect(() => {
    if (frame === null) {
      console.log('waiting for next frame');
      return;
    }

    if (canvasContext === null) {
      console.log('waiting for canvas');
      return;
    }

    const frameImageData = generateFrame(frame, padding);

    canvasContext.putImageData(frameImageData, frameDisplayIndex, 0);

    if (frameCount % width === 0) {
      setFrameDisplayIndex(0);

      // console.log(frameCount, width, frameCount % width)
      // console.log((Date.now() - startTime) / 1000)
    }
    else {
      canvasContext.putImageData(trackerBar, frameDisplayIndex + 1, 0);
      setFrameDisplayIndex(frameDisplayIndex + 1);
    }

    setFrameCount(frameCount + 1);
  }, [
    canvasContext,
    frame,
    // @todo - is there some more proper way to handle these in effects?
    // frameDisplayIndex, // should never change outside of this effect
    // frameCount, // should never change outside of this effect
  ]);

  // Render the canvas without confirming that there is a frame because we
  // need the `canvasRef`
  return (
    <canvas
      ref={canvasRef}
      // set the dimensions here to equal to the true resolution
      // Note: the styles will need to be set to fill the parent container
      width={width}
      height={paddedHeight}
    />
  );
};

export default SpikePlot;
