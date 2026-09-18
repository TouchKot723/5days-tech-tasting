use std::path::Path;
use study_log::{Command, StudyLog, append_log, parse_args, read_logs, summarize};

fn run() -> Result<(), String> {
    let args = std::env::args().skip(1).collect::<Vec<_>>();
    let path = Path::new("study-log.tsv");
    match parse_args(&args)? {
        Command::Add {
            technology,
            minutes,
            note,
        } => {
            append_log(
                path,
                &StudyLog {
                    technology,
                    minutes,
                    note,
                },
            )?;
            println!("記録を追加しました。");
        }
        Command::List => {
            for (index, log) in read_logs(path)?.iter().enumerate() {
                println!(
                    "{}. {}: {}分 - {}",
                    index + 1,
                    log.technology,
                    log.minutes,
                    log.note
                );
            }
        }
        Command::Summary => {
            for (technology, minutes) in summarize(&read_logs(path)?) {
                println!("{technology}: {minutes}分");
            }
        }
    }
    Ok(())
}

fn main() {
    if let Err(error) = run() {
        eprintln!("error: {error}");
        std::process::exit(1);
    }
}
