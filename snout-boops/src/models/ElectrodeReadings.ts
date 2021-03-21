/**
 * A collection of electrode readings.
 */

import ElectrodeReading from './ElectrodeReading';

class ElectrodeReadings {
  electrodeReadings: (ElectrodeReading|null)[];

  /**
   * Check if a value is a ElectrodeReadings instance.
   *
   * @param {*} electrodeReadings
   *   The value to test
   *
   * @returns {boolean}
   */
  static isElectrodeReadings (electrodeReadings: any): electrodeReadings is ElectrodeReadings {
    return electrodeReadings instanceof ElectrodeReadings;
  }

  /**
   * Generate a collection of ElectrodeReading instances.
   *
   * @param count
   *   The electrode count (number of electrodeReadings to generate)
   *
   * @returns {ElectrodeReadings}
   */
  static generate (count: number): ElectrodeReadings {
    if (!Number.isInteger(count)) {
      throw new Error('Cannot generate electrodeReadings without a valid count.');
    }

    const electrodeReadings: ElectrodeReadings = new ElectrodeReadings();

    electrodeReadings.generate(count);

    return electrodeReadings;
  }

  /**
   * Generate an empty ElectrodeReadings instance
   *
   * @param {number} count
   *   The number of electrodes in the frame.
   *
   * @returns {ElectrodeReadings}
   */
  static empty (count: number): ElectrodeReadings {
    const electrodeReadings: ElectrodeReadings = new ElectrodeReadings();

    electrodeReadings.add(new Array(count));

    return electrodeReadings;
  }

  /**
   * Generate a ElectrodeReadings instance from an array of booleans.  The electrode count
   * will be assumed to be the array length.
   *
   * @param {Array} eElectrodeReadings
   *   The array of booleans representing the electrodeReadings.
   *
   * @returns {ElectrodeReadings}
   */
  static fromArray (eElectrodeReadings: boolean[]): ElectrodeReadings {
    const electrodeReadings: ElectrodeReadings = new ElectrodeReadings();

    electrodeReadings.add(eElectrodeReadings);

    return electrodeReadings;
  }

  constructor () {
    this.electrodeReadings = [];
  }

  /**
   * The number of readings
   */
  get length (): number {
    return this.electrodeReadings.length;
  }

  /**
   * The number of electrodeReadings
   */
  get count (): number {
    let count: number = 0;

    for (let i = 0; i < this.electrodeReadings.length; i++) {
      const electrodeReading = this.electrodeReadings[i];

      if (electrodeReading?.isSpike) {
        count++;
      }
    }

    return count;
  }

  at (index: number) {
    if (!Number.isInteger(index) || index < 0 || index > this.length - 1) {
      throw new Error('Invalid index');
    }

    return this.electrodeReadings[index]?.isSpike;
  }

  /**
   * Add one or more electrodeReadings.
   *
   * @param electrodeReadings
   *   The electrodeReadings to add.  May be any of the following:
   *   * a boolean
   *   * a ElectrodeReading instance
   *   * an array of booleans and/or ElectrodeReading instances
   *   * a ElectrodeReadings instance
   *
   * @returns {this}
   */
  add (electrodeReadings: (boolean | ElectrodeReading | (boolean|ElectrodeReading)[] | ElectrodeReadings)): this {
    if (typeof electrodeReadings === 'boolean') {
      this.electrodeReadings.push(ElectrodeReading.factory(electrodeReadings));

      return this;
    }

    if (ElectrodeReading.isElectrodeReading(electrodeReadings)) {
      this.electrodeReadings.push(electrodeReadings);

      return this;
    }

    if (ElectrodeReadings.isElectrodeReadings(electrodeReadings)) {
      this.electrodeReadings = this.electrodeReadings.concat(electrodeReadings.electrodeReadings);

      return this;
    }

    if (Array.isArray(electrodeReadings)) {
      for (let i = 0; i < electrodeReadings.length; i++) {
        this.add(electrodeReadings[i]);
      }

      return this;
    }

    throw new Error('Cannot add invalid electrodeReadings.');
  }

  /**
   * Generate the passed number of electrodeReadings, which will be added to the instance.
   *
   * @param {number} [count=1]
   *   The number of electrodeReadings to generate
   *
   * @returns {this}
   */
  generate (count: number = 1): this {
    if (!Number.isInteger(count)) {
      throw new Error('Cannot generate electrodeReadings without a valid count.');
    }

    for (let i = 0; i < count; i++) {
      this.add(ElectrodeReading.generate(this.electrodeReadings.length));
    }

    return this;
  }
}

export default ElectrodeReadings;
