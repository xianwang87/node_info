var TASK_STATUS = {
	NOT_STARTED: {
		value: 0,
		text: "Not Started"
	},
	FINISHED: {
		value: 1,
		text: "Finished"
	},
	IN_PROGRESS: {
		value: 2,
		text: "In Progress"
	},
	BLOCKED: {
		value: 3,
		text: "Blocked"
	}
};

var TASK_PRIORITY = {
	COMMON: {
		value: 0,
		text: "Common"
	},
	IMPORTANT: {
		value: 1,
		text: "Important"
	},
	URGENCY: {
		value: 2,
		text: "Urgency"
	},
	URGENCY_IMPORTANT: {
		value: 3,
		text: "Urgency & Important"
	}
};


exports.TASK_ENUM = {
	TASK_STATUS: TASK_STATUS,
	TASK_PRIORITY: TASK_PRIORITY
};