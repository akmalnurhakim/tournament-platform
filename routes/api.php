<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TournamentController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\SportTypeController;


/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

// Anyone can browse tournaments
Route::apiResource('tournaments', TournamentController::class)
    ->only(['index', 'show'])
    ->names([
        'index' => 'api.tournaments.index',
        'show' => 'api.tournaments.show',
    ]);


// Anyone can see available sports
Route::apiResource('sport-types', SportTypeController::class)
    ->only(['index', 'show'])
    ->names([
        'index' => 'api.sport-types.index',
        'show' => 'api.sport-types.show',
    ]);



//authenticated routes

Route::middleware('auth')->group(function () {

    //teams
    Route::apiResource('teams', TeamController::class)
    ->except(['store'])
    ->names([
        'index' => 'api.teams.index',
        'show' => 'api.teams.show',
        'update' => 'api.teams.update',
        'destroy' => 'api.teams.destroy',
    ]);
    Route::post('/teams', [TeamController::class, 'storeJson']);

    Route::post('/teams/{team}/join', [TeamController::class, 'join']);

    //registrations
    Route::apiResource('registrations', RegistrationController::class);

});

//dashboard
Route::get('/dashboard-stats', function () {

    return [
        'tournaments' => \App\Models\Tournament::count(),

        'teams' => \App\Models\Team::count(),
    ];

});