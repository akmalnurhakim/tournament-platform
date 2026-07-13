<?php

namespace App\Policies;

use App\Models\Registration;
use App\Models\User;

class RegistrationPolicy
{
    public function review(User $user, Registration $registration): bool
    {
        return $user->id === $registration->tournament->organizer_id;
    }
}