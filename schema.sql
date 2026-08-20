CREATE TABLE state (
	"current_project_sid" TEXT NOT NULL,
	"current_task_id" TEXT NOT NULL,
	"timestamp_start" INTEGER NOT NULL,

	FOREIGN KEY("current_project_sid") REFERENCES "project"("sid"),
	FOREIGN KEY("current_task_id") REFERENCES "task"("id")
);

CREATE TABLE project (
	"sid" TEXT,
	"total_time" INTEGER DEFAULT 0,
  "created_at" INTEGER NOT NULL,

	PRIMARY KEY("sid")
);

CREATE TABLE stream (
	"project_sid" TEXT,
	"task_id" INTEGER,

	FOREIGN KEY("project_sid") REFERENCES "project"("sid"),
	FOREIGN KEY("task_id") REFERENCES "task"("id")
);

create TABLE task (
	"id" INTEGER,
	"task_name" TEXT NOT NULL UNIQUE,
	"total_time" INTEGER DEFAULT 0,
	"created_at" INTEGER NOT NULL,

	PRIMARY KEY("id")
);
