import process from 'node:process';
import { EXIT_FAILURE } from './constants.js';

/*
	* Check if the given verb exist.
	* @example
	* ```js
	* isVerb("")      false
	* isVerb("asda")  false
	* isVerb("start") true
	* isVerb("end")		true
	* ```
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

/**
	* Check if the given projectSID is valid.
	* - Valid means:
	*			1. Need to be a string
	*     2. Needs to be alphanumeric (a-zA-Z0-9_)
	*     3. Length >= 1 && <= 124
	* @example
	* ```js
	* isValidProjectSID("")          false
	* isValidProjectSID("project-1") false
	* isValidProjectSID("project_1") true
	* ```
	* @param {string} the projectSID 
	* @return {boolean}
	*   true if the given projectSID is valid
	*   false otherwise.
	*/
export function isValidProjectSID(projectSID) {
	return (typeof projectSID == "string" || projectSID instanceof String)
		&&
		projectSID.length >= 1
		&&
		projectSID.length <= 124
		&&
		!projectSID.match(/[^a-zA-Z0-9_]/);
}

/**
	* Check if the given task name is valid.
	* - Valid means:
	*			1. Need to be a string
	*     2. Needs to be alphanumeric (a-zA-Z0-9_)
	*     3. Length >= 1 && <= 124
	* @example
	* ```js
	* isValidTask("")       false
	* isValidTask("task-1") false
	* isValidTask("task_1") true
	* ```
	* @param {string} the task name
	* @return {boolean}
	*   true if the given task name is valid
	*   false otherwise.
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


/**
	* The validation needed for the verb start,
	* check if the given projectSID and task are
	* valid.
	* - Valid means:
	*			1. Need to be a string
	*     2. Needs to be alphanumeric (a-zA-Z0-9_)
	*     3. Length >= 1 && <= 124
	* @param {string} the project SID 
	* @param {string} the task name
	* @return {boolean}
	*   true if the given task name and projectSID are valid; 
	*   false otherwise
	*/

export function startValidation(projectSID, taskName) {

	if (!projectSID) {
		console.error("󰔶  A project SID is required")
		console.error("")
		console.error("󰜋  misu start <project> <task>")
		return false;
	}

	if (!taskName) {
		console.error("󰔶  A name for the task is required");
		console.error("")
		console.error(`󰜋  misu start ${projectSID} <task>`)
		return false;
	}

	const validation = isValidProjectSID(projectSID) && isValidTask(taskName);
	if (!validation) {
		console.error("󰔶  Only alphanumeric charater are admitted (a-zA-Z0-9_)");
		console.error("")
		console.error(`󰜋  misu start <project> <task>`)
		return false;
	}

	return validation;
}

