<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    public function update(User $user, Team $team): bool
    {
        return $team->isCaptain($user);
    }

    public function delete(User $user, Team $team): bool
    {
        return $team->isCaptain($user);
    }

    public function manageMembers(User $user, Team $team): bool
    {
        return $team->isCaptain($user);
    }
}