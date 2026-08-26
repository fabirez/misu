import { DB } from "../data/constants"

//====================
// Add
//====================

export function addProjectInDB(projectSID, totalTime, createdAt) {
	DB.prepare(`INSERT INTO project (sid, total_time, created_at) VALUES (?, ?, ?)`).run(projectSID, totalTime, createdAt);
}

export function addTaskInDB(taskName, totalTime, createdAt) {
	DB.prepare(`INSERT INTO task (task_name, total_time, created_at) VALUES (?, ?, ?)`).run(taskName, totalTime, createdAt);
}

export function addStreamInDB(projectSID, taskID) {
	DB.prepare(`INSERT INTO stream (project_sid,task_id) VALUES (?, ?)`).run(projectSID, taskID);
}

export function addStateInDB(projectSID, taskID, timestampStart) {
	DB.prepare(`INSERT INTO state (current_project_sid, current_task_id, timestamp_start) VALUES (?, ?, ?)`).run(projectSID, taskID, timestampStart);
}


//====================
// Get
//====================

export function getIdFromTaskName(taskName) {
	const { id } = DB.prepare(`SELECT "../data/constants" FROM "task" WHERE "task_name"=?`).get(taskName);
	return id;
}

export function getTaskNameFromID(id) {
	const { task_name } = DB.prepare(`SELECT task_name FROM task WHERE id=?`).get(id);
	return task_name;
}

export function getProjectSIDFromSID(projectSID) {
	return DB.prepare(`SELECT "sid" FROM "project" WHERE sid=?`).get(projectSID);
}

export function getAllTaskFromProjectSID(projectSID) {
	return DB.prepare(`SELECT * FROM task WHERE (SELECT task_id FROM stream WHERE "project_sid"=?)`).all(projectSID)
}
export function getAllTaskFromProjectSIDInStream(projectSID) {
	return DB.prepare(`SELECT * from task WHERE id IN (select task_id FROM stream WHERE project_sid = ?)`).all(projectSID);
}

export function getAllProject() {
	return DB.prepare(`SELECT * FROM project`).all();
}

export function getState() {
	return DB.prepare(`SELECT * FROM state`).get();
}

export function getTotaltTimeProjectFromSID(projectSID) {
	const { total_time } = DB.prepare(`SELECT total_time FROM project WHERE sid = ?`).get(projectSID);
	return total_time;
}

export function getTotaltTimeTaskFromID(taskID) {
	const { total_time } = DB.prepare(`SELECT total_time FROM task WHERE "id" = ?`).get(taskID);
	return total_time;
}


//====================
// Update
//====================

export function updateProjectTotalTime(totalTime, projectSID) {
	DB.prepare(`UPDATE project SET total_time = ? WHERE "sid" = ?`).run(totalTime, projectSID)
}

export function updateTaskTotalTime(totalTime, taskID) {
	DB.prepare(`UPDATE task SET total_time = ? WHERE "id" = ?`).run(totalTime, taskID);
}

//====================
// Delete
//====================

export function deleteStateFromSID(ProjectSID) {
	DB.prepare(`DELETE FROM state WHERE current_project_sid=?`).run(ProjectSID);
}

