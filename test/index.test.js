import { expect } from 'chai';
import * as myModule from '../index.js';

describe('ET12', () => {
  let et12;

  before(() => {
    et12 = new myModule.ET12();
  });

  it('should have correct octaves', () => {
    expect(et12.midiNumToFreq(69 - 12)).to.equal(440 / 2);
    expect(et12.midiNumToFreq(69)).to.equal(440);
    expect(et12.midiNumToFreq(69 + 12)).to.equal(440 * 2);
  });

  it('should be equally tempered', () => {
    const semitoneDist = et12.midiNumToFreq(1) / et12.midiNumToFreq(0);

    expect(semitoneDist).to.equal(Math.pow(2, 1 / 12));
  });

  it('should return correct midi', () => {
    expect(et12.freqToMidiNum(440 / 2)).to.equal(69 - 12);
    expect(et12.freqToMidiNum(440)).to.equal(69);
    expect(et12.freqToMidiNum(440 * 2)).to.equal(69 + 12);
  });

  it('should return correct SPN based on midi', () => {
    expect(et12.midiNumToSPN(69)).to.equal("A4");
  });

  it('should return correct midi based on SPN', () => {
    expect(et12.SPNToMidiNum("C#-2")).to.equal(-11);
    expect(et12.SPNToMidiNum("C4")).to.equal(60);
    expect(et12.SPNToMidiNum("A4")).to.equal(69);
    expect(et12.SPNToMidiNum("C5")).to.equal(72);
  });

  it('should behave consistently', () => {
    expect(et12.freqToMidiNum(et12.midiNumToFreq(42))).to.equal(42);
    expect(et12.SPNToMidiNum(et12.midiNumToSPN(42))).to.equal(42);
  });
});
