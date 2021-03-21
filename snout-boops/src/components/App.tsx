import {
  useEffect,
  useState,
} from 'react';

/**
 * MainLoop is used for significantly better timing precision.  It still isn't
 * pefect, as it drifts approximately 0.05 seconds every 10 seconds, but it is
 * far better than using setInterval, which drifted approximately 0.2 seconds
 * every 10 seconds.
 *
 * With setInterval, the drift is noticable in under a minute.
 * With MainLoop, the drift is noticable only after about 5 minutes.
 */
import MainLoop from 'mainloop.js';
// import classNames from 'classnames';

import { usePageVisibility } from '../effects/page-visibility';

import FrameService from '../models/FrameService';
import Frame from '../models/Frame';
import ControlBar from './ControlBar';
import StatusBar from './StatusBar';
import SpikePlot from './SpikePlot';
import SpikeGraph from './SpikeGraph';

import './App.css';

const SUBJECT_NAME = 'Gertie';
const FRAME_SERVER_URL = 'local';
// const FRAME_SERVER_URL = 'http://localhost:8080';

// The neural lace sends data units 60 times/second
// @todo - since MainLoop.js uses monitor refresh rate to determine the
// frequency at which it calls
const LACE_FREQUENCY = 60;
// Each neural lace sends this many discrete values at the configured frequency
const LACE_BANDWIDTH = 1024;
// How many seconds worth of data are we going to show
const DISPLAY_DURATION = 10;

const DEFAULT_TRACKER_WIDTH = 3;

// This padding is only needed for eyeballing the pixel precision of the spike
// plot canvas element.  There is no need to use this in production.
const DEFAULT_PADDING = 0;

const frameService = FrameService.asSingleton(FRAME_SERVER_URL, LACE_BANDWIDTH);

function App () {
  const isVisible = usePageVisibility();
  const [ isMonitoring, setIsMonitoring ] = useState(false);
  const [ nextFrame, setNextFrame ] = useState<Frame|null>(null);

  async function getNextFrame () {
    try {
      const frame = await frameService.getNextFrame();

      setNextFrame(frame);
    }
    catch (error) {
      // @todo - display error message to user
      console.error(error);
      setIsMonitoring(false);
    }
  }

  useEffect(() => {
    if (!isVisible || !isMonitoring) {
      MainLoop.stop();
      document.title = "Monitoring Paused...";

      return;
    }

    MainLoop.setBegin(getNextFrame).start();
    document.title = "Monitoring your neural lace!"
  }, [isVisible, isMonitoring]);

  return (
    <div className="App">
      <ControlBar
        name={SUBJECT_NAME}
        isMonitoring={isVisible && isMonitoring}
        setIsMonitoring={setIsMonitoring}
      />
      <section className="spike-visualization">
        <div className="spike-plot">
          <SpikePlot
            laceFrequency={LACE_FREQUENCY}
            laceBandwidth={LACE_BANDWIDTH}
            plotTime={DISPLAY_DURATION}
            padding={DEFAULT_PADDING}
            trackerWidth={DEFAULT_TRACKER_WIDTH}
            frame={nextFrame as Frame}
          />
        </div>
        <div className="spike-graph">
          <SpikeGraph
            laceFrequency={LACE_FREQUENCY}
            laceBandwidth={LACE_BANDWIDTH}
            plotTime={DISPLAY_DURATION}
            padding={DEFAULT_PADDING}
            trackerWidth={DEFAULT_TRACKER_WIDTH}
            frame={nextFrame as Frame}
          />
        </div>
      </section>
      <StatusBar
        isMonitoring={isVisible && isMonitoring}
      />
    </div>
  );
}

export default App;
