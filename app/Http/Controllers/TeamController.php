<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Models\Team;
use App\Models\TeamMember;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TeamController extends Controller
{
    use AuthorizesRequests;
    public function index(): JsonResponse
    {
        $teams = Team::with(['captain', 'sportType', 'members'])
            ->latest()
            ->paginate(20);

        return response()->json($teams);
    }
    // Used by the Inertia web page (routes/web.php) — renders teams/index.
    public function indexPage(): \Inertia\Response
    {
        $user = request()->user();

        $teams = Team::with([
                'sportType',
                'members.user',
            ])
            ->whereDoesntHave('members', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->latest()
            ->paginate(9);

        return inertia('teams/index', [
            'teams' => $teams,
            'heading' => 'Browse Teams',
            'subheading' => 'Discover teams',
        ]);
    }

    // Used by the Inertia web page (routes/web.php) — renders teams/my-teams.
    public function myTeamsPage(Request $request): \Inertia\Response
    {
        $user = $request->user();

        $teams = Team::whereHas('members', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->with(['sportType', 'members'])
            ->latest()
            ->paginate(9);

        return inertia('teams/my-teams', [
            'teams' => $teams,
            'heading' => 'My Teams',
            'subheading' => 'Teams you are part of',
        ]);
    }

    // Used by the Inertia web form (routes/web.php) — expects a redirect.
    public function store(StoreTeamRequest $request): \Illuminate\Http\RedirectResponse
    {
        $team = $this->createTeamFromRequest($request);

        return redirect()
            ->route('teams.show', $team)
            ->with('success', "Team \"{$team->name}\" created.");
    }

    private function createTeamFromRequest(StoreTeamRequest $request): Team
    {
        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $validated['invite_code'] = Str::upper(Str::random(8));

        $team = Team::create($validated);

        // members() is a hasMany to TeamMember, not a belongsToMany pivot,
        // so records are created directly rather than attached.
        $team->members()->create([
            'user_id' => $request->user()->id,
            'role' => 'captain',
            'joined_at' => now(),
        ]);

        return $team;
    }

    // Used by the Inertia web page (routes/web.php) — renders teams/showTeam.
    public function showPage(Request $request, Team $team): \Inertia\Response
    {
        $team->load([
            'sportType',
            'members.user',
        ]);

        $user = $request->user();

        $isMember = $team->members()
            ->where('user_id', $user->id)
            ->exists();

        $teamData = $team->toArray();

        if (! $isMember) {
            unset($teamData['invite_code']);
        }

        return inertia('teams/showTeam', [
            'team' => $teamData,
            'isMember' => $isMember,
        ]);
    }

    // Used by the JSON API (routes/api.php).
    public function show(Team $team): JsonResponse
    {
        return response()->json($team->load(['captain', 'sportType', 'members']));
    }

    // TeamController.php
    public function editPage(Request $request, Team $team): \Inertia\Response
    {
        $this->authorize('update', $team);

        return inertia('teams/editTeam', [
            'team' => $team->load('sportType'),
        ]);
    }

    public function destroy(Request $request, Team $team): JsonResponse
    {
        $this->authorize('delete', $team);

        $team->delete();

        return response()->json(null, 204);
    }

    public function update(UpdateTeamRequest $request, Team $team): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $team->update($validated);

        return redirect()
            ->route('teams.show', $team)
            ->with('success', "Team \"{$team->name}\" updated.");
    }

    private function joinTeamByCode(string $inviteCode, User $user): Team
    {
        $team = Team::with('sportType')
            ->where('invite_code', strtoupper($inviteCode))
            ->firstOrFail();

        if ($team->members()->where('users.id', $user->id)->exists()) {
            throw ValidationException::withMessages([
                'invite_code' => 'You are already a member of this team.',
            ]);
        }

        if ($team->isCaptain($user)) {
            throw ValidationException::withMessages([
                'invite_code' => 'You are the captain of this team.',
            ]);
        }

        $currentCount = $team->members()->count();
        $maxAllowed = $team->sportType->max_players;

        if ($currentCount >= $maxAllowed) {
            throw ValidationException::withMessages([
                'invite_code' => 'This team is already full.',
            ]);
        }

        $team->members()->create([
            'user_id' => $user->id,
            'role' => 'member',
            'joined_at' => now(),
        ]);

        return $team;
    }
    // Manual entry form submit (web) — expects a redirect
    public function join(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'invite_code' => ['required', 'string', 'size:8'],
        ]);

        $team = $this->joinTeamByCode($request->input('invite_code'), $request->user());

        return redirect()
            ->route('teams.show', $team)
            ->with('success', "You joined \"{$team->name}\".");
    }

    // Shows team preview + Join button. GET /teams/join/{code}
    public function joinPreview(string $code): \Inertia\Response
    {
        $team = Team::with(['sportType', 'captain'])
            ->where('invite_code', strtoupper($code))
            ->firstOrFail();

        return inertia('teams/joinPreview', [
            'team' => $team,
            'memberCount' => $team->members()->count(),
            'inviteCode' => strtoupper($code),
        ]);
    }

    // Actually performs the join. POST /teams/join/{code}
    public function joinViaLink(Request $request, string $code): \Illuminate\Http\RedirectResponse
    {
        $team = $this->joinTeamByCode($code, $request->user());

        return redirect()
            ->route('teams.show', $team)
            ->with('success', "You joined \"{$team->name}\".");
    }
}