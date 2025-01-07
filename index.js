/**
 * Author: Teun Mathijssen
 * Link: https://github.com/teuncm/
 * Repository: https://github.com/teuncm/n-et/tree/main
 * 
 * Create and perform calculations on arbitrary equal temperament tunings. Useful for web apps that deal with MIDI, frequency or note information.
 * These classes contain tested calculations to build tuners, digital synthesizers and more.
 */

/* Default reference note frequency. */
export const FREQ_REF_DEFAULT = 440;
/* Default reference MIDI number. */
export const MIDI_NUM_REF_DEFAULT = 69;
/* Default number of notes per octave. */
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

/**
 * Modulo function that handles negative numbers correctly.
 * @param {number} n - The dividend.
 * @param {number} m - The divisor.
 * @returns {number} The positive remainder of `n % m`.
 */
function mod(n, m) {
  return ((n % m) + m) % m;
}

/* Generalized equal temperament. */
export class ET {
  /**
   * @param {number} [freqRef=FREQ_REF_DEFAULT] - Reference frequency in Hz.
   * @param {number} [midiNumRef=MIDI_NUM_REF_DEFAULT] - Reference MIDI note number.
   * @param {number} [notesPerOct=NOTES_PER_OCT_DEFAULT] - Number of notes per octave.
   */
  constructor(freqRef = FREQ_REF_DEFAULT, midiNumRef = MIDI_NUM_REF_DEFAULT, notesPerOct = NOTES_PER_OCT_DEFAULT) {
    this.freqRef = freqRef;
    this.midiNumRef = midiNumRef;
    this.notesPerOct = notesPerOct;
  }

  /**
   * Rounds a MIDI number to the nearest integer.
   * @param {number} midiNum - The MIDI number to quantize.
   * @returns {number} The quantized MIDI number.
   */
  quantizeMidiNum(midiNum) {
    const quantizedMidiNum = Math.round(midiNum);

    return quantizedMidiNum;
  }

  /**
   * Converts a MIDI number to a frequency in Hz.
   * @param {number} midiNum - The MIDI number to convert.
   * @returns {number} The frequency in Hz.
   */
  midiNumToFreq(midiNum) {
    const midiNumQuantized = this.quantizeMidiNum(midiNum);
    const midiNumRefDiff = midiNumQuantized - this.midiNumRef;
    const freq = this.freqRef * Math.pow(2, midiNumRefDiff / this.notesPerOct);

    return freq;
  }

  /**
   * Converts a MIDI number to a detuned frequency in Hz.
   * @param {number} midiNum - The MIDI number to convert.
   * @param {number} detune - The detuning in semitones.
   * @returns {number} The detuned frequency in Hz.
   */
  midiNumToFreqDetuned(midiNum, detune) {
    const freq = this.midiNumToFreq(midiNum);
    const freqDetuned = freq * this.semitonesToFreqRatio(detune);

    return freqDetuned;
  }

  /**
   * Converts a frequency in Hz to a MIDI number.
   * @param {number} freq - The frequency to convert.
   * @returns {number} The quantized MIDI number.
   */
  freqToMidiNum(freq) {
    const midiNum = this.notesPerOct * Math.log2(freq / this.freqRef) + this.midiNumRef;
    const midiNumQuantized = this.quantizeMidiNum(midiNum);

    return midiNumQuantized;
  }

  /**
   * Converts a frequency in Hz to a detuned MIDI number.
   * @param {number} freq - The frequency to convert.
   * @returns {[number, number]} An array containing the quantized MIDI number and detuning in semitones.
   */
  freqToMidiNumDetuned(freq) {
    const midiNum = this.freqToMidiNum(freq);
    const freqQuantized = this.midiNumToFreq(midiNum);
    const detune = this.freqRatioToSemitones(freq / freqQuantized);

    return [midiNum, detune];
  }

  /**
   * Converts semitones to a frequency ratio.
   * @param {number} semitones - The number of semitones to convert.
   * @returns {number} The frequency ratio.
   */
  semitonesToFreqRatio(semitones) {
    const freqRatio = Math.pow(2, semitones / this.notesPerOct);

    return freqRatio;
  }

  /**
   * Converts a frequency ratio to semitones.
   * @param {number} freqRatio - The frequency ratio to convert.
   * @returns {number} The equivalent semitones.
   */
  freqRatioToSemitones(freqRatio) {
    const semitones = this.notesPerOct * Math.log2(freqRatio);

    return semitones;
  }
}

/**
 * A subclass of ET for 12-tone equal temperament (12-ET).
 */
export class ET12 extends ET {
  /**
   * @param {number} [freqRef=FREQ_REF_DEFAULT] - Reference frequency in Hz.
   */
  constructor(freqRef = FREQ_REF_DEFAULT) {
    super(freqRef);
  }

  /**
   * Converts a MIDI number to its octave in Scientific Pitch Notation (SPN).
   * @param {number} midiNum - The MIDI number to convert.
   * @returns {number} The octave number.
   */
  midiNumToOct(midiNum) {
    const oct = Math.floor(midiNum / NOTES_PER_OCT_DEFAULT) - 1;

    return oct;
  }

  /**
   * Converts a MIDI number to its pitch class.
   * @param {number} midiNum - The MIDI number to convert.
   * @returns {string} The pitch class (e.g., "C", "D#", etc.).
   */
  midiNumToPitchClass(midiNum) {
    const midiNumQuantized = this.quantizeMidiNum(midiNum);
    const tableIdx = mod(midiNumQuantized, NOTES_PER_OCT_DEFAULT);
    const pitchClass = PITCH_CLASS_TABLE[tableIdx];

    return pitchClass;
  }

  /**
   * Converts a MIDI number to Scientific Pitch Notation (SPN).
   * @param {number} midiNum - The MIDI number to convert.
   * @returns {string} The SPN (e.g., "C4", "D#5", etc.).
   */
  midiNumToSPN(midiNum) {
    const SPN = `${this.midiNumToPitchClass(midiNum)}${this.midiNumToOct(midiNum)}`;

    return SPN;
  }

  /**
   * Normalizes a pitch class name (e.g., converts flats to sharps).
   * @param {string} pitchClass - The pitch class to normalize.
   * @returns {string} The normalized pitch class.
   */
  normalizePitchClass(pitchClass) {
    const pitchClassReplaced = pitchClass.replace("♯", "#").replace("♭", "b");
    const pitchClassTranslated = PITCH_CLASS_TRANSLATION_TABLE[pitchClassReplaced] ?? pitchClassReplaced;

    return pitchClassTranslated;
  }

  /**
   * Converts Scientific Pitch Notation (SPN) to a MIDI number.
   * @param {string} SPN - The SPN to convert (e.g., "C4", "D#5").
   * @returns {number} The corresponding MIDI number.
   */
  SPNToMidiNum(SPN) {
    /* Extract the octave number, which can be negative and multi-digit. */
    const octRe = /[-]?[\d]+/;
    const octStr = SPN.match(octRe)[0];
    const oct = parseInt(octStr);

    /* Extract the pitch class. */
    const pitchClass = SPN.replace(octStr, "");
    const pitchClassNormalized = this.normalizePitchClass(pitchClass);
    const pitchClassIdx = PITCH_CLASS_TABLE.indexOf(pitchClassNormalized);

    return (oct + 1) * NOTES_PER_OCT_DEFAULT + pitchClassIdx;
  }
}
