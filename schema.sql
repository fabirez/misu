CREATE TABLE project (
	"sid" TEXT,
	"total_time" INTEGER,
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
	"total_time" INTEGER,
	"created_at" INTEGER NOT NULL,

	PRIMARY KEY("id")
);
