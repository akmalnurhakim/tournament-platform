<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use App\Models\Registration;
use App\Models\Team;
use Illuminate\Http\Request;

class TournamentController extends Controller
{
    // Public: browse tournaments
    public function index()
    {
        return Tournament::with('sportType')
            ->latest()
            ->get();
    }

    // Public: view details
    public function show($id)
    {
        return Tournament::with([
            'sportType',
            'matches.participants'
        ])
        ->findOrFail($id);
    }

    // Auth required: create tournament
    public function store(Request $request)
    {
        $validated = $request->validate([

            'sport_type_id' =>
                'required|exists:sport_types,id',

            'name' =>
                'required|string|max:255',

            'description' =>
                'nullable|string',

            'is_team_based' =>
                'boolean',

            'start_date' =>
                'required|date',

            'end_date' =>
                'required|date|after_or_equal:start_date',

            'status' =>
                'required|in:upcoming,ongoing,completed',

        ]);


        $validated['organizer_id'] =
            auth()->id();


        Tournament::create($validated);


        return redirect('/tournaments');
    }

    public function update(Request $request, Tournament $tournament): \Illuminate\Http\RedirectResponse
    {
        if ($tournament->organizer_id !== $request->user()->id) {
            abort(403);
        }
        if (in_array($tournament->status, ['in_progress', 'completed'])) {
            abort(403, 'Cannot edit a tournament that is already in progress or completed.');
        }

        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:150'],
            'description'   => ['nullable', 'string'],
            'sport_type_id' => ['required', 'integer', 'exists:sport_types,id'],
            'is_team_based' => ['required', 'boolean'],
            'start_date'    => ['required', 'date'],
            'end_date'      => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        $tournament->update($validated);

        return redirect()
            ->route('tournaments.show', $tournament)
            ->with('success', "Tournament \"{$tournament->name}\" updated.");
    }

    // Auth required: delete own tournament
    public function destroy($id)
    {
        $tournament =
            Tournament::findOrFail($id);


        if ($tournament->organizer_id !== auth()->id()) {

            return response()->json([
                'message' => 'Unauthorized'
            ], 403);

        }


        $tournament->delete();


        return response()->json(null, 204);
    }

    public function showPage(Request $request, Tournament $tournament): \Inertia\Response
    {
        $tournament->load(['organizer', 'sportType', 'matches']);
        $user = $request->user();

        $eligibleTeams = collect();
        $myRegistration = null;

        if ($tournament->sportType->is_team_based) {
            $eligibleTeams = Team::where('captain_id', $user->id)
                ->where('sport_type_id', $tournament->sport_type_id)
                ->get(['id', 'name', 'logo']);

            $myRegistration = Registration::where('tournament_id', $tournament->id)
                ->whereIn('team_id', $eligibleTeams->pluck('id'))
                ->first();

            // Exclude already-registered teams from the eligible list
            if ($myRegistration) {
                $eligibleTeams = $eligibleTeams->reject(
                    fn ($team) => $team->id === $myRegistration->team_id
                );
            }
        } else {
            $myRegistration = Registration::where('tournament_id', $tournament->id)
                ->where('user_id', $user->id)
                ->first();
        }

        return inertia('tournaments/showTournament', [
            'tournament' => $tournament,
            'eligibleTeams' => $eligibleTeams->values(),
            'myRegistration' => $myRegistration,
            'isOrganizer' => $tournament->organizer_id === $user->id,
            'nextStatuses' => $tournament->organizer_id === $user->id
                ? $tournament->nextStatuses()
                : [],
            'statusLabels' => Tournament::STATUS_LABELS,
        ]);
    }

    // TournamentController.php
    public function transition(Request $request, Tournament $tournament): \Illuminate\Http\RedirectResponse
    {
        if ($tournament->organizer_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'status' => ['required', 'string'],
        ]);

        $tournament->transitionTo($request->input('status'));

        return redirect()
            ->back()
            ->with('success', "Tournament status updated to \"{$tournament->fresh()->status}\".");
    }

    public function myTournaments(Request $request): \Inertia\Response
    {
        $tournaments = Tournament::with('sportType')
            ->where('organizer_id', $request->user()->id)
            ->latest()
            ->get();

        return inertia('tournaments/myTournaments', [
            'tournaments' => $tournaments,
            'statusLabels' => Tournament::STATUS_LABELS,
        ]);
    }

    public function editPage(Request $request, Tournament $tournament): \Inertia\Response
    {
        if ($tournament->organizer_id !== $request->user()->id) {
            abort(403);
        }
        if (in_array($tournament->status, ['in_progress', 'completed'])) {
            abort(403, 'Cannot edit a tournament that is already in progress or completed.');
        }

        return inertia('tournaments/editTournament', [
            'tournament' => $tournament,
        ]);
    }
}