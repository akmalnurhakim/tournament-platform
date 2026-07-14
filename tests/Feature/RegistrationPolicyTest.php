<?php

use App\Models\Registration;
use App\Models\Tournament;
use App\Models\User;

it('allows the tournament organizer to review a registration', function () {
    $organizer = User::factory()->create();
    $tournament = Tournament::factory()->create(['organizer_id' => $organizer->id]);
    $registration = Registration::factory()->create(['tournament_id' => $tournament->id]);

    expect($organizer->can('review', $registration))->toBeTrue();
});

it('blocks a non-organizer from reviewing a registration', function () {
    $tournament = Tournament::factory()->create();
    $registration = Registration::factory()->create(['tournament_id' => $tournament->id]);
    $outsider = User::factory()->create();

    expect($outsider->can('review', $registration))->toBeFalse();
});