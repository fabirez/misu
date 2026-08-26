import { FLAGS } from "../data/constants.js"

/**
 *  Check if the given arg is a long flag option
 *  @example
 *  ```
 *  isItLongFlag(--verbose)  true
 *  isItLongFlag(--v)       false
 *  ```
 *  ASSUME: the given input is of type string
 *  @param {string} flag
 *  @returns {boolean}
 *		true if it is, false otherwise.
 */
export function isItLongFlag(arg) {
	return arg.startsWith('--')
		&& arg.slice(2).length > 1;
}

/**
 *  Check if the given arg is a short flag option
 *  @example
 *  ```
 *  isItShortFlag(--verbose)  false
 *  isItShortFlag(-v)         true
 *  ```
 *  ASSUME: the given input is of type string
 *  @param {string} flag
 *  @returns {boolean}
 *		true if it is, false otherwise.
 */

export function isItShortFlag(arg) {
	return arg.startsWith('-')
		&& arg.slice(1).length === 1
		&& !arg.slice(1).match('-');
}

/**
 *  Check if the given arg exist in the constant flags object
 *  on the key "short".
 *  @example
 *  ```
 *  getShortFlag("s")   "status"
 *  getShortFlag("a")  ""
 *  ```
 *  ASSUME: the given input is of type string and with a length 1
 *  @param {string} flag
 *  @returns {string}
 *	 empty string if the flag doesn't exist, or the string
 *	 that rapresent the long form of the flag, the key
 *	 in the flag object
 */
export function getShortFlag(flag) {
	// Itereate all over the flags object, and check only the
	// short key if exist with the given flag
	for (const [key, values] of Object.entries(FLAGS)) {
		if (values.short && values.short === flag) { return key; }
	}
	return "";
}



/**
 *  Check if the given string is a "possible" flag
 *  Possible means, that the string starts with -
 *  @example
 *  ```js
 *  isFlag("abc") false
 *  isFlag("")    false
 *  isFlag("-")    true
 *  isFlag("--")   true
 *  isFlag("-a")   true
 *  isFlag("--a")  true
 *  ```
 *  ASSUME: the given input is of type string and with a length 1
 *  @param {string} flag
 *  @returns {boolean}
 *    true, if the given string has the syntax (starts with "-") of a flag otherwise false.
 */
export function isFlag(possibleFlag) {
	return possibleFlag.startsWith('-');
}
