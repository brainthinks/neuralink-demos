/**
 * Draw the spike graph as shown in the Snout Boops video:
 *
 * @see - https://www.youtube.com/watch?v=iSutodqCZ74
 *
 * @todo:
 *
 * implement logic for floor
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

function generateFrame (
  frame: Frame,
  floor: number,
  ceiling: number,
  padding = DEFAULT_PADDING,
) {
  floor = Number(floor);
  ceiling = Number(ceiling);
  padding = Number(padding);

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

  const width = 1;
  const height = ceiling - floor;
  const paddedHeight = height + (padding * 2);
  const arr = new Uint8ClampedArray(width * paddedHeight * 4);

  const spikeCount = frame.spikeCount;

  for (let i = 0; i < arr.length; i += 4) {
    arr[i + 3] = 255;  // A value

    const pixelIndex = (i / 4);
    const isPixelInTopPadding = pixelIndex < (width * padding);
    const isPixelInBottomPadding = pixelIndex >= ((arr.length / 4) - (width * padding));

    // Make the padding green.
    if (isPixelInTopPadding || isPixelInBottomPadding) {
      arr[i + 1] = 255;  // G value
      continue;
    }

    // Do not color the pixels that represent graph point greater than the
    // spike count.
    if (pixelIndex < (paddedHeight - padding - spikeCount)) {
      continue;
    }

    // Color the graph point that represents the spike count and fill below
    arr[i + 2] = 255;  // B value
  }

  return new ImageData(arr, width, paddedHeight);
}

interface SpikeGraphProps {
  // how many frames per second
  laceFrequency: number,
  // how many data points per frame
  laceBandwidth: number,
  // how many seconds should the plot display at one time
  plotTime: number,
  // padding in pixels for the top and bottom of the plot
  padding: number,
  // width in pixels for the tracker
  trackerWidth: number,
  // the frame to append to the plot
  frame: Frame,
}

function SpikeGraph (props: SpikeGraphProps) {
  const {
    laceFrequency,
    // laceBandwidth,
    plotTime,
    padding,
    trackerWidth,
    frame,
  } = props;

  // The index to use to get the current frame state
  const [frameCount, setFrameCount] = useState(0);
  // The index to use to display the current frame
  const [frameDisplayIndex, setFrameDisplayIndex] = useState(0);
  // The HTML canvas 2d context that the frames will be drawn to
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [trackerBar, setTrackerBar] = useState<ImageData | null>(null);

  // @todo - can this range be dynamic?
  const floor = 0;
  const ceiling = 40;

  const width = laceFrequency * plotTime;
  const height = ceiling - floor;
  // const height = laceBandwidth;
  const paddedHeight = height + (padding * 2);

  // we use a ref to access the canvas' DOM node
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log('canvas ref changed');

    if (!canvasRef?.current) {
      console.log('canvas not yet loaded');
      return;
    }

    setCanvasContext(canvasRef.current.getContext("2d"));
    setTrackerBar(generateTrackerBar(trackerWidth, height, padding));
  }, [canvasRef]);

  useEffect(() => {
    if (!frame) {
      console.log('waiting for next frame');
      return;
    }

    if (!canvasContext) {
      console.log('waiting for canvas');
      return;
    }

    if (!trackerBar) {
      console.log('tracker bar not ready');
      return;
    }

    const frameImageData = generateFrame(frame, floor, ceiling, padding);

    canvasContext.putImageData(frameImageData, frameDisplayIndex, 0);

    if (frameCount % (width) === 0) {
      setFrameDisplayIndex(0);
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
}

export default SpikeGraph;
