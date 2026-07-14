<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\SportType>
 */
class SportTypeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word(),
            'is_team_based' => true,
            'min_players' => 5,
            'max_players' => 11,
            'active_players' => 5,
        ];
    }
}