CREATE TABLE IF NOT EXISTS study_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    technology TEXT NOT NULL,
    minutes INTEGER NOT NULL CHECK (minutes BETWEEN 1 AND 1440),
    note TEXT NOT NULL DEFAULT '',
    learned_on TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_study_logs_learned_on
ON study_logs (learned_on DESC, id DESC);
