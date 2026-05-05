use std::fmt;

use chrono::{Months, NaiveDateTime};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum BlogStatus {
    Draft,
    Published,
}

impl fmt::Display for BlogStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            BlogStatus::Draft => write!(f, "DRAFT"),
            BlogStatus::Published => write!(f, "PUBLISHED"),
        }
    }
}

impl From<String> for BlogStatus {
    fn from(status: String) -> Self {
        match status.as_str() {
            "DRAFT" => BlogStatus::Draft,
            "PUBLISHED" => BlogStatus::Published,
            _ => panic!("Unknown blog status: {}", status),
        }
    }
}

#[derive(Debug, Clone, sqlx::FromRow)]
pub struct Blog {
    pub id: Uuid,
    pub title: String,
    pub content_key: String,
    #[sqlx(try_from = "String")]
    pub status: BlogStatus,
}

#[derive(Debug, Clone)]
pub struct BlogRequest {
    pub id: Option<String>,
    pub title: String,
    pub content: String,
}

pub struct BlogFilter {
    pub limit: Option<i32>,
    pub offset: Option<i32>,
    pub order_by: Option<String>,
    pub order_desc: Option<bool>,
    pub start: Option<NaiveDateTime>,
    pub end: Option<NaiveDateTime>,
}

impl BlogFilter {
    pub fn new(year: Option<&String>, month: Option<&String>) -> Self {
        let (start, end) = converter_string_to_datetime(year, month);
        Self {
            start,
            end,
            order_by: None,
            limit: None,
            offset: None,
            order_desc: None,
        }
    }

    pub fn apply(&self, query: &mut sqlx::QueryBuilder<sqlx::Postgres>) {
        if let Some(start) = self.start {
            query.push(" AND created_at >= ").push_bind(start);
        }
        if let Some(end) = self.end {
            query.push(" AND created_at <= ").push_bind(end);
        }
        if let Some(order_by) = &self.order_by {
            query.push(" ORDER BY ").push(order_by);
            if self.order_desc == Some(true) {
                query.push(" DESC");
            } else {
                query.push(" ASC");
            }
        }

        if let Some(limit) = self.limit {
            query.push(" LIMIT ").push_bind(limit);
        }
        if let Some(offset) = self.offset {
            query.push(" OFFSET ").push_bind(offset);
        }
    }
}

fn converter_string_to_datetime(
    year: Option<&String>,
    month: Option<&String>,
) -> (Option<NaiveDateTime>, Option<NaiveDateTime>) {
    if year.is_none() {
        return (None, None);
    }

    let y = year.unwrap().parse::<i32>().unwrap();
    let start = NaiveDateTime::new(
        chrono::NaiveDate::from_ymd_opt(y, 1, 1).unwrap(),
        chrono::NaiveTime::from_hms_opt(0, 0, 0).unwrap(),
    );

    if let Some(m) = month {
        let month_num = m.parse::<u32>().unwrap();
        return (
            start.checked_add_months(Months::new(month_num - 1)),
            start.checked_add_months(Months::new(month_num)),
        );
    }

    (Some(start), start.checked_add_months(Months::new(12)))
}
