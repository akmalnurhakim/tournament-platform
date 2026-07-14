<?php

namespace Database\Factories;

use App\Models\Tournament;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\TournamentStage>
 */
class TournamentStageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tournament_id' => Tournament::factory(),
            'name' => fake()->word(),
            'stage_type' => 'single_elimination',
            'stage_order' => fake()->unique()->numberBetween(1, 1000),
        ];
    }
}