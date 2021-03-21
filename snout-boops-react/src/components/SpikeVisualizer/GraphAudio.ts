import {
  noteValues,
} from './utils';

function getFrequency (spikeCount: number) {
  switch (spikeCount) {
    case 5: return noteValues['D#0'] * 10;
    case 6: return noteValues['F#0'] * 10;
    case 7: return noteValues['G#0'] * 10;
    case 8: return noteValues['A#0'] * 10;
    case 9: return noteValues['C#1'] * 10;
    case 10: return noteValues['D#1'] * 10;
    case 11: return noteValues['F#1'] * 10;
    case 12: return noteValues['G#1'] * 10;
    case 13: return noteValues['A#1'] * 10;
    case 14: return noteValues['C#2'] * 10;
    case 15: return noteValues['D#2'] * 10;
    case 16: return noteValues['F#2'] * 10;
    case 17: return noteValues['G#2'] * 10;
    default: {
      if (spikeCount < 11) {
        return noteValues['C#0'] * 10;
      }

      return noteValues['A#2'] * 10;
    }
  }
}

class GraphAudio {
  context: AudioContext;
  oscillator: OscillatorNode;
  gain: GainNode;

  constructor () {
    this.context = new AudioContext();
    this.oscillator = this.context.createOscillator();
    this.gain = this.context.createGain();

    this.oscillator.connect(this.gain);
    this.gain.connect(this.context.destination);

    this.mute();
    this.oscillator.start();
  }

  mute () {
    this.gain.gain.value = 0;
  }

  unmute () {
    this.gain.gain.value = 0.2;
  }

  start () {
    this.unmute();
  }

  stop () {
    this.mute();
  }

  set (spikeCount: number) {
    this.oscillator.frequency.value = getFrequency(spikeCount);
  }
}

export default GraphAudio;
