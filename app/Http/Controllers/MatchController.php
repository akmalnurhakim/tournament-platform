<?php

namespace App\Http\Controllers;

use App\Models\Matches;
use App\Models\MatchParticipant;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index()
    {
        return Matches::with('participants')->get();
    }

    public function show($id)
    {
        return Matches::with('participants')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $match = Matches::create($request->all());
        return response()->json($match, 201);
    }

    public function addParticipant(Request $request, $matchId)
    {
        $participant = MatchParticipant::create([
            'match_id' => $matchId,
            'team_id' => $request->team_id,
            'player_id' => $request->player_id,
        ]);
        return response()->json($participant, 201);
    }

    public function update(Request $request, $id)
    {
        $match = Matches::findOrFail($id);
        $match->update($request->all());
        return response()->json($match, 200);
    }

    public function destroy($id)
    {
        Matches::destroy($id);
        return response()->json(null, 204);
    }
}
