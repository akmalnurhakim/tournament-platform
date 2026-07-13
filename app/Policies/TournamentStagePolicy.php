<?php

namespace App\Policies;

use App\Models\TournamentStage;
use App\Models\User;

class TournamentStagePolicy
{
    public function update(User $user, TournamentStage $stage): bool
    {
        return $this->canManage($user, $stage);
    }

    public function delete(User $user, TournamentStage $stage): bool
    {
        return $this->canManage($user, $stage);
    }

    private function canManage(User $user, TournamentStage $stage): bool
    {
        return $user->id === $stage->tournament->organizer_id
            && !$stage->tournament->hasGeneratedMatches();
    }
}