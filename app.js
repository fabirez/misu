#!/usr/bin/env node
import process from 'node:process';
import fs from "node:fs";

import {
	__dirname,
	EXIT_FAILURE,
	EXIT_SUCCESS,
	// WARNING_SYMBOL,
	ERROR_SYMBOL,
	INFO_SYMBOL,
	// STATUS_SYMBOL,
	PATH_DB,
	// DEFAULT_FLAG_ERROR_MESSAGE,
} from "./utils/constants.js"

import { parseVerb, parseFlag } from "./utils/parsing.js";
import { isVerb } from "./utils/validation.js";
import { start, end } from "./controllers/verbControllers.js"
import { isFlag } from './utils/flag.js';
import { helpFlag, statsFlag, statusFlag, versionFlag } from './controllers/flagsController.js';
import { initDB } from './utils/db.js';

function dispatch(action, payload) {
	switch (action) {
		case "start":
			return start(payload.projectSID, payload.taskName);
		case "end":
			return end();
		case "status":
			return statusFlag(payload.arg);
		case "stats":
			return statsFlag();
		case "help":
			return helpFlag(payload.arg);
		case "version":
			return versionFlag();
	}
}

export function startProgram(allArguments) {
	try {
		initDB()
		// If the db doesn't exist, then create the folder.
		if (!fs.existsSync(PATH_DB)) {
			fs.mkdirSync(PATH_DB, { recursive: true });
		}
	} catch (err) {
		console.error("Cannot create the databse!");
		console.log("Error:", err);
		process.exit(EXIT_FAILURE);
	}

	if (allArguments.length <= 0) {
		console.log(statusFlag("cli"));
		return process.exit(EXIT_SUCCESS);
	}

	if (isVerb(allArguments[0])) {
		const { res, action, payload } = parseVerb(allArguments);
		if (res === "err") {
			console.error(payload.message);
			return process.exit(EXIT_FAILURE);
		} else {
			return dispatch(action, payload);
		}
	} else if (isFlag(allArguments[0])) {
		const { res, action, payload } = parseFlag(allArguments);
		if (res === "err") {
			console.error(payload.message);
			return process.exit(EXIT_FAILURE);
		} else if (res === "ok") {
			return dispatch(action, payload);
		}
	} else {
		console.error(`${ERROR_SYMBOL} Error: "${allArguments[0]}" is not valid for misu`);
		console.log(`${INFO_SYMBOL} Run: 'misu --help, -h' for usage.`);
		return process.exit(EXIT_FAILURE);
	}
}

// Get the inputs and start the program
startProgram(process.argv.slice(2));
