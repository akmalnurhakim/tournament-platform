<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGuestRegistrationRequest;
use App\Models\Participant;
use App\Models\Registration;
use App\Models\Tournament;
use Illuminate\Support\Facades\DB;

class GuestRegistrationController extends Controller
{
    public function store(StoreGuestRegistrationRequest $request, Tournament $tournament)
    {
        if ($tournament->hasReachedParticipantLimit()) {
            return back()->with('error', 'This tournament has already reached its maximum approved participants.');
        }

        DB::transaction(function () use ($request, $tournament) {
            $participant = Participant::create([
                'participant_type' => 'guest',
                'guest_name' => $request->guest_name,
                'guest_contact' => $request->guest_contact,
            ]);

            Registration::create([
                'tournament_id' => $tournament->id,
                'participant_id' => $participant->id,
                'status' => 'approved',
                'registrated_at' => now(),
                'approved_at' => now(),
                'approved_by' => auth()->id(),
            ]);
        });

        return back()->with('success', 'Guest participant added.');
    }
}