#!/usr/bin/env node
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
//====================
// Database 
//====================

import Database from 'better-sqlite3';
import { time } from "node:console";
const options = {}
const db = new Database(`${__dirname}/misu.db`, options);
db.pragma('journal_mode = WAL');

//====================
// Validation
//====================

/*
	* @param {string} the verb (start || end)
	* @return {boolean}
	*   true if the given verb is start or end
	*   false otherwise.
	*/
export function isVerb(verb) {
	switch (verb) {
		case "start":
			return true;
		case "end":
			return true;
		default:
			return false;
	}
}

/*
	* @param {string} flag (--status)
	* @return {boolean}
	*   true if the given flag exist
	*   false otherwise.
	*/
export function isFlag(verb) {
	switch (verb) {
		case "--status":
			return true;
		case "--stats":
			return true;
		default:
			return false;
	}
}

/**
	* @param {string} the recordSID 
	* @return {boolean}
	*   true if the given recordSID is valid
	*   false otherwise.
	*
	*   Valid means:
	*			- Need to be a string
	*     - Needs to be alphanumeric (a-zA-Z0-9_)
	*     - Length >= 1 && <= 124
	*/
export function isValidRecord(recordSID) {
	return (typeof recordSID == "string" || recordSID instanceof String)
		&&
		recordSID.length >= 1
		&&
		recordSID.length <= 124
		&&
		!recordSID.match(/[^a-zA-Z0-9_]/);
}

/**
	* @param {string} the task name
	* @return {boolean}
	*   true if the given task name is valid
	*   false otherwise.
	*
	*   Valid means:
	*			- Need to be a string
	*     - Needs to be alphanumeric (a-zA-Z0-9_)
	*     - Length >= 1 && <= 124
	*/
export function isValidTask(taskName) {
	return (typeof taskName == "string" || taskName instanceof String)
		&&
		taskName.length >= 1
		&&
		taskName.length <= 124
		&&
		!taskName.match(/[^a-zA-Z0-9_]/);
}


//====================
// Utility
//====================

/**
 * Format the given timestamp to a readable human format
 * and return the time passed between the started timer
 * @param {int} timestamp
 * @returns {string} 
 *	the time in the following format hh:mm:ss
 */

// TODO: test this
export function formatTimer(timestamp) {
	const elapsed = Date.now() - timestamp;

	const hours = Math.floor(elapsed / 3600000);
	const minutes = Math.floor(elapsed / 60000) % 60;
	const seconds = Math.floor(elapsed / 1000) % 60;

	const result =
		`${String(hours).padStart(2, '0')}:` +
		`${String(minutes).padStart(2, '0')}:` +
		`${String(seconds).padStart(2, '0')}`;

	return result;
}

export function formatTime(timestamp) {
	const hours = Math.floor(timestamp / 3600000);
	const minutes = Math.floor(timestamp / 60000) % 60;
	const seconds = Math.floor(timestamp / 1000) % 60;

	// NOTE: without () javascript give precendece + over ?
	return (hours ? `${String(hours).padStart(2, '0')}h` : "") +
		(minutes ? `${String(minutes).padStart(2, '0')}m` : "") +
		(seconds ? `${String(seconds).padStart(2, '0')}s` : "");
}

/**
 * Format the given timestamp to a readable human format
 * @param {int} timestamp
 * @returns {string} 
 *	the date in the following format dd:mm:yy
 */

// TODO: test this
export function formatDate(timestamp) {
	const date = new Date(timestamp);
	const yy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	return `${dd}-${mm}-${yy}`;
}

//====================
// Verbs
//====================

export function start(projectSID, taskName) {

	const c = db.prepare(`SELECT "sid" FROM "project" WHERE sid=?`)
	const r = c.get(projectSID)

	// If the projectSID doesn't exist in the database then create a new project in the db with a
	// one to many relationship with task.
	if (r === undefined) {
		const trs = db.transaction(() => {
			db.prepare(`INSERT INTO project (sid, total_time, created_at) VALUES (?, ?, ?)`).run(projectSID, 0, Date.now());
			db.prepare(`INSERT INTO task (task_name, total_time, created_at) VALUES (?, ?, ?)`).run(taskName, 0, Date.now());
			const { id } = db.prepare(`SELECT "id" FROM "task" WHERE "task_name"=?`).get(taskName);
			db.prepare(`INSERT INTO stream (project_sid,task_id) VALUES (?, ?)`).run(projectSID, id);

			// Add the project to the current state.
			db.prepare(`INSERT INTO state (current_project_sid, current_task_id, timestamp_start) VALUES (?, ?, ?)`).run(projectSID, id, Date.now());
		})
		try {
			trs();
			console.log("Database transaction successfull")
		} catch (err) {
			console.error("Database transaction error")
			console.log("Error:", err)
		}
	} else {
		// 1.1 Check if there is already a task with taskName
		// Get all (many) the task with one relation with the current projectSID
		let getAllTask = db.prepare(`SELECT task_name,id FROM task WHERE (SELECT task_id FROM stream WHERE "project_sid"=?)`).all(projectSID)
		if (getAllTask.length >= 1 && getAllTask.filter((task) => task.task_name === taskName).length === 1) {
			const { id } = getAllTask.filter((task) => task.task_name === taskName)[0];
			try {
				// Add the project to the current state.
				db.prepare(`INSERT INTO state (current_project_sid, current_task_id, timestamp_start) VALUES (?, ?, ?)`).run(projectSID, id, Date.now());
				console.log("Database transaction successfull")
			} catch (err) {
				console.error("Database transaction error")
				console.log("Error:", err)
			}
		} else {
			const trs = db.transaction(() => {
				db.prepare(`INSERT INTO task (task_name, total_time, created_at) VALUES (?, ?, ?)`).run(taskName, 0, Date.now());
				db.prepare(`SELECT "sid" FROM "project" WHERE sid=?`)
				const { id } = db.prepare(`SELECT "id" FROM "task" WHERE "task_name"=?`).get(taskName);
				db.prepare(`INSERT INTO stream (project_sid,task_id) VALUES (?, ?)`).run(projectSID, id);
				// Add the project to the current state.
				db.prepare(`INSERT INTO state (current_project_sid, current_task_id, timestamp_start) VALUES (?, ?, ?)`).run(projectSID, id, Date.now());
			})
			try {
				trs();
				console.log("Database transaction successfull")
			} catch (err) {
				console.error("Database transaction error")
				console.log("Error:", err)
			}
		}
	}
}

/** 
	* End the program
	*   - Update the filed total_time in the db of the tables project, task.
	*		- Reset the global variable 
	*       - isRunning to false 
	*				- currentSID, currentTaskID and startTime to undefined
	*	@returns{err | undefined}
	*			- return a log descriving the error, or undefined meaning everything is fine.
	*/
export function end() {

	const state = db.prepare(`SELECT * FROM state`).get();
	// put status of (statusFlag)
	if (state === undefined) {
		console.log("No project/task running")
		return;
	}

	const { current_project_sid: currentProjectSID, current_task_id: currentTaskID, timestamp_start: startTime } = state
	let totalTime = Date.now() - startTime;

	const trs = db.transaction(() => {
		const { total_time: totalTimeProjectDB } = db.prepare(`SELECT total_time FROM project WHERE sid = ?`).get(currentProjectSID);
		db.prepare(`UPDATE project SET total_time = ? WHERE "sid" = ?`).run(totalTimeProjectDB + totalTime, currentProjectSID)

		const { total_time: totalTimeTaskDB } = db.prepare(`SELECT total_time FROM task WHERE "id" = ?`).get(currentTaskID);
		db.prepare(`UPDATE task SET total_time = ? WHERE "id" = ?`).run(totalTimeTaskDB + totalTime, currentTaskID);

		db.prepare(`DELETE FROM state WHERE current_project_sid=?`).run(currentProjectSID);
	})

	try {
		trs();
		console.log("Database transaction successfull")
		return;
	} catch (err) {
		console.error("Database transaction error")
		console.log("Error:", err)
	}
}

//====================
// Flags
//====================

/** 
	* produce the current status of the program, based on the value 
	* by the global variable isRunning.
	*
	*		if the variable is false, then it just 
	*			@returns {obj}  
	*
	*		if the variable is true, then it just 
	*			@returns {obj}
	*		
	*/
export function statusFlag() {
	const state = db.prepare(`SELECT * FROM state`).get();
	if (state) {
		const { current_project_sid: currentProjectSID, current_task_id: currentTaskID, timestamp_start: startTime } = state;
		let timer = formatTimer(startTime);
		const { task_name: taskName } = db.prepare(`SELECT task_name FROM task WHERE id=?`).get(currentTaskID);
		console.log(JSON.stringify({
			isRunning: true,
			projectSID: currentProjectSID,
			taskName: taskName,
			timer
		}))
		return;
	} else {
		console.log(JSON.stringify({ isRunning: false }))
		return;
	}
}


/** 
	* produce the statas of the projects and tasks by the user.
	*		
	*/
export function statsFlag() {
	const allProjects = db.prepare(`SELECT * FROM project`).all();
	if (Array.isArray(allProjects) && allProjects.length > 0) {
		for (const project of allProjects) {
			const { sid, total_time: totalTimeProject, created_at: createdAtProject } = project;
			console.log(sid)
			const tasks = db.prepare(`SELECT * from task WHERE id IN (select task_id FROM stream WHERE project_sid = ?)`).all(sid);
			console.log(" ", tasks?.length + "   ", formatTime(totalTimeProject), formatDate(createdAtProject))
			for (const task of tasks) {
				const { id, task_name: taskName, total_time: totalTimeTask, created_at: createdAtTask } = task;
				console.log(" 󰨓", taskName)
				console.log("   ", formatTime(totalTimeTask), formatDate(createdAtTask))
			}
		}
	} else {
		console.log("There are still no project tracker.")
		console.log("")
		console.log("For tracking a new project:")
		console.log("󰨓 misu start <projectSID> <taskSID>")
		console.log("")
		console.log("For listing all the commands available:")
		console.log("󰨓 misu --help")
	}
}

//====================
// Initial Funcionts
//====================

/**
	* Based on the given verb, call the right function
	* @param {string} the verb 
	* @param {string} the recordSID
	* @param {string} the task name
	*/
export function mainFunction(verb, recordSID = null, taskName = null) {
	// TODO: change param names
	if (verb === "start") start(recordSID, taskName)
	if (verb === "end") end()
	if (verb === "--status") statusFlag()
	if (verb === "--stats") statsFlag()
}

/** 
	* Check if the given input by the cli are valid.
	* If it is, start the program calling the right function.
	* Otherwise return a message in the console
	* @param   {string[]} the args from the cli
	* @return {undefined | false}		
	*			- undefined if everything works good
	*			- false if there is a problem with a message indicating possible solutions
	*/

export function startProgram(allArguments) {
	if (isVerb(allArguments[0])) {
		const verb = allArguments[0];
		if (verb === "start" && allArguments.length === 3 && isValidRecord(allArguments[1]) && isValidTask(allArguments[2])) {
			return mainFunction(verb, allArguments[1], allArguments[2]);
		} else if (verb === "end" && allArguments.length === 1) {
			return mainFunction(verb);
		} else {
			console.log("Syntax <verb> <projectSID> <taskSID>");
			return false;
		}
	} else if (isFlag(allArguments[0])) {
		const flag = allArguments[0];
		if (flag === "--status" && allArguments.length === 1) {
			return mainFunction(flag)
		} else if (flag === "--stats" && allArguments.length === 1) {
			return mainFunction(flag)
		} else {
			// TODO:
			console.log("List of all flags");
			return false;
		}
	} else {
		console.log("󰝤 Not tracking");
		console.log("For a full list of commands use --help");
		return false;
	}
}

// Get the inputs and start the program
startProgram(process.argv.slice(2));
