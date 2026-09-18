use std::collections::BTreeMap;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::Path;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StudyLog {
    pub technology: String,
    pub minutes: u16,
    pub note: String,
}

#[derive(Debug, PartialEq, Eq)]
pub enum Command {
    Add {
        technology: String,
        minutes: u16,
        note: String,
    },
    List,
    Summary,
}

pub fn parse_args(args: &[String]) -> Result<Command, String> {
    match args.first().map(String::as_str) {
        Some("add") => {
            if args.len() < 4 {
                return Err("Usage: study-log add <technology> <minutes> <note...>".into());
            }
            let minutes = args[2]
                .parse::<u16>()
                .map_err(|_| "minutes must be an integer between 1 and 1440".to_string())?;
            let command = Command::Add {
                technology: args[1].clone(),
                minutes,
                note: args[3..].join(" "),
            };
            if let Command::Add {
                technology,
                minutes,
                note,
            } = &command
            {
                validate_field("technology", technology)?;
                validate_field("note", note)?;
                if !(1..=1440).contains(minutes) {
                    return Err("minutes must be an integer between 1 and 1440".into());
                }
            }
            Ok(command)
        }
        Some("list") if args.len() == 1 => Ok(Command::List),
        Some("summary") if args.len() == 1 => Ok(Command::Summary),
        _ => Err("Usage: study-log <add|list|summary>".into()),
    }
}

fn validate_field(name: &str, value: &str) -> Result<(), String> {
    if value.trim().is_empty() || value.contains(['\t', '\n', '\r']) {
        return Err(format!(
            "{name} must be non-empty and cannot contain tabs or newlines"
        ));
    }
    Ok(())
}

impl StudyLog {
    pub fn to_tsv(&self) -> Result<String, String> {
        validate_field("technology", &self.technology)?;
        validate_field("note", &self.note)?;
        if !(1..=1440).contains(&self.minutes) {
            return Err("minutes must be between 1 and 1440".into());
        }
        Ok(format!(
            "{}\t{}\t{}",
            self.technology, self.minutes, self.note
        ))
    }

    pub fn from_tsv(line: &str) -> Result<Self, String> {
        let fields: Vec<&str> = line.splitn(3, '\t').collect();
        if fields.len() != 3 {
            return Err(format!("invalid TSV row: {line}"));
        }
        let minutes = fields[1]
            .parse::<u16>()
            .map_err(|_| format!("invalid minutes in row: {line}"))?;
        let log = Self {
            technology: fields[0].to_string(),
            minutes,
            note: fields[2].to_string(),
        };
        log.to_tsv()?;
        Ok(log)
    }
}

pub fn append_log(path: &Path, log: &StudyLog) -> Result<(), String> {
    let line = log.to_tsv()?;
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(path)
        .map_err(|error| format!("cannot open {}: {error}", path.display()))?;
    writeln!(file, "{line}").map_err(|error| format!("cannot write {}: {error}", path.display()))
}

pub fn read_logs(path: &Path) -> Result<Vec<StudyLog>, String> {
    let text = match fs::read_to_string(path) {
        Ok(text) => text,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(Vec::new()),
        Err(error) => return Err(format!("cannot read {}: {error}", path.display())),
    };
    text.lines()
        .enumerate()
        .filter(|(_, line)| !line.trim().is_empty())
        .map(|(index, line)| {
            StudyLog::from_tsv(line).map_err(|error| format!("line {}: {error}", index + 1))
        })
        .collect()
}

pub fn summarize(logs: &[StudyLog]) -> BTreeMap<String, u32> {
    let mut totals = BTreeMap::new();
    for log in logs {
        *totals.entry(log.technology.clone()).or_insert(0) += u32::from(log.minutes);
    }
    totals
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::time::{SystemTime, UNIX_EPOCH};

    #[test]
    fn parses_add_command() {
        let args = vec!["add", "rust", "45", "ownership"]
            .into_iter()
            .map(str::to_string)
            .collect::<Vec<_>>();
        assert_eq!(
            parse_args(&args),
            Ok(Command::Add {
                technology: "rust".into(),
                minutes: 45,
                note: "ownership".into()
            })
        );
    }

    #[test]
    fn rejects_invalid_minutes() {
        let args = ["add", "rust", "0", "note"].map(str::to_string);
        assert!(parse_args(&args).is_err());
    }

    #[test]
    fn round_trips_tsv() {
        let log = StudyLog {
            technology: "Rust".into(),
            minutes: 60,
            note: "Resultを試した".into(),
        };
        assert_eq!(StudyLog::from_tsv(&log.to_tsv().unwrap()), Ok(log));
    }

    #[test]
    fn aggregates_by_technology() {
        let logs = vec![
            StudyLog {
                technology: "Rust".into(),
                minutes: 30,
                note: "a".into(),
            },
            StudyLog {
                technology: "Rust".into(),
                minutes: 45,
                note: "b".into(),
            },
            StudyLog {
                technology: "Deno".into(),
                minutes: 20,
                note: "c".into(),
            },
        ];
        assert_eq!(summarize(&logs).get("Rust"), Some(&75));
    }

    #[test]
    fn writes_and_reads_a_file() {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let path =
            std::env::temp_dir().join(format!("study-log-{}-{nonce}.tsv", std::process::id()));
        let log = StudyLog {
            technology: "Rust".into(),
            minutes: 10,
            note: "test".into(),
        };
        append_log(&path, &log).unwrap();
        assert_eq!(read_logs(&path).unwrap(), vec![log]);
        fs::remove_file(path).unwrap();
    }
}
