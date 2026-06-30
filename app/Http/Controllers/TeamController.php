<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Models\Team;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
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
        $teams = Team::with(['captain', 'sportType', 'members'])
            ->where('captain_id', '!=', $user->id)
            ->whereDoesntHave('members', fn ($q) => $q->where('users.id', $user->id))
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

        $teams = Team::with(['captain', 'sportType', 'members'])
            ->where('captain_id', $user->id)
            ->orWhereHas('members', fn ($q) => $q->where('users.id', $user->id))
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

    // Used by the JSON API (routes/api.php) — expects a JSON body back.
    // Keep this only as long as something actually consumes /api/teams
    // as JSON; if nothing does, delete this method and the api.php route
    // for it, and store() above becomes the only entry point.
    public function storeJson(StoreTeamRequest $request): JsonResponse
    {
        $team = $this->createTeamFromRequest($request);

        return response()->json($team->load(['captain', 'sportType']), 201);
    }

    // Shared logic: validation, file storage, team creation, and adding
    // the creator to the roster are identical regardless of which entry
    // point is used. Only the response shape (redirect vs JSON) differs,
    // so that's the only thing left in the public methods above.
    private function createTeamFromRequest(StoreTeamRequest $request): Team
    {
        $validated = $request->validated();

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        // captain_id is intentionally excluded from Team::$fillable so a
        // request body can never set it directly. Because of that, it
        // can't be passed into Team::create([...]) either — mass
        // assignment silently drops any key not in $fillable, which is
        // what caused the NOT NULL constraint failure. Setting it as a
        // direct property assignment bypasses the mass-assignment guard
        // while still keeping the protection against request spoofing.
        $team = new Team($validated);
        $team->captain_id = $request->user()->id;
        $team->save();

        $team->members()->attach($request->user()->id, [
            'joined_at' => now(),
        ]);

        return $team;
    }

    // Used by the Inertia web page (routes/web.php) — renders teams/showTeam.
    public function showPage(Request $request, Team $team): \Inertia\Response
    {
        $team->load(['captain', 'sportType', 'members']);

        $user = $request->user();
        $isMember = $team->isCaptain($user)
            || $team->members()->where('users.id', $user->id)->exists();

        $teamData = $team->toArray();
        if (!$isMember) {
            unset($teamData['invite_code']);
        }

        return inertia('teams/showTeam', [
            'team' => $teamData,
            'isCaptain' => $team->isCaptain($user),
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

        if ($team->captain_id === $user->id) {
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

        $team->members()->attach($user->id, ['joined_at' => now()]);

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