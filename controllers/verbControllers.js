import {
	addProjectInDB,
	addTaskInDB,
	addStreamInDB,
	addStateInDB,
	getIdFromTaskName,
	getProjectSIDFromSID,
	getAllTaskFromProjectSID,
	getTotaltTimeProjectFromSID,
	getTotaltTimeTaskFromID,
	updateProjectTotalTime,
	updateTaskTotalTime,
	deleteStateFromSID
} from "../utils/db.js"

export function start(projectSID, taskName) {
	// If the projectSID doesn't exist in the database then create a new project in the db with a
	// one to many relationship with task.
	if (getProjectSIDFromSID(projectSID) === undefined) {
		const trs = db.transaction(() => {
			addProjectInDB(projectSID, 0, Date.now());
			addTaskInDB(taskName, 0, Date.now());
			const id = getIdFromTaskName(taskName);
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
				console.log("Database transaction successfull")
			} catch (err) {
				console.error("Database transaction error")
				console.log("Error:", err)
			}
		} else {
			// If there is no task, then add the task, update the stream and the state.
			const trs = db.transaction(() => {
				addTaskInDB(taskName, 0, Date.now())
				const id = getIdFromTaskName(taskName)
				addStreamInDB(projectSID, id)
				addStateInDB(projectSID, id, Date.now())
			})
			try {
				trs();
			} catch (err) {
				console.error("Database transaction error")
				console.log("Error:", err)
				return process.exit(BAD_INPUT)
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

	const state = getState();

	if (state === undefined) {
		console.log("󰝥 Not tracking")
		return process.exit(BAD_INPUT);
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
		return process.exit(BAD_INPUT);
	} catch (err) {
		console.error("Database transaction error")
		console.log("Error:", err)
	}
}
