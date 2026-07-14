<?php

use App\Models\GameMatch;
use App\Models\Tournament;
use App\Models\TournamentStage;
use App\Models\User;

it('allows the organizer to update a stage with no matches generated', function () {
    $organizer = User::factory()->create();
    $tournament = Tournament::factory()->create(['organizer_id' => $organizer->id]);
    $stage = TournamentStage::factory()->create(['tournament_id' => $tournament->id]);

    expect($organizer->can('update', $stage))->toBeTrue();
});

it('blocks the organizer from updating a stage once matches exist', function () {
    $organizer = User::factory()->create();
    $tournament = Tournament::factory()->create(['organizer_id' => $organizer->id]);
    $stage = TournamentStage::factory()->create(['tournament_id' => $tournament->id]);
    GameMatch::factory()->create(['stage_id' => $stage->id]);

    expect($organizer->can('update', $stage))->toBeFalse();
});

it('blocks a non-organizer from updating a stage', function () {
    $tournament = Tournament::factory()->create();
    $stage = TournamentStage::factory()->create(['tournament_id' => $tournament->id]);
    $outsider = User::factory()->create();

    expect($outsider->can('update', $stage))->toBeFalse();
});

it('allows the organizer to delete a stage with no matches generated', function () {
    $organizer = User::factory()->create();
    $tournament = Tournament::factory()->create(['organizer_id' => $organizer->id]);
    $stage = TournamentStage::factory()->create(['tournament_id' => $tournament->id]);

    expect($organizer->can('delete', $stage))->toBeTrue();
});

it('blocks the organizer from deleting a stage once matches exist', function () {
    $organizer = User::factory()->create();
    $tournament = Tournament::factory()->create(['organizer_id' => $organizer->id]);
    $stage = TournamentStage::factory()->create(['tournament_id' => $tournament->id]);
    GameMatch::factory()->create(['stage_id' => $stage->id]);

    expect($organizer->can('delete', $stage))->toBeFalse();
});