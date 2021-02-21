/**
 * @todo:
 *
 * gracefully handle network failure!
 *
 * because the graph and plot are independent, they can become out of sync.
 * make their updates time based or something...
 */
import {
  useEffect,
  useState,
} from 'react';
// import classNames from 'classnames';

import Frame from '../models/Frame';
import ControlBar from './ControlBar';
import StatusBar from './StatusBar';
import SpikePlot from './SpikePlot';
import SpikeGraph from './SpikeGraph';

import './App.css';

const SUBJECT_NAME = 'Gertie';
const FRAME_SERVER_URL = 'http://localhost:8080';
// The neural lace sends data units 60 times/second
const LACE_FREQUENCY = 60;
// Each neural lace sends this many discrete values at the configured frequency
const LACE_BANDWIDTH = 1024;
// How many seconds worth of data are we going to show
// @todo - this should be dynamic based on viewable area
const DISPLAY_DURATION = 10;

const DEFAULT_TRACKER_WIDTH = 3;

// This padding is only needed for eyeballing the pixel precision of the spike
// plot canvas element.  There is no need to use this in production.
const DEFAULT_PADDING = 0;

const startTime = Date.now()

function App () {
  const [ fetchInterval, setFetchInterval ] = useState(null);
  const [ isMonitoring, setIsMonitoring ] = useState(true);
  const [ nextFrame, setNextFrame ] = useState(null);

  async function getNextFrame () {
    if (!Frame.isFrameServerConfigured()) {
      Frame.setUrl(FRAME_SERVER_URL);
    }

    const frame = await Frame.getNextFrame();

    setNextFrame(frame);
  }

  useEffect(() => {
    if (!isMonitoring) {
      if (fetchInterval !== null) {
        clearInterval(fetchInterval);
        // setFetchInterval(null);
        cancelAnimationFrame(fetchInterval);
      }

      return;
    }

    // Request the next frame at the same frequency as they are taken from the
    // lace.
    // @todo - the frames should be recevied via push events from the server
    // @todo - This drifts by approximately 200 milliseconds every 10 seconds
    setFetchInterval(setInterval(
      getNextFrame,
      1000 / LACE_FREQUENCY
      // Math.floor((1000 / LACE_FREQUENCY * 10000000000))/ 10000000000,
    ));
  }, [isMonitoring]);

  return (
    <div className="App">
      <ControlBar
        name={SUBJECT_NAME}
        isMonitoring={isMonitoring}
        setIsMonitoring={setIsMonitoring}
      />
      <section className="spike-visualization">
        <div className="spike-plot">
          <SpikePlot
            startTime={startTime}
            laceFrequency={LACE_FREQUENCY}
            laceBandwidth={LACE_BANDWIDTH}
            plotTime={DISPLAY_DURATION}
            padding={DEFAULT_PADDING}
            trackerWidth={DEFAULT_TRACKER_WIDTH}
            frame={nextFrame}
          />
        </div>
        <div className="spike-graph">
          <SpikeGraph
            laceFrequency={LACE_FREQUENCY}
            laceBandwidth={LACE_BANDWIDTH}
            plotTime={DISPLAY_DURATION}
            padding={DEFAULT_PADDING}
            trackerWidth={DEFAULT_TRACKER_WIDTH}
            frame={nextFrame}
          />
        </div>
      </section>
      <StatusBar
        isMonitoring={isMonitoring}
      />
    </div>
  );
}

export default App;
