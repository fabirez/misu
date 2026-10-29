import { FLAGS, EXIT_SUCCESS, MISU_VERSION, VERBS } from "../utils/constants.js";
import { getAllProject, getAllTaskFromProjectSIDInStream, getState, getTaskNameFromID } from "../utils/db.js";
import { formatDate, formatTime, formatTimer } from "../utils/format.js";

/** 
	*  Produce the status of the application based on the
	*  state table in the database.
	*  The output,
	*		if not specified, is just plain text rapresent as "cli"
	*		otherwise use the specified ones.
	*		ASSUME: arg is a valid value "json" or "cli" 
	*
	*  @param {"json" | "cli" | ""} arg
	*
	*  @examples
	*  ```js
	*   statusFlag("")     cli formant and 0 code exit
	*   statusFlag("json") json formant and 0 code exit
	*   statusFlag("cli")  cli formant and 0 code exit
	*  ```
	*
	*  @returns {}
	*  
	*/
export function statusFlag(arg) {
	const state = getState();
	if (state) {
		const { current_project_sid: currentProjectSID, current_task_id: currentTaskID, timestamp_start: startTime } = state;
		const taskName = getTaskNameFromID(currentTaskID);

		if (arg === "json") {
			let timer = formatTimer(startTime);
			console.log(JSON.stringify({
				isRunning: true,
				projectSID: currentProjectSID,
				taskName: taskName,
				timer
			}))
			return process.exit(EXIT_SUCCESS);
		} else {
			let time = formatTime(Date.now() - startTime);
			console.log(`󰝥 Tracking on ${currentProjectSID}, ${taskName} for ${time}`);
			return process.exit(EXIT_SUCCESS);
		}
	} else {
		if (arg === "json") {
			console.log(JSON.stringify({ isRunning: false }))
			return process.exit(EXIT_SUCCESS);
		} else {
			console.log("󰝥 Not tracking");
			return process.exit(EXIT_SUCCESS);
		}
	}
}


/** 
	* produce the statas of the projects and tasks by the user.
	*		
	*/
export function statsFlag() {
	const allProjects = getAllProject();
	if (Array.isArray(allProjects) && allProjects.length > 0) {
		for (const project of allProjects) {
			const { sid, total_time: totalTimeProject, created_at: createdAtProject } = project;
			console.log(sid)
			const tasks = getAllTaskFromProjectSIDInStream(sid)
			console.log(" ", tasks?.length + "   ", formatTime(totalTimeProject), formatDate(createdAtProject))
			for (const task of tasks) {
				const { id, task_name: taskName, total_time: totalTimeTask, created_at: createdAtTask } = task;
				console.log(" 󰨓", taskName)
				console.log("   ", formatTime(totalTimeTask), formatDate(createdAtTask))
			}
		}
		return process.exit(EXIT_SUCCESS);
	} else {
		console.log("There are still no project tracker.")
		console.log("")
		console.log("For tracking a new project:")
		console.log("󰨓 misu start <projectSID> <taskSID>")
		console.log("")
		console.log("For listing all the commands available:")
		console.log("󰨓 misu --help")
		return process.exit(EXIT_SUCCESS);
	}
}


export function helpFlag(arg) {
	// Check if the given value, is valid and exist for the 
	// the help flag
	const isValidArg = FLAGS.help.values.includes(arg)

	if (isValidArg) {
		console.log(VERBS[arg].description)
	} else {
		// Default help message
		console.log("Misu. A command line tool for tracking time.")
		console.log("")

		console.log("Usage:")
		console.log(" misu <verb> [<projectSID> <taskSID>]")
		console.log(" misu <flag> [<value>]")

		console.log("")
		console.log("Verbs:")
		for (const [key, value] of Object.entries(VERBS)) {
			console.log(` ${key}\n   ${value.shortDescription}`)
		}
		console.log("")
		console.log("Flags:")
		for (const [key, value] of Object.entries(FLAGS)) {
			console.log(` --${key}${value.short ? `, -${value.short}` : "    "} \n   ${value.description}`)
		}
	}

	return process.exit(EXIT_SUCCESS);
}

export function versionFlag() {
	console.log(MISU_VERSION)
	return process.exit(EXIT_SUCCESS);
}
