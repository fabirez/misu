#!/usr/bin/env node
import Database from 'better-sqlite3';
const options = {}
const db = new Database('misu.db', options);
db.pragma('journal_mode = WAL');

// Global varibales
let isRunning = false;
let existingTask = false;
let existingProject = false;
let currentProjectSID, currentTaskID, currentTaskName, start_time;

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
	// new String('somestring') console.log(typeof somevar) // object 
	// (that's why we got typeof and instanceof)
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
	// new String('somestring') console.log(typeof somevar) // object 
	// (that's why we got typeof and instanceof)
	return (typeof taskName == "string" || taskName instanceof String)
		&&
		taskName.length >= 1
		&&
		taskName.length <= 124
		&&
		!taskName.match(/[^a-zA-Z0-9_]/);
}

// TODO: Test this
export function start(projectSID, taskName) {

	// 1. Add in the database the projectSID with a reference to taskName

	const c = db.prepare(`SELECT "sid" FROM "project" WHERE sid=?`)
	const r = c.get(projectSID)

	// If the projectSID doesn't exist in the database then create a new project in the db with a
	// one to many relationship with task.
	if (r === undefined) {
		const trs = db.transaction(() => {
			db.prepare(`INSERT INTO project (sid, total_time, created_at) VALUES (?, ?, ?)`).run(projectSID, 0, Date.now());
			db.prepare(`INSERT INTO task (task_name, total_time, created_at) VALUES (?, ?, ?)`).run(taskName, 0, Date.now());
			const { id } = db.prepare(`SELECT "id" FROM "task" WHERE "task_name"=?`).get(taskName);
			currentTaskID = id;
			db.prepare(`INSERT INTO stream (project_sid,task_id) VALUES (?, ?)`).run(projectSID, id);
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
		existingProject = true;
		let checkTask = db.prepare(`SELECT task_name FROM task WHERE (SELECT task_id FROM stream WHERE "project_sid"=?)`).all(projectSID)
		if (checkTask.length >= 1 && checkTask.filter((task) => task.task_name === taskName).length === 1) {
			existingTask = true;
		} else {
			const trs = db.transaction(() => {
				db.prepare(`INSERT INTO task (task_name, total_time, created_at) VALUES (?, ?, ?)`).run(taskName, 0, Date.now());
				db.prepare(`SELECT "sid" FROM "project" WHERE sid=?`)
				const { id } = db.prepare(`SELECT "id" FROM "task" WHERE "task_name"=?`).get(taskName);
				currentTaskID = id;
				db.prepare(`INSERT INTO stream (project_sid,task_id) VALUES (?, ?)`).run(projectSID, id);
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

	// 2. Initialize the timer in the background
	currentProjectSID = projectSID;
	currentTaskName = taskName;
	isRunning = true;
	start_time = Date.now();
}

/** 
	* return the current status of the program, based on the value 
	* by the global variable isRunning.
	*
	*		if the variable is false, then it just 
	*			@returns {obj} ....
	*
	*		if the variable is true, then it just 
	*			@returns {obj}
	*		
	*/
export function statusFlag() {
	if (isRunning) {
		console.log(JSON.stringify({
			isRunning,
			projectSID: currentProjectSID,
			taskName: currentTaskName,
			timer: Date.now() - start_time
		}))
		return;
	} else {
		console.log(JSON.stringify({ isRunning: isRunning }))
		return;
	}
}

// TODO: test this.
/** 
	* End the program
	*   - Update the filed total_time in the db of the tables project, task.
	*		- Reset the global variable 
	*       - isRunning to false 
	*				- currentSID, currentTaskID and start_time to undefined
	*	@returns{err | undefined}
	*			- return a log descriving the error, or undefined meaning everything is fine.
	*/
export function end() {
	// put status of (statusFlag)
	if (currentProjectSID === undefined || currentTaskID === undefined || start_time === undefined || isRunning === false) {
		console.log("No project/task running")
		return;
	}

	let totalTime = Date.now() - start_time;
	const trs = db.transaction(() => {
		if (existingProject && existingTask) {
			const { totalTime: totalTimeProjectDB } = db.prepare(`SELECT total_time FROM project WHERE sid = ?`).get(currentProjectSID);
			db.prepare(`INSERT INTO project (total_time) VALUES (?) WHERE sid = ?`).run(totalTimeProjectDB + totalTime, currentProjectSID)
			const { totalTime: totalTimeTaskDB } = db.prepare(`SELECT total_time FROM task WHERE id = ?`).get(currentTaskID);
			db.prepare(`INSERT INTO task (total_time) VALUES (?) where id = ?`).run(totalTimeTaskDB, currentTaskID);
		} else if (existingProject && !existingTask) {
			const { totalTime: totalTimeProjectDB } = db.prepare(`SELECT total_time FROM project WHERE sid = ?`).get(currentProjectSID);
			db.prepare(`INSERT INTO project (total_time) VALUES (?) WHERE sid = ?`).run(totalTimeProjectDB + totalTime, currentProjectSID)
			db.prepare(`INSERT INTO task (total_time) VALUES (?) where id = ?`).run(totalTime, currentTaskID);
		} else {
			db.prepare(`INSERT INTO project (total_time) VALUES (?) WHERE sid = ?`).run(totalTime, currentProjectSID);
			db.prepare(`INSERT INTO task (total_time) VALUES (?) where id = ?`).run(totalTime, currentTaskID);
		}
	})
	try {
		trs();
		console.log("Database transaction successfull")
		isRunning = false;
		existingTask = false;
		existingProject = false;
		currentProjectSID = undefined;
		currentTaskID = undefined;
		start_time = undefined;
		return;
	} catch (err) {
		console.error("Database transaction error")
		console.log("Error:", err)
	}
}

/**
	* @param {string} the verb 
	* @param {string} the recordSID
	* @param {string} the task name
	* Based on the given verb, call the right function
	*/
export function mainFunction(verb, recordSID = null, taskName = null) {
	//  if we got there, everything is validate!
	if (verb === "start") start(recordSID, taskName)
	if (verb === "end") end()
	if (verb === "--status") statusFlag()
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

export function validateInput(allArguments) {
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
		} else {
			console.log("List of all flags");
			return false;
		}
	} else {
		console.log("Not tracking");
		console.log("For a full list of commands use --help");
		return false;
	}
}

// Get the inputs and start the program
validateInput(process.argv.slice(2));
