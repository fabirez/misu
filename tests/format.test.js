import { expect, test, describe } from 'vitest'
import { formatTimer, formatTime, formatDate } from "../utils/format.js"

describe('test the format timer method', () => {
  test('formats 0 seconds', () => {
    expect(formatTimer(Date.now())).toBe('00:00:00');
  });

  test('formats 10 seconds', () => {
    expect(formatTimer(Date.now() - 10000)).toBe('00:00:10');
  });

  test('format 1 minute', () => {
    expect(formatTimer(Date.now() - 60000)).toBe('00:01:00');
  });

  test('format 10 minutes', () => {
    expect(formatTimer(Date.now() - 600000)).toBe('00:10:00');
  });

  test('format 1 hour', () => {
    expect(formatTimer(Date.now() - 3600000)).toBe('01:00:00');
  });

  test('format 1 day', () => {
    expect(formatTimer(Date.now() - 86400000)).toBe('24:00:00');
  });

  test('format seconds', () => {
    expect(formatTimer(Date.now() - 15000)).toBe('00:00:15');
  });

  test('format minutes and seconds', () => {
    expect(formatTimer(Date.now() - 80000)).toBe('00:01:20');
  });

  test('format hours, minutes and seconds', () => {
    expect(formatTimer(Date.now() - 6_988_000)).toBe('01:56:28');
  });
})



describe('test the format time method', () => {
  test('formats 0 seconds', () => {
    expect(formatTime(0)).toBe('00s');
  });

  test('formats 10 seconds', () => {
    expect(formatTime(10000)).toBe('10s');
  });

  test('format 1 minute', () => {
    expect(formatTime(60000)).toBe('01m00s');
  });

  test('format 10 minutes', () => {
    expect(formatTime(600000)).toBe('10m00s');
  });

  test('format 1 hour', () => {
    expect(formatTime(3600000)).toBe('01h00m00s');
  });

  test('format 1 day', () => {
    expect(formatTime(86400000)).toBe('24h00m00s');
  });

  test('format seconds', () => {
    expect(formatTime(15000)).toBe('15s');
  });

  test('format minutes and seconds', () => {
    expect(formatTime(80000)).toBe('01m20s');
  });

  test('format hours, minutes and seconds', () => {
    expect(formatTime(6_988_000)).toBe('01h56m28s');
  });
})


describe('test the format date method', () => {
  test('format date', () => {
    expect(formatDate(new Date(2025, 8, 20))).toBe('20-09-2025');
  });

  test('format date', () => {
    expect(formatDate(new Date(2026, 1, 5))).toBe('05-02-2026');
  });

  test('format date', () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe('05-01-2026');
  });

  test('format date', () => {
    expect(formatDate(new Date(2026, 11, 30))).toBe('30-12-2026');
  });
})
