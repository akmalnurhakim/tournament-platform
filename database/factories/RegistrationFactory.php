<?php

namespace Database\Factories;

use App\Models\Participant;
use App\Models\Tournament;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Registration>
 */
class RegistrationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tournament_id' => Tournament::factory(),
            'participant_id' => Participant::factory(),
            'status' => 'pending',
            'registrated_at' => now(),
        ];
    }
}