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

/* Flats to sharps translation table. */
export const PITCH_CLASS_TRANSLATION_TABLE = {
  "Db": "C#",
  "Eb": "D#",
  "Gb": "F#",
  "Ab": "G#",
  "Bb": "A#"
}

/* Modulo function that behaves consistently in the negatives. 
Source: https://stackoverflow.com/a/17323608 */
function mod(n, m) {
  return ((n % m) + m) % m;
}

/* Generalized equal temperament. */
export class ET {
  freqRef;
  midiNumRef;
  notesPerOct;

  constructor(freqRef = FREQ_REF_DEFAULT, midiNumRef = MIDI_NUM_REF_DEFAULT, notesPerOct = NOTES_PER_OCT_DEFAULT) {
    this.freqRef = freqRef;
    this.midiNumRef = midiNumRef;
    this.notesPerOct = notesPerOct;
  }

  quantizeMidiNum(midiNum) {
    const quantizedMidiNum = Math.round(midiNum);

    return quantizedMidiNum;
  }

  midiNumToFreq(midiNum) {
    const midiNumQuantized = this.quantizeMidiNum(midiNum);
    const midiNumRefDiff = midiNumQuantized - this.midiNumRef;
    const freq = this.freqRef * Math.pow(2, midiNumRefDiff / this.notesPerOct);

    return freq;
  }

  midiNumToFreqDetuned(midiNum, detune) {
    const freq = this.midiNumToFreq(midiNum);
    const freqDetuned = freq * this.semitonesToFreqRatio(detune);

    return freqDetuned;
  }

  freqToMidiNum(freq) {
    const midiNum = this.notesPerOct * Math.log2(freq / this.freqRef) + this.midiNumRef;
    const midiNumQuantized = this.quantizeMidiNum(midiNum);

    return midiNumQuantized;
  }

  freqToMidiNumDetuned(freq) {
    const midiNum = this.freqToMidiNum(freq);
    const freqQuantized = this.midiNumToFreq(midiNum);
    const detune = this.freqRatioToSemitones(freq / freqQuantized);

    return [midiNum, detune];
  }

  semitonesToFreqRatio(semitones) {
    const freqRatio = Math.pow(2, semitones / this.notesPerOct);

    return freqRatio;
  }

  freqRatioToSemitones(freqRatio) {
    const semitones = this.notesPerOct * Math.log2(freqRatio);

    return semitones;
  }
}

/**
 * 12 tone equal temperament, also known as 12-ET, 12-TET, 12-EDO etc. 
 * Most commonly used tuning system today, both in digital and analog instruments.
 * */
export class ET12 extends ET {
  constructor(freqRef = FREQ_REF_DEFAULT) {
    super(freqRef);
  }

  midiNumToOct(midiNum) {
    const oct = Math.floor(midiNum / NOTES_PER_OCT_DEFAULT) - 1;

    return oct;
  }

  midiNumToPitchClass(midiNum) {
    const midiNumQuantized = this.quantizeMidiNum(midiNum);
    const tableIdx = mod(midiNumQuantized, NOTES_PER_OCT_DEFAULT);
    const pitchClass = PITCH_CLASS_TABLE[tableIdx];

    return pitchClass;
  }

  midiNumToSPN(midiNum) {
    const SPN = `${this.midiNumToPitchClass(midiNum)}${this.midiNumToOct(midiNum)}`;

    return SPN;
  }

  normalizePitchClass(pitchClass) {
    const pitchClassReplaced = pitchClass.replace("♯", "#").replace("♭", "b");
    const pitchClassTranslated = PITCH_CLASS_TRANSLATION_TABLE[pitchClassReplaced] ?? pitchClassReplaced;

    return pitchClassTranslated;
  }

  SPNToMidiNum(SPN) {
    /* Second segment is the octave number. Can be negative and multi-digit. */
    const octRe = /[-]?[\d]+/;
    const octStr = SPN.match(octRe)[0];
    const oct = parseInt(octStr);

    /* First segment is the pitch class. */
    const pitchClass = SPN.replace(octStr, "");
    const pitchClassNormalized = this.normalizePitchClass(pitchClass);
    const pitchClassIdx = PITCH_CLASS_TABLE.indexOf(pitchClassNormalized);

    const midiNum = (oct + 1) * NOTES_PER_OCT_DEFAULT + pitchClassIdx;

    return midiNum;
  }
}
