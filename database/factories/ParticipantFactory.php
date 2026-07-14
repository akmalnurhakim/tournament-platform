<?php

namespace Database\Factories;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Participant>
 */
class ParticipantFactory extends Factory
{
    public function definition(): array
    {
        // Default: individual participant tied to a user
        return [
            'participant_type' => 'individual',
            'user_id' => User::factory(),
            'team_id' => null,
            'guest_name' => null,
            'guest_contact' => null,
        ];
    }

    public function forTeam(): static
    {
        return $this->state(fn (array $attributes) => [
            'participant_type' => 'team',
            'user_id' => null,
            'team_id' => Team::factory(),
            'guest_name' => null,
        ]);
    }

    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'participant_type' => 'individual',
            'user_id' => null,
            'team_id' => null,
            'guest_name' => fake()->name(),
            'guest_contact' => fake()->safeEmail(),
        ]);
    }
}