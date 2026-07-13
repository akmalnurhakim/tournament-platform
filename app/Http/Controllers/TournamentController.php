<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreTournamentRequest;
use App\Http\Requests\UpdateTournamentRequest;
use App\Models\SportType;
use App\Models\Tournament;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TournamentController extends Controller
{
    public function index()
    {
        $tournaments = Tournament::where('visibility', 'public')
            ->with('sportType', 'organizer')
            ->latest()
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('tournaments/index', [
            'tournaments' => $tournaments,
            'sportTypes' => SportType::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('tournaments/create', [
            'sportTypes' => SportType::all(),
        ]);
    }

    public function store(StoreTournamentRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('banner')) {
            $data['banner'] = $request->file('banner')->store('banners', 'public');
        }

        $tournament = Tournament::create([
            ...$data,
            'organizer_id' => $request->user()->id,
            'invite_code' => Str::upper(Str::random(8)),
            'status' => 'draft',
        ]);

        return redirect()
            ->route('tournaments.show', $tournament)
            ->with('success', 'Tournament created. Configure your stages next.');
    }

    public function show(Tournament $tournament)
    {
        $this->authorize('view', $tournament);

        $tournament->load([
            'sportType',
            'organizer',
            'registrations' => fn ($q) => $q->where('status', 'approved'),
            'registrations.participant.team',
            'registrations.participant.user',
            'stages.groupEntries.participant.team',
            'stages.groupEntries.participant.user',
            'stages.matches.participantA.team',
            'stages.matches.participantA.user',
            'stages.matches.participantB.team',
            'stages.matches.participantB.user',
        ]);

        $user = auth()->user();
        $isOrganizer = $user && $user->id === $tournament->organizer_id;

        $eligibleTeams = [];
        $myRegistration = null;

        if ($user) {
            $eligibleTeams = $user->teamMemberships()
                ->whereIn('role', ['captain', 'coach'])
                ->with('team')
                ->get()
                ->pluck('team')
                ->filter(fn ($team) => $team->sport_type_id === $tournament->sport_type_id)
                ->values();

            $myRegistration = \App\Models\Registration::where('tournament_id', $tournament->id)
                ->whereHas('participant', function ($q) use ($user) {
                    $q->where('user_id', $user->id)
                        ->orWhereHas('team.members', fn ($m) => $m->where('user_id', $user->id));
                })
                ->first(['id', 'status']);
        }

        return Inertia::render('tournaments/show', [
            'tournament' => $tournament,
            'isOrganizer' => $isOrganizer,
            'eligibleTeams' => $eligibleTeams,
            'myRegistration' => $myRegistration,
            'canRegister' => $user && !$isOrganizer && $user->can('register', $tournament),
        ]);
    }

    public function edit(Tournament $tournament)
    {
        $this->authorize('update', $tournament);

        return Inertia::render('tournaments/edit', [
            'tournament' => $tournament,
            'sportTypes' => SportType::all(),
        ]);
    }

    public function update(UpdateTournamentRequest $request, Tournament $tournament)
    {
        $data = $request->validated();

        if ($request->hasFile('banner')) {
            // delete the old banner file so uploads don't pile up unused in storage
            if ($tournament->banner) {
                Storage::disk('public')->delete($tournament->banner);
            }

            $data['banner'] = $request->file('banner')->store('banners', 'public');
        }

        $tournament->update($data);

        return redirect()
            ->route('tournaments.show', $tournament)
            ->with('success', 'Tournament updated.');
    }

    public function destroy(Tournament $tournament)
    {
        $this->authorize('delete', $tournament);

        $tournament->delete();

        return redirect()
            ->route('tournaments.index')
            ->with('success', 'Tournament deleted.');
    }

    public function myTournaments()
    {
        $tournaments = Tournament::where('organizer_id', auth()->id())
            ->with('sportType', 'organizer')
            ->latest()
            ->paginate(5)
            ->withQueryString();

        return Inertia::render('tournaments/myTournaments', [
            'tournaments' => $tournaments,
        ]);
    }

   public function manage(Tournament $tournament)
    {
        $this->authorize('update', $tournament);

        $tournament->load('sportType', 'stages.matches');

        $registrationCounts = $tournament->registrations()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $transitions = [
            'draft' => ['open'],
            'open' => ['closed'],
            'closed' => ['open', 'in_progress'],
            'in_progress' => ['completed'],
            'completed' => [],
        ];

        return Inertia::render('tournaments/manage', [
            'tournament' => $tournament,
            'stagesLocked' => $tournament->hasGeneratedMatches(),
            'registrationCounts' => [
                'pending' => $registrationCounts['pending'] ?? 0,
                'approved' => $registrationCounts['approved'] ?? 0,
                'rejected' => $registrationCounts['rejected'] ?? 0,
            ],
            'maxParticipants' => $tournament->max_participants,
            'readyForBracketGeneration' => $tournament->readyForBracketGeneration(),
            'nextStatuses' => $transitions[$tournament->status] ?? [],
        ]);
    }

    public function updateStatus(Request $request, Tournament $tournament)
    {
        $this->authorize('update', $tournament);

        $transitions = [
            'draft' => ['open'],
            'open' => ['closed'],
            'closed' => ['open', 'in_progress'],
            'in_progress' => ['completed'],
            'completed' => [],
        ];

        $allowed = $transitions[$tournament->status] ?? [];

        $request->validate([
            'status' => ['required', 'string', function ($attribute, $value, $fail) use ($allowed) {
                if (!in_array($value, $allowed, true)) {
                    $fail('That status transition is not allowed from the current status.');
                }
            }],
        ]);

        $tournament->update(['status' => $request->status]);

        return back()->with('success', 'Tournament status updated.');
    }
}