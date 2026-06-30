<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SportType;

class SportTypeSeeder extends Seeder
{
    public function run(): void
    {
        $sports = [

            [
                'name' => 'Football',
                'is_team_based' => true,
                'min_players' => 11,
                'max_players' => 23,
                'active_players' => 11,
            ],


            [
                'name' => 'Badminton Doubles',
                'is_team_based' => true,
                'min_players' => 2,
                'max_players' => 2,
                'active_players' => 2,
            ],


            [
                'name' => 'Basketball',
                'is_team_based' => true,
                'min_players' => 5,
                'max_players' => 12,
                'active_players' => 5,
            ],


            [
                'name' => 'Table Tennis Singles',
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