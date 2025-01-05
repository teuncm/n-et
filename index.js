export const FREQ_REF_DEFAULT = 440;
export const MIDI_NUM_REF_DEFAULT = 69;
export const NOTES_PER_OCT_DEFAULT = 12;

/* Table of 12-ET chromatic note names using sharps. */
export const PITCH_CLASS_TABLE = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
];

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
    const midiNumDiff = midiNum - this.midiNumRef;
    const freq = this.freqRef * Math.pow(2, midiNumDiff / this.notesPerOct);

    return freq;
  }

  freqToMidiNum(freq) {
    const midiNum = Math.round(this.notesPerOct * Math.log2(freq / this.freqRef) + this.midiNumRef);

    return midiNum;
  }
}

export class ET12 extends ET {
  constructor(freqRef = FREQ_REF_DEFAULT) {
    super(freqRef);
  }

  midiNumToOct(midiNum) {
    const oct = Math.floor(midiNum / NOTES_PER_OCT_DEFAULT) - 1;

    return oct;
  }

  midiNumToPitchClass(midiNum) {
    const tableIdx = mod(midiNum, NOTES_PER_OCT_DEFAULT);
    const pitchClass = PITCH_CLASS_TABLE[tableIdx];

    return pitchClass;
  }

  midiNumToSPN(midiNum) {
    const SPN = `${this.midiNumToPitchClass(midiNum)}${this.midiNumToOct(midiNum)}`;

    return SPN;
  }

  SPNToMidiNum(SPN) {
    SPN = SPN.toUpperCase();

    const octRe = /[-]?[\d]+/;
    const oct = parseInt(SPN.match(octRe)[0]);

    const pitchClassRe = /[A-Z][#]?/;
    const pitchClass = SPN.match(pitchClassRe)[0];
    const pitchClassIdx = PITCH_CLASS_TABLE.indexOf(pitchClass);

    const midiNum = (oct + 1) * NOTES_PER_OCT_DEFAULT + pitchClassIdx;

    return midiNum;
  }
}

/* Modulo function that behaves consistently in the negatives. 
Source: https://stackoverflow.com/a/17323608 */
function mod(n, m) {
  return ((n % m) + m) % m;
}
