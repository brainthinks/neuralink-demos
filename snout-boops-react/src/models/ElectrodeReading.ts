/**
 * An individual electrode reading.
 *
 * @todo - should each reading contain a timestamp?
 */

const DEFAULT_ELECTRODE_COUNT: number = 1024;

function getRandomElectrodeIndex (): number {
  return Math.floor(Math.random() * DEFAULT_ELECTRODE_COUNT);
}

class ElectrodeReading {
  isSpike: boolean;

  /**
   * Check if a value is a ElectrodeReading instance.
   *
   * @param {*} electrodeReading
   *   The value to test
   *
   * @returns {boolean}
   */
  static isElectrodeReading (electrodeReading: any): electrodeReading is ElectrodeReading {
    return electrodeReading instanceof ElectrodeReading;
  }

  /**
   * Randomly generate whether or not a spike was detected.
   *
   * A crude attempt to look somewhat like the Snout Boops spike plot.
   *
   * @param {number} [index]
   *   The frame index of the electrodeReading to be generated
   *
   * @returns {boolean}
   *   `true` if a spike was detected
   *   `false` if a spike was not detected
   */
  static generate (index: number = getRandomElectrodeIndex()): boolean {
    if (!Number.isInteger(index)) {
      throw new Error('Cannot generate an electrodeReading without a valid frame index.');
    }

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

  static factory (isSpike: boolean = ElectrodeReading.generate()): ElectrodeReading {
    return new ElectrodeReading(isSpike);
  }

  constructor (isSpike: boolean) {
    this.isSpike = isSpike;
  }
}

export default ElectrodeReading;
