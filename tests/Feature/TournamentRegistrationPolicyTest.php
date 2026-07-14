<?php

use App\Models\Participant;
use App\Models\Registration;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\Tournament;
use App\Models\User;

it('allows registration when tournament is open and user is not yet registered', function () {
    $tournament = Tournament::factory()->open()->create();
    $user = User::factory()->create();

    expect($user->can('register', $tournament))->toBeTrue();
});

it('blocks registration when tournament is not open', function () {
    $tournament = Tournament::factory()->create(['status' => 'draft']);
    $user = User::factory()->create();

    expect($user->can('register', $tournament))->toBeFalse();
});

it('blocks registration when the user already has a registration as an individual', function () {
    $tournament = Tournament::factory()->open()->create();
    $user = User::factory()->create();

    $participant = Participant::factory()->create(['user_id' => $user->id]);
    Registration::factory()->create([
        'tournament_id' => $tournament->id,
        'participant_id' => $participant->id,
    ]);

    expect($user->can('register', $tournament))->toBeFalse();
});

it('blocks registration when the user is on an already-registered team', function () {
    $tournament = Tournament::factory()->open()->create();
    $captain = User::factory()->create();
    $team = Team::factory()->create();
    TeamMember::factory()->captain()->create([
        'team_id' => $team->id,
        'user_id' => $captain->id,
    ]);

    $participant = Participant::factory()->forTeam()->create(['team_id' => $team->id]);
    Registration::factory()->create([
        'tournament_id' => $tournament->id,
        'participant_id' => $participant->id,
    ]);

    expect($captain->can('register', $tournament))->toBeFalse();
});

it('allows the organizer to add a guest', function () {
    $organizer = User::factory()->create();
    $tournament = Tournament::factory()->create(['organizer_id' => $organizer->id]);

    expect($organizer->can('addGuest', $tournament))->toBeTrue();
});

it('blocks a non-organizer from adding a guest', function () {
    $tournament = Tournament::factory()->create();
    $outsider = User::factory()->create();

    expect($outsider->can('addGuest', $tournament))->toBeFalse();
});