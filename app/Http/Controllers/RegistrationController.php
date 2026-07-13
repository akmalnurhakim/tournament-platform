<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRegistrationRequest;
use App\Models\Participant;
use App\Models\Registration;
use App\Models\Team;
use App\Models\Tournament;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class RegistrationController extends Controller
{
    public function store(StoreRegistrationRequest $request, Tournament $tournament)
    {
        $data = $request->validated();

        DB::transaction(function () use ($request, $tournament, $data) {
            $participant = Participant::create([
                'participant_type' => isset($data['team_id']) ? 'team' : 'individual',
                'team_id' => $data['team_id'] ?? null,
                'user_id' => isset($data['team_id']) ? null : $request->user()->id,
            ]);

            Registration::create([
                'tournament_id' => $tournament->id,
                'participant_id' => $participant->id,
                'status' => 'pending',
                'registrated_at' => now(),
            ]);
        });

        return back()->with('success', 'Registration submitted. Waiting for organizer approval.');
    }

    public function accept(Registration $registration)
    {
        $this->authorize('review', $registration);

        $tournament = $registration->tournament;

        if ($tournament->hasReachedParticipantLimit()) {
            return back()->with('error', 'This tournament has already reached its maximum approved participants.');
        }

        $registration->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        return back()->with('success', 'Registration approved.');
    }

    public function reject(Registration $registration)
    {
        $this->authorize('review', $registration);

        $registration->update(['status' => 'rejected']);

        return back()->with('success', 'Registration rejected.');
    }

    public function manage(Tournament $tournament)
    {
        $this->authorize('update', $tournament);

        $registrations = $tournament->registrations()
            ->with(['participant.team', 'participant.user'])
            ->latest()
            ->get()
            ->groupBy('status');

        return Inertia::render('registrations/manage', [
            'tournament' => $tournament,
            'pending' => $registrations->get('pending', collect())->values(),
            'approved' => $registrations->get('approved', collect())->values(),
            'rejected' => $registrations->get('rejected', collect())->values(),
            'canAddGuest' => auth()->user()->can('addGuest', $tournament),
        ]);
    }
}