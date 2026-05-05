use anyhow::Error;
use pulldown_cmark::{html, Options, Parser};


pub fn convert(markdown: String) -> Result<String, Error> {

    let options = Options::ENABLE_TABLES
        | Options::ENABLE_FOOTNOTES
        | Options::ENABLE_STRIKETHROUGH
        | Options::ENABLE_TASKLISTS;

    let parser = Parser::new_ext(&markdown, options);
    let mut body = String::new();
    html::push_html(&mut body, parser);

    Ok(body)
}