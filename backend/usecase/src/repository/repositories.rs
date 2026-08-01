use crate::repository::base_repository::BaseRepository;
use crate::repository::blog::BlogRepository;
use crate::repository::user::UserRepository;
use crate::repository::trajectory::TrajectoryRepository;

pub trait Repositories: BaseRepository + BlogRepository + UserRepository + TrajectoryRepository {}
