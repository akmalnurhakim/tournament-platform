<?php

namespace App\Policies;

use App\Models\Tournament;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TournamentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; //public tournament view
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Tournament $tournament): bool
    {
        if ($tournament->visibility === 'public') {
            return true;
        }

        return $user->id === $tournament->organizer_id
            || $tournament->committees()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; //authenticated users can create tournaments
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Tournament $tournament): bool
    {
        return $user->id === $tournament->organizer_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Tournament $tournament): bool
    {
        return $user->id === $tournament->organizer_id
        && $tournament->status === 'draft'; //cannot delete live tournaments
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Tournament $tournament): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Tournament $tournament): bool
    {
        return false;
    }

    public function register(User $user, Tournament $tournament): bool
    {
        if ($tournament->status !== 'open') {
            return false;
        }

        $alreadyRegistered = $tournament->registrations()
            ->whereHas('participant', function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhereHas('team.members', function (\Illuminate\Database\Eloquent\Builder $m) use ($user) {
                        $m->where('user_id', $user->id);
                    });
            })
            ->exists();

        return !$alreadyRegistered;
    }

    public function addGuest(User $user, Tournament $tournament): bool
    {
        return $user->id === $tournament->organizer_id;
    }
}
