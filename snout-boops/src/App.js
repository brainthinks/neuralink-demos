import classNames from 'classnames';
import { useReducer, useState } from 'react';

import './App.css';

function generateFrame () {
  return {
    timestamp: Date.now(),
    spikes: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,true,true,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,true,true,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,true,false,false,false,false,false,false,true,true,false,true,true,false,false,false,true,true,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true],
  };
}

// A single electrode reading represented as an HTML element
function Electrode (props) {
  const {
    isSpike,
  } = props;

  return (
    <span className={
      classNames({
        electrode: true,
        spike: isSpike,
      })
    } />
  );
}

// A frame consisting of 1024 electrode states
function BmiFrame (props) {
  const {
    frame,
  } = props;

  return (
    <div className="frame">
      {frame.spikes.map((spike, i) => {
        return (
          <Electrode
            // it's ok to use the index as the key here since a frame will
            // never be mutated
            key={i.toString()}
            isSpike={spike}
          />
        )
      })}
    </div>
  );
}

// Display every spike (and plateau) for a given frame
function SpikeMap (props) {
  const {
    frames,
  } = props;

  return (
    <>
      <p>Snout Boop pixel map goes here</p>
      <div className="frames">
        {frames.map((frame, i) => {
          return (
            <BmiFrame
              // @todo - use the timestamp
              key={frame.timestamp.toString()}
              frame={frame}
            />
          )
        })}
      </div>
    </>
  )
}

// Display the total spikes for a given frame
function SpikeGraph (props) {
  return (
    <>
      <p>Snout Boop spike sum per frame goes here</p>
    </>
  )
}

function App() {
  const [ frames, getNextFrame ] = useReducer(
    (frames) => frames.concat(generateFrame()),
    [],
  );

  return (
    <div className="App">
      <button onClick={getNextFrame}>
        Add Frame
      </button>
      {
        (frames.length === 0)
          ? (
            <>
              <p>No frames yet!</p>
            </>
          )
          : (
            <>
              <div className="spike-map">
                <SpikeMap frames={frames} />
              </div>
              <div className="spike-graph">
                <SpikeGraph frames={frames} />
              </div>
            </>
          )
      }
    </div>
  );
}

export default App;
