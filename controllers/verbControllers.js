import {
	addProjectInDB,
	addTaskInDB,
	addStreamInDB,
	addStateInDB,
	getProjectSIDFromSID,
	getAllTaskFromProjectSID,
	getTotaltTimeProjectFromSID,
	getTotaltTimeTaskFromID,
	updateProjectTotalTime,
	updateTaskTotalTime,
	deleteStateFromSID,
	getState
} from "../utils/db.js"
import { DB as db, EXIT_FAILURE, EXIT_SUCCESS } from "../utils/constants.js"
import { statusFlag } from "./flagsController.js";


/** 
  * TODO: better jsdoc
	*
	* Start the program
	*	@returns{err | undefined}
	*/
export function start(projectSID, taskName) {

	// Check if another task is already running.
	// If it is, just return the state of that one.
	const state = getState();
	if(state !== undefined) { return statusFlag("cli") }

	// If the projectSID doesn't exist in the database then create a new project in the db with a
	// one to many relationship with task.
	if (getProjectSIDFromSID(projectSID) === undefined) {
		const trs = db.transaction(() => {
			addProjectInDB(projectSID, 0, Date.now());
			const getID = addTaskInDB(taskName, 0, Date.now());
			const id = getID.lastInsertRowid;
			addStreamInDB(projectSID, id);
			addStateInDB(projectSID, id, Date.now())
		})
		try {
			 trs();
		} catch (err) {
			console.error("Database transaction error")
			console.log("Error:", err)
		}
	} else {
		// 1.1 Check if there is already a task with taskName
		// Get all (many) the task with one relation with the current projectSID
		let getAllTask = getAllTaskFromProjectSID(projectSID)
		// If there is a task, then update only the state
		if (getAllTask.length >= 1 && getAllTask.filter((task) => task.task_name === taskName).length === 1) {
			const { id } = getAllTask.filter((task) => task.task_name === taskName)[0];
			try {
				addStateInDB(projectSID, id, Date.now())
			} catch (err) {
				console.error("Database transaction error")
				console.log("Error:", err)
			}
		} else {
			// If there is no task, then add the task, update the stream and the state.
			const trs = db.transaction(() => {
				const getID = addTaskInDB(taskName, 0, Date.now())
				const id = getID.lastInsertRowid;
				addStreamInDB(projectSID, id)
				addStateInDB(projectSID, id, Date.now())
			})
			try {
				trs();
			} catch (err) {
				console.error("Database transaction error")
				console.log("Error:", err)
				return process.exit(EXIT_FAILURE)
			}
		}
	}
}

/** 
	* End the program
	*   - Update the field total_time in the db on the tables project, task.
	*		- Reset the global variables
	*       - isRunning to false 
	*				- currentSID, currentTaskID and startTime to undefined
	*	@returns{err | undefined}
	*			- return a log descriving the error, or undefined meaning everything is fine.
	*/
export function end() {

	const state = getState();

	if (state === undefined) {
		console.log("󰝥 Not tracking")
		return process.exit(EXIT_SUCCESS);
	}

	const { current_project_sid: currentProjectSID, current_task_id: currentTaskID, timestamp_start: startTime } = state
	let totalTime = Date.now() - startTime;

	const trs = db.transaction(() => {
		const totalTimeProjectDB = getTotaltTimeProjectFromSID(currentProjectSID);
		updateProjectTotalTime(totalTimeProjectDB + totalTime, currentProjectSID)

		const totalTimeTaskDB = getTotaltTimeTaskFromID(currentTaskID);
		updateTaskTotalTime(totalTimeTaskDB + totalTime, currentTaskID);

		deleteStateFromSID(currentProjectSID);
	})

	try {
		trs();
		return process.exit(EXIT_SUCCESS);
	} catch (err) {
		console.error("Database transaction error")
		console.log("Error:", err)
	}
}
