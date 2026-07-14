<?php

namespace Database\Factories;

use App\Models\SportType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<\App\Models\Team>
 */
class TeamFactory extends Factory
{
    public function definition(): array
    {
        return [
            'sport_type_id' => SportType::factory(),
            'name' => fake()->unique()->company(),
            'invite_code' => Str::upper(Str::random(8)),
            'status' => 'Active',
        ];
    }
}