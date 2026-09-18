fn length(text: &str) -> usize {
    text.len()
}

fn main() {
    let topic = String::from("ownership");
    println!("{}文字: {topic}", length(&topic));
    println!("TODO: add、list、summaryを実装する");
}

