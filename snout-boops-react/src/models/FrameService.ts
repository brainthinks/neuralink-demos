/**
 * A service that controls access to frames, including how many electrodes in
 * the target neural lace and the url to the frame server.
 */

import ElectrodeReadings from './ElectrodeReadings';
import Frame from "./Frame";

// A special value to use for the frame server url that will generate random
// frames locally rather than reaching out to a server.
const LOCAL_FRAME_SERVER: string = 'local';

class FrameService {
  frameServerUrl: string;
  electrodeCount: number;

  static asSingleton (url: string, count: number): FrameService {
    return new FrameService(url, count);
  }

  private constructor (url: string, count: number) {
    // @todo - use better validation
    if (typeof url !== 'string') {
      throw new Error('Frame server url must be a valid url.');
    }

    if (!Number.isInteger(count)) {
      throw new Error('Electrode count must be an integer.');
    }

    this.frameServerUrl = url;
    this.electrodeCount = count;
  }

  /**
   * @async
   *
   * Fetch a frame from the configured frame server.
   *
   * @returns {Promise<Frame>}
   */
  async getNextFrame (): Promise<Frame> {
    if (this.frameServerUrl === LOCAL_FRAME_SERVER) {
      return Frame.factory(ElectrodeReadings.generate(this.electrodeCount));
    }

    try {
      const response = await fetch(this.frameServerUrl);
      const json = await response.json();

      console.log(json)

      return Frame.factory(ElectrodeReadings.fromArray(json));
    }
    catch (error) {
      console.error(error);

      return Frame.factory(ElectrodeReadings.empty(this.electrodeCount));
    }
  }
}

export default FrameService;
