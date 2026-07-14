<?php

namespace Database\Factories;

use App\Models\SportType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\Tournament>
 */
class TournamentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'organizer_id' => User::factory(),
            'sport_type_id' => SportType::factory(),
            'name' => fake()->unique()->words(3, true),
            'visibility' => 'public',
            'status' => 'draft',
        ];
    }

    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'open',
        ]);
    }
}