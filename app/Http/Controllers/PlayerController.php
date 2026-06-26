<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index()
    {
        return Player::with('team')->get();
    }

    public function show($id)
    {
        return Player::with('team')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $player = Player::create($request->all());
        return response()->json($player, 201);
    }

    public function update(Request $request, $id)
    {
        $player = Player::findOrFail($id);
        $player->update($request->all());
        return response()->json($player, 200);
    }

    public function destroy($id)
    {
        Player::destroy($id);
        return response()->json(null, 204);
    }
}
