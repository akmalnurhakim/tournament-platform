<?php

namespace Database\Factories;

use App\Models\TournamentStage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<\App\Models\GameMatch>
 */
class GameMatchFactory extends Factory
{
    public function definition(): array
    {
        return [
            'stage_id' => TournamentStage::factory(),
        ];
    }
}