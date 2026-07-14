<?php

namespace Database\Seeders;

use App\Models\SportType;
use App\Models\Team;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $basketball = SportType::where('name', 'Basketball')->firstOrFail();
        $volleyball = SportType::where('name', 'Volleyball')->firstOrFail();

        $teams = [
            ['name' => 'Thunder Hawks', 'sport_type_id' => $basketball->id, 'description' => 'Basketball team representing the east district.'],
            ['name' => 'Fire Dragons', 'sport_type_id' => $basketball->id, 'description' => 'Basketball team from the north league.'],
            ['name' => 'Coastal Spikers', 'sport_type_id' => $volleyball->id, 'description' => 'Volleyball team from the coastal region.'],
            ['name' => 'Wave Riders', 'sport_type_id' => $volleyball->id, 'description' => 'Volleyball team from the southern beaches.'],
        ];

        foreach ($teams as $team) {
            Team::create([
                'sport_type_id' => $team['sport_type_id'],
                'name' => $team['name'],
                'description' => $team['description'],
                'invite_code' => Str::upper(Str::random(8)),
                'status' => 'active',
            ]);
        }
    }
}