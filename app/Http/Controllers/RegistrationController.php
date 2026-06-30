<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\Team;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class RegistrationController extends Controller
{
    public function store(Request $request, Tournament $tournament): \Illuminate\Http\RedirectResponse
    {
        $tournament->load('sportType');
        $user = $request->user();

        if ($tournament->sportType->is_team_based) {
            $validated = $request->validate([
                'team_id' => ['required', 'integer', 'exists:teams,id'],
            ]);

            $team = Team::with('sportType')->findOrFail($validated['team_id']);

            if (!$team->isCaptain($user)) {
                throw ValidationException::withMessages([
                    'team_id' => 'Only the team captain can register this team.',
                ]);
            }

            if ($team->sport_type_id !== $tournament->sport_type_id) {
                throw ValidationException::withMessages([
                    'team_id' => 'This team\'s sport does not match the tournament.',
                ]);
            }

            $alreadyRegistered = Registration::where('tournament_id', $tournament->id)
                ->where('team_id', $team->id)
                ->exists();

            if ($alreadyRegistered) {
                throw ValidationException::withMessages([
                    'team_id' => 'This team is already registered for this tournament.',
                ]);
            }

            Registration::create([
                'tournament_id' => $tournament->id,
                'team_id' => $team->id,
                'status' => 'pending',
            ]);
        } else {
            $alreadyRegistered = Registration::where('tournament_id', $tournament->id)
                ->where('user_id', $user->id)
                ->exists();

            if ($alreadyRegistered) {
                throw ValidationException::withMessages([
                    'user_id' => 'You are already registered for this tournament.',
                ]);
            }

            Registration::create([
                'tournament_id' => $tournament->id,
                'user_id' => $user->id,
                'status' => 'pending',
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'Registration submitted — awaiting approval.');
    }

    public function accept(Request $request, Registration $registration): \Illuminate\Http\RedirectResponse
    {
        $registration->load('tournament');
        $this->authorizeOrganizer($registration->tournament, $request->user());

        $registration->update(['status' => 'accepted']);

        return redirect()->back()->with('success', 'Registration accepted.');
    }

    public function reject(Request $request, Registration $registration): \Illuminate\Http\RedirectResponse
    {
        $registration->load('tournament');
        $this->authorizeOrganizer($registration->tournament, $request->user());

        $registration->update(['status' => 'rejected']);

        return redirect()->back()->with('success', 'Registration rejected.');
    }

    private function authorizeOrganizer(Tournament $tournament, $user): void
    {
        if ($tournament->organizer_id !== $user->id) {
            abort(403, 'Only the tournament organizer can manage registrations.');
        }
    }
    public function manage(Request $request, Tournament $tournament): \Inertia\Response
    {
        $this->authorizeOrganizer($tournament, $request->user());

        $registrations = Registration::with([
            'team.captain',
            'team.sportType',
            'team.members',
            'user',
        ])
            ->where('tournament_id', $tournament->id)
            ->latest()
            ->get();

        return inertia('tournaments/manageRegistrations', [
            'tournament' => $tournament->only(['id', 'name']),
            'registrations' => $registrations,
        ]);
    }
}