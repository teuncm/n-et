import { expect } from 'chai';
import * as myModule from '../index.js';

describe('ET12', () => {
  let et12;

  before(() => {
    et12 = new myModule.ET12();
  });

  it('should have correct octaves', () => {
    expect(et12.getFreq(69 - 12)).to.equal(440 / 2);
    expect(et12.getFreq(69)).to.equal(440);
    expect(et12.getFreq(69 + 12)).to.equal(440 * 2);
  });

  it('should be equally tempered', () => {
    let semitoneDist = et12.getFreq(1) / et12.getFreq(0);

    expect(semitoneDist).to.equal(Math.pow(2, 1 / 12));
  });

  it('should return correct midi numbers', () => {
    expect(et12.getMidiNum(440 / 2)).to.equal(69 - 12);
    expect(et12.getMidiNum(440)).to.equal(69);
    expect(et12.getMidiNum(440 * 2)).to.equal(69 + 12);
  });

  it('should return correct names', () => {
    expect(et12.getFullName(69)).to.equal("A4");
  });
});
