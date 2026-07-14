<?php

use App\Models\Tournament;
use App\Models\TournamentCommittee;
use App\Models\User;

// view()

it('allows anyone to view a public tournament', function () {
    $tournament = Tournament::factory()->create(['visibility' => 'public']);
    $outsider = User::factory()->create();

    expect($outsider->can('view', $tournament))->toBeTrue();
});

it('allows the organizer to view a private tournament', function () {
    $organizer = User::factory()->create();
    $tournament = Tournament::factory()->create([
        'visibility' => 'private',
        'organizer_id' => $organizer->id,
    ]);

    expect($organizer->can('view', $tournament))->toBeTrue();
});

it('allows a committee member to view a private tournament', function () {
    $tournament = Tournament::factory()->create(['visibility' => 'private']);
    $committeeMember = User::factory()->create();
    TournamentCommittee::factory()->create([
        'tournament_id' => $tournament->id,
        'user_id' => $committeeMember->id,
    ]);

    expect($committeeMember->can('view', $tournament))->toBeTrue();
});

it('blocks an outsider from viewing a private tournament', function () {
    $tournament = Tournament::factory()->create(['visibility' => 'private']);
    $outsider = User::factory()->create();

    expect($outsider->can('view', $tournament))->toBeFalse();
});

// update()

it('allows the organizer to update the tournament', function () {
    $organizer = User::factory()->create();
    $tournament = Tournament::factory()->create(['organizer_id' => $organizer->id]);

    expect($organizer->can('update', $tournament))->toBeTrue();
});

it('blocks a non-organizer from updating the tournament', function () {
    $tournament = Tournament::factory()->create();
    $outsider = User::factory()->create();

    expect($outsider->can('update', $tournament))->toBeFalse();
});

// delete()

it('allows the organizer to delete a draft tournament', function () {
    $organizer = User::factory()->create();
    $tournament = Tournament::factory()->create([
        'organizer_id' => $organizer->id,
        'status' => 'draft',
    ]);

    expect($organizer->can('delete', $tournament))->toBeTrue();
});

it('blocks the organizer from deleting a live tournament', function () {
    $organizer = User::factory()->create();
    $tournament = Tournament::factory()->create([
        'organizer_id' => $organizer->id,
        'status' => 'open',
    ]);

    expect($organizer->can('delete', $tournament))->toBeFalse();
});

it('blocks a non-organizer from deleting a draft tournament', function () {
    $tournament = Tournament::factory()->create(['status' => 'draft']);
    $outsider = User::factory()->create();

    expect($outsider->can('delete', $tournament))->toBeFalse();
});