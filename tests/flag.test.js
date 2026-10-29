import { expect, test, describe } from 'vitest'
import { isItLongFlag, isItShortFlag, getShortFlag } from "../utils/flag.js"

describe('test the is it long flag method', () => {
  test('long --flag', () => {
    expect(isItLongFlag("--flag")).toBe(true);
  });

  test('short -f', () => {
    expect(isItLongFlag("-f")).toBe(false);
  });

  test('only -', () => {
    expect(isItLongFlag("-")).toBe(false);
  });

  test('only --', () => {
    expect(isItLongFlag("--")).toBe(false);
  });
})

describe('test the is it long flag method', () => {
  test('long --flag', () => {
    expect(isItShortFlag("--flag")).toBe(false);
  });

  test('short -f', () => {
    expect(isItShortFlag("-f")).toBe(true);
  });

  test('only -', () => {
    expect(isItShortFlag("-")).toBe(false);
  });

  test('only --', () => {
    expect(isItShortFlag("--")).toBe(false);
  });
})


describe('test the getShortFlag method', () => {
  test('long --flag', () => {
    expect(getShortFlag("f")).toBe("");
  });

  test('short -f', () => {
    expect(getShortFlag("s")).toBe("status");
  });

  test('only -', () => {
    expect(getShortFlag("-")).toBe("");
  });

  test('only --', () => {
    expect(getShortFlag("--")).toBe("");
  });

  test('null', () => {
    expect(getShortFlag(null)).toBe("");
  });

  test('undefined', () => {
    expect(getShortFlag(undefined)).toBe("");
  });

})
