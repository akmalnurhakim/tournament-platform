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

    // Auth required: update own tournament
    public function update(Request $request, $id)
    {
        $tournament =
            Tournament::findOrFail($id);


        // prevent editing others tournament
        if ($tournament->organizer_id !== auth()->id()) {

            return response()->json([
                'message' => 'Unauthorized'
            ], 403);

        }


        $validated = $request->validate([

            'sport_type_id' =>
                'exists:sport_types,id',

            'name' =>
                'string|max:255',

            'description' =>
                'nullable|string',

            'is_team_based' =>
                'boolean',

            'start_date' =>
                'date',

            'end_date' =>
                'date',

            'status' =>
                'in:upcoming,ongoing,completed',
        ]);



        $tournament->update($validated);


        return response()->json($tournament);
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
        ]);
    }
}