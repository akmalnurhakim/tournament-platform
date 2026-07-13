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
        $basketball = SportType::where('name', 'Basketball')->first();
        $volleyball = SportType::where('name', 'Volleyball')->first();

        Team::create([
            'sport_type_id' => $basketball->id,
            'name' => 'Thunder Hawks',
            'description' => 'Basketball team representing the east district.',
            'invite_code' => Str::upper(Str::random(8)),
            'status' => 'active',
        ]);

        Team::create([
            'sport_type_id' => $volleyball->id,
            'name' => 'Coastal Spikers',
            'description' => 'Volleyball team from the coastal region.',
            'invite_code' => Str::upper(Str::random(8)),
            'status' => 'active',
        ]);
    }
}