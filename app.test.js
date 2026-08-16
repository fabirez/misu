import { expect, test } from 'vitest'
import { isVerb,isValidRecord, isValidTask, validateInput } from './app.js'

test('isVerb', () => {
  expect(isVerb("start")).toBe(true),
  expect(isVerb("end")).toBe(true),
  expect(isVerb("abc")).toBe(false),
  expect(isVerb("")).toBe(false),
  expect(isVerb(undefined)).toBe(false),
  expect(isVerb(null)).toBe(false),
  expect(isVerb(1)).toBe(false)
})

test('isValidRecord', () => {
  expect(isValidRecord("ossu")).toBe(true),
  expect(isValidRecord("general")).toBe(true),
  expect(isValidRecord("math")).toBe(true),
  expect(isValidRecord("")).toBe(false),
  expect(isValidRecord(undefined)).toBe(false),
  expect(isValidRecord(null)).toBe(false),
  expect(isValidRecord(1)).toBe(false)
})

test('isValidTask', () => {
  expect(isValidTask("cpd")).toBe(true),
  expect(isValidTask("spd")).toBe(true),
  expect(isValidTask("book")).toBe(true),
  expect(isValidTask("HPtD")).toBe(true),
  expect(isValidTask("")).toBe(false),
  expect(isValidTask(undefined)).toBe(false),
  expect(isValidTask(null)).toBe(false),
  expect(isValidTask(1)).toBe(false)
})

test('validateInput', () => {
  expect(validateInput(["start", "ossu", "cpd"])).toBe(undefined),
  expect(validateInput(["end"])).toBe(undefined),
  expect(validateInput(["start", "general", "book"])).toBe(undefined),
  expect(validateInput(["start", "general" ])).toBe(false),
  expect(validateInput(["end", "ossu", "cpd"])).toBe(false),
  expect(validateInput([])).toBe(false)
})
