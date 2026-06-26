<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        return Team::with('players')->get();
    }

    public function show($id)
    {
        return Team::with('players')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $team = Team::create($request->all());
        return response()->json($team, 201);
    }

    public function update(Request $request, $id)
    {
        $team = Team::findOrFail($id);
        $team->update($request->all());
        return response()->json($team, 200);
    }

    public function destroy($id)
    {
        Team::destroy($id);
        return response()->json(null, 204);
    }
}
