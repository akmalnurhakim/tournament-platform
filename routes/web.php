<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TournamentController;
use App\Models\Tournament;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('tournaments', 'tournaments/browseTournament')->name('tournaments');
    Route::inertia('tournaments/create', 'tournaments/createTournament')->name('tournaments.create');
    Route::post(
        '/tournaments',
        [TournamentController::class, 'store']
    );
});


Route::get(
    '/tournaments/{tournament}',
    function(Tournament $tournament)
    {

        return inertia(
            'tournaments/showTournament',
            [
                'tournament' =>
                    $tournament->load([
                        'organizer',
                        'sportType',
                        'matches'
                    ])
            ]
        );

    }
);

require __DIR__.'/settings.php';
