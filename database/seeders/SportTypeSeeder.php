<?php

namespace Database\Seeders;

use App\Models\SportType;
use Illuminate\Database\Seeder;

class SportTypeSeeder extends Seeder
{
    public function run(): void
    {
        $sports = [
            [
                'name' => 'Basketball',
                'is_team_based' => true,
                'min_players' => 5,
                'max_players' => 12,
                'active_players' => 5,
            ],
            [
                'name' => 'Volleyball',
                'is_team_based' => true,
                'min_players' => 6,
                'max_players' => 12,
                'active_players' => 6,
            ],
            [
                'name' => 'Chess',
                'is_team_based' => false,
                'min_players' => 1,
                'max_players' => 1,
                'active_players' => 1,
            ],
        ];

        foreach ($sports as $sport) {
            SportType::create($sport);
        }
    }
}