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

/// The same for an optional id: `Some(id)` is a string, `None` is `null`.
pub mod option {
    use serde::{Deserialize, Deserializer, Serializer, de};

    pub fn serialize<S: Serializer>(id: &Option<i64>, serializer: S) -> Result<S::Ok, S::Error> {
        match id {
            Some(id) => serializer.serialize_str(&id.to_string()),
            None => serializer.serialize_none(),
        }
    }

    pub fn deserialize<'de, D: Deserializer<'de>>(
        deserializer: D,
    ) -> Result<Option<i64>, D::Error> {
        Option::<String>::deserialize(deserializer)?
            .map(|id| id.parse().map_err(de::Error::custom))
            .transpose()
    }
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

    #[derive(Serialize, Deserialize, PartialEq, Debug)]
    struct OptionalWrapper {
        #[serde(with = "super::option")]
        id: Option<i64>,
    }

    #[test]
    fn round_trips_an_optional_id() {
        let some = OptionalWrapper {
            id: Some(1225751893445050369),
        };
        let json = serde_json::to_string(&some).unwrap();
        assert_eq!(json, r#"{"id":"1225751893445050369"}"#);
        assert_eq!(
            serde_json::from_str::<OptionalWrapper>(&json).unwrap(),
            some
        );

        let none = OptionalWrapper { id: None };
        let json = serde_json::to_string(&none).unwrap();
        assert_eq!(json, r#"{"id":null}"#);
        assert_eq!(
            serde_json::from_str::<OptionalWrapper>(&json).unwrap(),
            none
        );
    }

    #[test]
    fn rejects_an_optional_id_that_is_not_a_number() {
        assert!(serde_json::from_str::<OptionalWrapper>(r#"{"id":"abc"}"#).is_err());
    }
}
