// @see - https://stackoverflow.com/a/63633593
import express from 'express';

const app = express();
const port = 8080;

type Spike = boolean;
type Spikes = boolean[];

// @todo - these should be passed to the client
const ELECTRODE_COUNT = 1024;
// const SAMPLING_FREQENCY = 60;

/**
 * Randomly generate whether or not a spike was detected.
 *
 * Crude attempt to look somewhat like the Snout Boops spike plot.
 *
 * @returns Boolean
 *   `true` if a spike was detected
 *   `false` if a spike was not detected
 */
function generateSpike (index: number): Spike {
  if (index % 13 === 0) {
    // detect a spike more frequently
    return Math.floor(Math.random() * 10) === 1;
  }

  if (index % 13 < 3) {
    // detect a spike more frequently
    return Math.floor(Math.random() * 100) === 1;
  }

  // detect a spike less frequently
  return Math.floor(Math.random() * 1000) === 1;
}

/**
 * Get spikes for all electrodes at a single point in time.
 *
 * @returns Array
 *   An array indicating which electrodes had spikes
 */
function generateElectrodeOutput (): Spikes {
  const output: Spikes = [];

  for (let i = 0; i < ELECTRODE_COUNT; i++) {
    output.push(generateSpike(i));
  }

  return output;
}

// @todo - use express middleware
function allowCors (res: express.Response): void {
  // @see - https://stackoverflow.com/a/66242926
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
}

app.get('/', (req, res) => {
  allowCors(res);

  res.send(generateElectrodeOutput());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export {};
