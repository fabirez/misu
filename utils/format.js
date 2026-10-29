/**
 * Format the given timestamp to a readable human format
 * and return the time passed between the started timer
 * @param {int} timestamp
 * @returns {string} 
 *	the time in the following format hh:mm:ss
 */
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

/**
 * Format the given timestamp to a readable human format
 * adding [h]our, [m]inutes, and [s]econds only if they are present 
 * in the timer, seconds are the only part that exist also if it's zero.
 * @param {int} timestamp
 * @returns {string} 
 *	the time in the following format 01h:20m:30s
 *																	 20m:30s
 *																	 30s
 */
export function formatTime(timestamp) {
	const hours = Math.floor(timestamp / 3600000);
	const minutes = Math.floor(timestamp / 60000) % 60;
	const seconds = Math.floor(timestamp / 1000) % 60;

	return hours   ? `${String(hours).padStart(2, '0')}h${String(minutes).padStart(2, '0')}m${String(seconds).padStart(2, '0')}s`
				 :
				 minutes ? `${String(minutes).padStart(2, '0')}m${String(seconds).padStart(2, '0')}s`
				 : 
			   `${String(seconds).padStart(2, '0')}s`;
}

/**
 * Format the given timestamp to a readable human format
 * @param {int} timestamp
 * @returns {string} 
 *	the date in the following format dd:mm:yy
 */
export function formatDate(timestamp) {
	const date = new Date(timestamp);
	const yy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	return `${dd}-${mm}-${yy}`;
}
