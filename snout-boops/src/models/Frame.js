// A special value to use for the frame server url that will generate random
// frames locally rather than reaching out to a server.
const LOCAL_FRAME_SERVER = 'local';

// The url to the frame server.  Must be initialized via `Frame.setUrl`.
let frameServerUrl = null;

class Frame {
  static isFrameServerConfigured () {
    return frameServerUrl !== null;
  }

  static setUrl (url) {
    // @todo - validate!
    frameServerUrl = url;
  }

  static isFrame (frame) {
    return true;
    // return frame instanceof Frame;
  }

  static async getNextFrame () {
    if (frameServerUrl === null) {
      throw new Error('Must initialize frame server url before getting next frame.');
    }

    if (frameServerUrl === LOCAL_FRAME_SERVER) {
      // @todo
      return;
    }

    const response = await fetch(frameServerUrl);
    const json = await response.json();

    return Frame.factory(json);
  }

  static factory (spikes) {
    return new Frame(spikes);
  }

  constructor (spikes) {
    // @todo - validate!
    this.timestamp = Date.now();
    this.spikes = spikes;
    this.spikeCount = this.getSpikeCount();
  }

  getSpikeCount () {
    if (Number.isInteger(this.spikeCount)) {
      return this.spikeCount;
    }

    let spikeCount = 0;

    for (let i = 0; i < this.spikes.length; i++) {
      if (this.spikes[i]) {
        spikeCount++;
      }
    }

    this.spikeCount = spikeCount;
    return this.getSpikeCount();
  }
}

export default Frame;