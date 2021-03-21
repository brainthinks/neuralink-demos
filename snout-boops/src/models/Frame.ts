/**
 * A "frame" of electrode reading data, with as many data points as there are
 * electrodes in the neural lace.
 */

import ElectrodeReadings from './ElectrodeReadings';

class Frame {
  timestamp: number;
  electrodeReadings: ElectrodeReadings;
  length: number;
  spikeCount: number;

  static isFrame (frame: any): boolean {
    return frame instanceof Frame;
  }

  /**
   * Generate a Frame from electrode reading data
   *
   * @param {ElectrodeReadings} electrodeReadings
   *   The raw electrode reading data
   *
   * @returns {Frame}
   */
  static factory (electrodeReadings: ElectrodeReadings): Frame {
    if (!ElectrodeReadings.isElectrodeReadings(electrodeReadings)) {
      throw new Error('Cannot create a frame without a valid value for electrodeReadings');
    }

    return new Frame(electrodeReadings);
  }

  private constructor (electrodeReadings: ElectrodeReadings) {
    // @todo - validate!
    this.timestamp = Date.now();
    this.electrodeReadings = electrodeReadings;
    this.length = this.electrodeReadings.length;
    this.spikeCount = this.electrodeReadings.count;
  }
}

export default Frame;
