use anyhow::Error;
use pulldown_cmark::{Options, Parser, html};

pub fn convert(markdown: &str) -> Result<String, Error> {
    let options = Options::ENABLE_TABLES
        | Options::ENABLE_FOOTNOTES
        | Options::ENABLE_STRIKETHROUGH
        | Options::ENABLE_TASKLISTS;

    let parser = Parser::new_ext(markdown, options);
    let mut body = String::new();
    html::push_html(&mut body, parser);

    Ok(body)
}
