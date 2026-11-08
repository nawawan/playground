//! Serialize `i64` ids as JSON strings.
//!
//! Ids are ~1e18, beyond JavaScript's safe integer range (2^53 - 1), so a JSON
//! number would be silently rounded by `JSON.parse` and no longer match the row.

use serde::{Deserialize, Deserializer, Serializer, de};

pub fn serialize<S: Serializer>(id: &i64, serializer: S) -> Result<S::Ok, S::Error> {
    serializer.serialize_str(&id.to_string())
}

pub fn deserialize<'de, D: Deserializer<'de>>(deserializer: D) -> Result<i64, D::Error> {
    String::deserialize(deserializer)?
        .parse()
        .map_err(de::Error::custom)
}

#[cfg(test)]
mod tests {
    use serde::{Deserialize, Serialize};

    #[derive(Serialize, Deserialize, PartialEq, Debug)]
    struct Wrapper {
        #[serde(with = "super")]
        id: i64,
    }

    #[test]
    fn round_trips_ids_beyond_js_safe_integer() {
        let w = Wrapper {
            id: 1225751893445050369,
        };
        let json = serde_json::to_string(&w).unwrap();
        assert_eq!(json, r#"{"id":"1225751893445050369"}"#);
        assert_eq!(serde_json::from_str::<Wrapper>(&json).unwrap(), w);
    }
}
