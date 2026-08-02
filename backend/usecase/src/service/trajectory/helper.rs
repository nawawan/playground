use crate::model::trajectory::RawTrajectory;
use super::geo::douglas_peucker_simplify;

fn thin_out_raw_trajectory_by_lod(trajectory: &RawTrajectory, lod: usize) -> RawTrajectory {
    let epsiron = match lod {
        1 => 500.0,
        2 => 100.0,
        3 => 20.0,
        _ => 1.0,
    };

    let picked_up_indices = douglas_peucker_simplify(&trajectory.coordinates, epsiron);
    let cap = picked_up_indices.len();
    
    let mut thinned_coordinates = Vec::with_capacity(cap);
    let mut thinned_elevations = Vec::with_capacity(cap);
    let mut thinned_heart_rates = Vec::with_capacity(cap);
    let mut thinned_recorded_ats = Vec::with_capacity(cap);

    picked_up_indices.iter().for_each(|&idx| {
        thinned_coordinates.push(trajectory.coordinates[idx].clone());
        thinned_elevations.push(trajectory.elevations[idx]);
        thinned_heart_rates.push(trajectory.heart_rates[idx]);
        thinned_recorded_ats.push(trajectory.recorded_ats[idx]);
    });

    RawTrajectory {
        name: trajectory.name.clone(),
        trajectory_type: trajectory.trajectory_type.clone(),
        coordinates: thinned_coordinates,
        elevations: thinned_elevations,
        heart_rates: thinned_heart_rates,
        recorded_ats: thinned_recorded_ats,
        started_at: trajectory.started_at,
    }
}