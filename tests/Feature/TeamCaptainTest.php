<?php

use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;

it('returns the captain when one exists', function () {
    $team = Team::factory()->create();
    $captainMember = TeamMember::factory()->captain()->create([
        'team_id' => $team->id,
    ]);

    expect($team->captain()->first()->id)->toBe($captainMember->id);
});

it('returns null when no captain exists', function () {
    $team = Team::factory()->create();
    TeamMember::factory()->create([
        'team_id' => $team->id,
        'role' => 'Player',
    ]);

    expect($team->captain()->first())->toBeNull();
});

it('confirms isCaptain is true for the actual captain', function () {
    $team = Team::factory()->create();
    $captainUser = User::factory()->create();
    TeamMember::factory()->captain()->create([
        'team_id' => $team->id,
        'user_id' => $captainUser->id,
    ]);

    expect($team->isCaptain($captainUser))->toBeTrue();
});

it('confirms isCaptain is false for a regular member', function () {
    $team = Team::factory()->create();
    $regularUser = User::factory()->create();
    TeamMember::factory()->create([
        'team_id' => $team->id,
        'user_id' => $regularUser->id,
        'role' => 'Player',
    ]);

    expect($team->isCaptain($regularUser))->toBeFalse();
});

it('confirms isCaptain is false for a non-member entirely', function () {
    $team = Team::factory()->create();
    $outsider = User::factory()->create();

    expect($team->isCaptain($outsider))->toBeFalse();
});