<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\TournamentStageController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\GuestRegistrationController;
use App\Models\Tournament;

Route::inertia('/', 'welcome')->name('home');

//allow public tournament view without authentication
Route::get('/tournaments', [TournamentController::class, 'index'])->name('tournaments.index');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Tournament routes
    Route::get('/tournaments/create', [TournamentController::class, 'create'])->name('tournaments.create');
    Route::post('/tournaments', [TournamentController::class, 'store'])->name('tournaments.store');
    Route::get('/tournaments/{tournament}/edit', [TournamentController::class, 'edit'])->name('tournaments.edit');
    Route::put('/tournaments/{tournament}', [TournamentController::class, 'update'])->name('tournaments.update');
    Route::delete('/tournaments/{tournament}', [TournamentController::class, 'destroy'])->name('tournaments.destroy');
    Route::get('/my-tournaments', [TournamentController::class, 'myTournaments'])->name('tournaments.mine');

    // Tournament stages 
    Route::post('/tournaments/{tournament}/stages', [TournamentStageController::class, 'store'])->name('tournaments.stages.store');
    Route::patch('/tournaments/{tournament}/stages/{stage}', [TournamentStageController::class, 'update'])->name('tournaments.stages.update');
    Route::delete('/tournaments/{tournament}/stages/{stage}', [TournamentStageController::class, 'destroy'])->name('tournaments.stages.destroy');

    // Manage dashboard
    Route::get('/tournaments/{tournament}/manage', [TournamentController::class, 'manage'])->name('tournaments.manage');
    Route::patch('/tournaments/{tournament}/status', [TournamentController::class, 'updateStatus'])->name('tournaments.status');

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
    Route::post('/tournaments/{tournament}/registrations', [RegistrationController::class, 'store'])->name('registrations.store');
    Route::patch('/registrations/{registration}/accept', [RegistrationController::class, 'accept'])->name('registrations.accept');
    Route::patch('/registrations/{registration}/reject', [RegistrationController::class, 'reject'])->name('registrations.reject');
    Route::get('/tournaments/{tournament}/registrations', [RegistrationController::class, 'manage'])->name('registrations.manage');
    Route::post('/tournaments/{tournament}/guests', [GuestRegistrationController::class, 'store'])->name('registrations.guest.store');

});

Route::get('/tournaments/{tournament}', [TournamentController::class, 'show'])->name('tournaments.show');

require __DIR__.'/settings.php';