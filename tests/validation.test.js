import { expect, test, describe } from 'vitest'
import { isVerb, isValidProjectSID, isValidTask, startValidation } from "../utils/validation.js"

describe('test the is verb method', () => {
  test('start verb', () => {
	  expect(isVerb("start")).toBe(true);
  });

  test('end verb', () => {
		expect(isVerb("end")).toBe(true);
  });

  test('abc verb', () => {
	  expect(isVerb("abc")).toBe(false);
  });

  test('"" verb', () => {
		expect(isVerb("")).toBe(false);
  });

  test('undefiend verb', () => {
	  expect(isVerb(undefined)).toBe(false);

  });

  test('null verb', () => {
		expect(isVerb(null)).toBe(false);
  });

  test('1 verb', () => {
		expect(isVerb(1)).toBe(false)
  });
})




describe('test the is valid project sid method', () => {
  test('alphabetic', () => {
		expect(isValidProjectSID("ossu")).toBe(true);
		expect(isValidProjectSID("abc")).toBe(true);
		expect(isValidProjectSID("c")).toBe(true);
  });

  test('alphanumeric', () => {
		expect(isValidProjectSID("project1")).toBe(true);
		expect(isValidProjectSID("p0")).toBe(true);
		expect(isValidProjectSID("0p")).toBe(true);
		expect(isValidProjectSID("project9402")).toBe(true);
  });

  test('numeric', () => {
		expect(isValidProjectSID("0")).toBe(true);
		expect(isValidProjectSID("1")).toBe(true);
		expect(isValidProjectSID("2")).toBe(true);
  });

  test('not alphanumeric', () => {
		expect(isValidProjectSID("project-01")).toBe(false);
		expect(isValidProjectSID("money$$")).toBe(false);
		expect(isValidProjectSID("askme?")).toBe(false);
  });

  test('empty value, null, undefined', () => {
		expect(isValidProjectSID("")).toBe(false);
		expect(isValidProjectSID(null)).toBe(false);
		expect(isValidProjectSID(undefined)).toBe(false);
  });

  test('max length', () => {
		expect(isValidProjectSID("dajsndkjsadnaskjndjkasndkasnjdnkasjndjkasndkjasndkjnasjkdnasjkdnaskjdnaskjdnjkasndjkasndjkasndjkasndjkasndjkasndkjasndkjasnsdjakbdskabdsajkbdkbasjkdbaksjbdkjsabdkjsabdjksabdjkabskjdbsajkdbsakjbdasjkbdakjs")).toBe(false);
  });
})

describe('test the is valid task method', () => {
  test('alphabetic', () => {
		expect(isValidTask("ossu")).toBe(true);
		expect(isValidTask("abc")).toBe(true);
		expect(isValidTask("c")).toBe(true);
  });

  test('alphanumeric', () => {
		expect(isValidTask("project1")).toBe(true);
		expect(isValidTask("p0")).toBe(true);
		expect(isValidTask("0p")).toBe(true);
		expect(isValidTask("project9402")).toBe(true);
  });

  test('numeric', () => {
		expect(isValidTask("0")).toBe(true);
		expect(isValidTask("1")).toBe(true);
		expect(isValidTask("2")).toBe(true);
  });

  test('not alphanumeric', () => {
		expect(isValidTask("project-01")).toBe(false);
		expect(isValidTask("money$$")).toBe(false);
		expect(isValidTask("askme?")).toBe(false);
  });

  test('empty value, null, undefined', () => {
		expect(isValidTask("")).toBe(false);
		expect(isValidTask(null)).toBe(false);
		expect(isValidTask(undefined)).toBe(false);
  });

  test('max length', () => {
		expect(isValidTask("dajsndkjsadnaskjndjkasndkasnjdnkasjndjkasndkjasndkjnasjkdnasjkdnaskjdnaskjdnjkasndjkasndjkasndjkasndjkasndjkasndkjasndkjasnsdjakbdskabdsajkbdkbasjkdbaksjbdkjsabdkjsabdjksabdjkabskjdbsajkdbsakjbdasjkbdakjs")).toBe(false);
  });
})

describe('test the is valid task method', () => {
  test('valid projectSId, not valid Task', () => {
		expect(startValidation("project", "")).toBe(false);
  });

  test('not valid projectSId, valid Task', () => {
		expect(startValidation("", "task")).toBe(false);
  });

  test('valid projectSId, valid Task', () => {
		expect(startValidation("project", "task")).toBe(true);
  });
})
