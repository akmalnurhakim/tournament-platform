<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TournamentController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\PlayerController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\SportTypeController;


/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/

// Anyone can browse tournaments
Route::apiResource('tournaments', TournamentController::class)
    ->only([
        'index',
        'show'
    ]);


// Anyone can see available sports
Route::apiResource('sport-types', SportTypeController::class)
    ->only([
        'index',
        'show'
    ]);



//authenticated routes

Route::middleware('auth')->group(function () {

    //matches
    Route::apiResource('matches', MatchController::class);

    //teams
    // 'store' is excluded here and wired manually below to storeJson,
    // since TeamController::store() now returns an Inertia redirect for
    // the web form in routes/web.php — apiResource always calls store()
    // by convention, so a JSON-returning method needs its own name and
    // its own explicit route.
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

    //players
    Route::apiResource('players', PlayerController::class);

    //registrations
    Route::apiResource('registrations', RegistrationController::class);

});

//dashboard
Route::get('/dashboard-stats', function () {

    return [
        'tournaments' => \App\Models\Tournament::count(),

        'teams' => \App\Models\Team::count(),

        'players' => \App\Models\Player::count(),

        'matches' => \App\Models\Matches::where(
            'status',
            'upcoming'
        )->count(),
    ];

});