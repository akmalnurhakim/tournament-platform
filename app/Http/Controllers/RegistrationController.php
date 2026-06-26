<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use Illuminate\Http\Request;

class RegistrationController extends Controller
{
    public function index()
    {
        return Registration::with('tournament', 'team', 'player')->get();
    }

    public function show($id)
    {
        return Registration::with('tournament', 'team', 'player')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $registration = Registration::create($request->all());
        return response()->json($registration, 201);
    }

    public function update(Request $request, $id)
    {
        $registration = Registration::findOrFail($id);
        $registration->update($request->all());
        return response()->json($registration, 200);
    }

    public function destroy($id)
    {
        Registration::destroy($id);
        return response()->json(null, 204);
    }
}
