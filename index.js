export const FREQ_REF_DEFAULT = 440;
export const MIDI_NUM_REF_DEFAULT = 69;
export const NOTES_PER_OCT_DEFAULT = 12;

/* Table of 12-TET chromatic note names with sharps. */
export const PITCH_CLASS_TABLE = {
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B"
};

export class ET {
  freqRef;
  midiNumRef;
  notesPerOct;

  constructor(freqRef = FREQ_REF_DEFAULT, midiNumRef = MIDI_NUM_REF_DEFAULT, notesPerOct = NOTES_PER_OCT_DEFAULT) {
    this.freqRef = freqRef;
    this.midiNumRef = midiNumRef;
    this.notesPerOct = notesPerOct;
  }

  midiNumToFreq(midiNum) {
    let midiNumDiff = midiNum - this.midiNumRef;
    let freq = this.freqRef * Math.pow(2, midiNumDiff / this.notesPerOct);

    return freq;
  }

  freqToMidiNum(freq) {
    let midiNum = this.notesPerOct * Math.log2(freq / this.freqRef) + this.midiNumRef;

    return midiNum;
  }
}

export class ET12 extends ET {
  constructor(freqRef = FREQ_REF_DEFAULT) {
    super(freqRef);
  }

  midiNumToOct(midiNum) {
    let oct = Math.floor(midiNum / NOTES_PER_OCT_DEFAULT) - 1;

    return oct;
  }

  midiNumToPitchClass(midiNum) {
    let tableIdx = mod(midiNum, NOTES_PER_OCT_DEFAULT);
    let pitchClass = PITCH_CLASS_TABLE[tableIdx];

    return pitchClass;
  }

  midiNumToSPN(midiNum) {
    let SPN = `${this.midiNumToPitchClass(midiNum)}${this.midiNumToOct(midiNum)}`;

    return SPN;
  }
}

/* Modulo function that behaves consistently in the negatives. 
Source: https://stackoverflow.com/a/17323608 */
function mod(n, m) {
  return ((n % m) + m) % m;
}
