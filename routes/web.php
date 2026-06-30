<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\TeamController;
use App\Models\Tournament;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Tournament routes
    Route::inertia('tournaments/create', 'tournaments/createTournament')->name('tournaments.create');
    Route::post('/tournaments', [TournamentController::class, 'store']);
    Route::get('/tournaments/{tournament}', [TournamentController::class, 'showPage'])->name('tournaments.show');
    Route::inertia('tournaments', 'tournaments/browseTournament')->name('tournaments');

    // Team routes
    Route::get('/teams/join/{code}', [TeamController::class, 'joinPreview'])->name('teams.join.preview');
    Route::post('/teams/join/{code}', [TeamController::class, 'joinViaLink'])->name('teams.join.link');
    Route::inertia('teams/join', 'teams/joinTeam')->name('teams.join.form');
    Route::post('/teams/join', [TeamController::class, 'join'])->name('teams.join');
    Route::get('/teams', [TeamController::class, 'indexPage'])->name('teams.index');
    Route::get('/my-teams', [TeamController::class, 'myTeamsPage'])->name('teams.mine');
    Route::inertia('teams/create', 'teams/createTeam')->name('teams.create');
    Route::post('/teams', [TeamController::class, 'store']);
    Route::get('/teams/{team}', [TeamController::class, 'showPage'])->name('teams.show');
    Route::get('/teams/{team}/edit', [TeamController::class, 'editPage'])->name('teams.edit');
    Route::patch('/teams/{team}', [TeamController::class, 'update'])->name('teams.update');

    // Registration routes
    // routes/web.php, inside auth/verified group
    Route::post('/tournaments/{tournament}/registrations', [RegistrationController::class, 'store'])->name('registrations.store');
    Route::patch('/registrations/{registration}/accept', [RegistrationController::class, 'accept'])->name('registrations.accept');
    Route::patch('/registrations/{registration}/reject', [RegistrationController::class, 'reject'])->name('registrations.reject');
    Route::get('/tournaments/{tournament}/registrations', [RegistrationController::class, 'manage'])->name('registrations.manage');
});

require __DIR__.'/settings.php';