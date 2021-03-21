import {
  useEffect,
  useState,
  useRef,
} from 'react';

import Frame from '../../models/Frame';
import { generateTrackerBarImageData } from './TrackerBar';
import { generateSpikePlotFrame } from './SpikePlot';
import { generateSpikeGraphFrame } from './SpikeGraph';
import GraphAudio from './GraphAudio';

interface SpikeVisualizerProps {
  isMonitoring: boolean,
  isMuted: boolean,
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

const SpikeVisualizer = (props: SpikeVisualizerProps) => {
  const {
    isMonitoring,
    isMuted,
    laceFrequency,
    laceBandwidth,
    plotTime,
    padding,
    trackerWidth,
    frame,
  } = props;

  const width = laceFrequency * plotTime;

  const spikePlotHeight = laceBandwidth;
  const spikePlotPaddedHeight = spikePlotHeight + (padding * 2);

  const spikeGraphFloor = 0;
  const spikeGraphCeiling = 40;
  const spikeGraphHeight = Math.ceil(laceBandwidth * 0.33);
  const spikeGraphPaddedHeight = spikeGraphHeight + (padding * 2);

  const paddedHeight = spikePlotPaddedHeight + spikeGraphPaddedHeight;

  // The index to use to get the current frame state
  const [frameCount, setFrameCount] = useState(0);
  // The index to use to display the current frame
  const [frameDisplayIndex, setFrameDisplayIndex] = useState(0);
  // The HTML canvas 2d context that the frames will be drawn to
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [spikePlotTrackerBar, setSpikePlotTrackerBar] = useState<ImageData | null>(null);
  const [spikeGraphTrackerBar, setSpikeGraphTrackerBar] = useState<ImageData | null>(null);
  const [graphAudio, setGraphAudio] = useState<GraphAudio | null>(null);

  // we use a ref to access the canvas' DOM node
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log('canvas ref changed');

    if (!canvasRef?.current) {
      console.log('canvas not yet loaded');
      return;
    }

    setCanvasContext(canvasRef.current.getContext("2d"));

    setSpikePlotTrackerBar(generateTrackerBarImageData(trackerWidth, spikePlotHeight, padding));
    setSpikeGraphTrackerBar(generateTrackerBarImageData(trackerWidth, spikeGraphHeight, padding));
    setGraphAudio(new GraphAudio());
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [
    canvasRef,
  ]);

  useEffect(() => {
    if (graphAudio === null) {
      console.log('audio not ready');
      return;
    }

    if (isMuted || !isMonitoring) {
      graphAudio.mute();
    }
    else {
      graphAudio.unmute();
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [
    isMonitoring,
    isMuted,
  ]);

  useEffect(() => {
    if (canvasContext === null) {
      console.log('waiting for canvas');
      return;
    }

    if (spikePlotTrackerBar === null || spikeGraphTrackerBar === null) {
      console.log('trackerBars not ready');
      return;
    }

    if (graphAudio === null) {
      console.log('waiting for audio');
      return;
    }

    if (frame === null) {
      console.log('waiting for frame');
      return;
    }

    const spikePlotFrame = generateSpikePlotFrame(frame);
    const spikeGraphFrame = generateSpikeGraphFrame(frame, spikeGraphFloor, spikeGraphCeiling, spikeGraphHeight);

    canvasContext.putImageData(spikePlotFrame, frameDisplayIndex, 0);
    canvasContext.putImageData(spikeGraphFrame, frameDisplayIndex, spikePlotPaddedHeight);
    graphAudio.set(frame.spikeCount);

    if (frameCount % width === 0) {
      setFrameDisplayIndex(0);
    }
    else {
      canvasContext.putImageData(spikePlotTrackerBar, frameDisplayIndex + 1, 0);
      canvasContext.putImageData(spikeGraphTrackerBar, frameDisplayIndex + 1, spikePlotPaddedHeight);

      setFrameDisplayIndex(frameDisplayIndex + 1);
    }

    setFrameCount(frameCount + 1);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [
    canvasContext,
    frame,
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

export default SpikeVisualizer;
