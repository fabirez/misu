import { magentify, yellowify, redify, blueify } from "./colorify.js"
import packageConfig from '../package.json' with { type: 'json' };
import path from "node:path";
import url from "node:url";
import fs from "node:fs";
import Database from 'better-sqlite3';


export const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
export const APP_ROOT = path.join(__dirname, '..');
export const HOME = process.env.HOME;
export const PATH_DB = `${HOME}/.local/share/misu/db`
export const PATH_SCHEMA_DB = `${APP_ROOT}/db/schema.sql`;
export const MISU_VERSION = packageConfig.version;

export const EXIT_FAILURE = 1;
export const EXIT_SUCCESS = 0;

export const WARNING_SYMBOL = yellowify("󰔶")
export const ERROR_SYMBOL = redify("")
export const INFO_SYMBOL = blueify("󰜋")
export const STATUS_SYMBOL = magentify("󰝥")

export const DEFAULT_FLAG_ERROR_MESSAGE = "Please use --help for all the commands"

export const SCHEMA = fs.readFileSync(PATH_SCHEMA_DB, 'utf8');

// Now it's only used for informations, data
export const VERBS = {
	start: {
		shortDescription:"  misu start",
		description:`Description\n  Start tracking the project\n\nUsage\n  misu start <projectSID> <taskSID>\n\nExamples\n  misu start project1 task1`
	},
	end: {
		shortDescription:"  misu end",
		description:`Description\n  End tracking\n\nUsage\n  misu end\n\nExamples\n  misu end`
	},
}

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
	},
	help: {
		type: "string",
		short: "h",
		values: Object.keys(VERBS),
		defaultValue:" ",
		value:undefined,
		description: "Show information, commands and flags by misu",
		errorMessage: `${WARNING_SYMBOL} Cannot help on this verb 
${STATUS_SYMBOL} misu --help, -h for information`
	},
	version: {
		type: "boolean",
		short: "v",
		description: "Show version, by misu",
	},
}

export const DB = new Database(`${APP_ROOT}/db/misu.db`, {});
DB.pragma('journal_mode = WAL'); DB.pragma('foreign_keys = ON');
