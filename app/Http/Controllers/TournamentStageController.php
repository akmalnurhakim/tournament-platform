<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTournamentStageRequest;
use App\Http\Requests\UpdateTournamentStageRequest;
use App\Models\Tournament;
use App\Models\TournamentStage;

class TournamentStageController extends Controller
{
    public function store(StoreTournamentStageRequest $request, Tournament $tournament): \Illuminate\Http\RedirectResponse
    {
        $tournament->stages()->create($request->validated());

        return redirect()
            ->route('tournaments.show', $tournament)
            ->with('success', 'Stage added.');
    }

    public function update(UpdateTournamentStageRequest $request, Tournament $tournament, TournamentStage $stage): \Illuminate\Http\RedirectResponse
    {
        $stage->update($request->validated());

        return redirect()
            ->route('tournaments.show', $tournament)
            ->with('success', 'Stage updated.');
    }

    public function destroy(Tournament $tournament, TournamentStage $stage): \Illuminate\Http\RedirectResponse
    {
        $this->authorize('delete', $stage);

        $stage->delete();

        return redirect()
            ->route('tournaments.show', $tournament)
            ->with('success', 'Stage removed.');
    }
}