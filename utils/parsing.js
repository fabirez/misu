import { isItLongFlag, isItShortFlag, getShortFlag } from "./flag.js";
import { startValidation } from "./validation.js";
import { DEFAULT_FLAG_ERROR_MESSAGE, FLAGS } from "./constants.js";
import { yellowify } from "./colorify.js";

export function parseFlag(allArguments) {
	let flag;
	// get long version if it exist, otherwise the showrt one.
	if (isItLongFlag(allArguments[0])) {
		flag = allArguments[0].slice(2);;
	} else if (isItShortFlag(allArguments[0])) {
		// Return the long version of the flag "s" -> "status"
		flag = getShortFlag(allArguments[0].slice(1));
	}
	// If the flag doesn't exist for some strange reason, or it is not the one
	// tht we expect (status, stats)

	if (!flag || !FLAGS[flag]) {
		let allFlags = Object.keys(FLAGS);
		return {
			res: "err", action: "err", payload: {
				message:
					`${yellowify("󰔶")} The flag doens't exist, please use existing flags:\n
${allFlags.map((flag) => {
						return `--${flag}${FLAGS[flag]?.short ? ", " + "-" + FLAGS[flag]?.short : "     "}   ${FLAGS[flag].description}`
					}).join('\n')}
				`,
			}
		};
	}

	if (FLAGS[flag].type === "string") {
		const value = allArguments[1];
		if (value && FLAGS[flag].values.includes(value)) {
			return { res: "ok", action: flag, payload: { arg: value } };
		} else if (FLAGS[flag]?.defaultValue && !value) {
			return { res: "ok", action: flag, payload: { arg: FLAGS[flag].defaultValue } };
		} else {
			return {
				res: "err",
				action: "err",
				payload: { message: FLAGS[flag].errorMessage ?? DEFAULT_FLAG_ERROR_MESSAGE }
			}
		}
	} else if (FLAGS[flag].type === "boolean") {
		return { res: "ok", action: flag, payload: undefined };
	} else {
		return { res: "err", action: "err", payload: { message: "We should not be able to be there.", } };
	}
}

export function parseVerb(allArguments) {
	if (allArguments[0] === "start") {
		if (startValidation(allArguments[1], allArguments[2])) {
			return { res: "ok", action: allArguments[0], payload: { projectSID: allArguments[1], taskName: allArguments[2] } };
		} else {
			// TODO: handle message error better 
			return { res: "err", action: "err", payload: { message: "" } };
		}
	} else if (allArguments[0] === "end" && allArguments.length === 1) {
		return { res: "ok", action: allArguments[0], payload: undefined }
	} else {
		return { res: "err", action: "err", payload: { message: "The verb is not good." } }
	}
}
