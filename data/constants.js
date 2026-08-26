import { magentify, yellowify, redify, blueify } from "./lib/colorify.js"
import path from "node:path";
import url from "node:url";
import Database from 'better-sqlite3';

export const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const BAD_INPUT = 1;
export const GOOD = 0;

export const WARNING_SYMBOL = yellowify("󰔶")
export const ERROR_SYMBOL = redify("")
export const INFO_SYMBOL = blueify("󰜋")
export const STATUS_SYMBOL = magentify("󰝥")

export const DEAFULT_FLAG_ERROR_MESSAGE = "Please use --help for all the commands"

export const FLAGS = {
	// only if the type is string can have values otherwise not.
	status: {
		type: "string",
		short: "s",
		values: ["json", "cli"],
		defaultValue: "cli",
		value: undefined,
		description: "Output the stauts in json, cli (default 'cli')",
		errorMessage: `${WARNING_SYMBOL} Output format only in cli, json (default 'cli') 
${STATUS_SYMBOL} misu --status cli, misu --status json`
	},
	stats: {
		type: 'boolean',
		description: "Show stats, data of your projects, tasks"
	}
}

export const DB = new Database(`${__dirname}/misu.db`, {});
DB.pragma('journal_mode = WAL');
