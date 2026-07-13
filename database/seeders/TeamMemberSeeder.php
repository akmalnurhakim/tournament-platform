<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $thunderHawks = Team::where('name', 'Thunder Hawks')->firstOrFail();
        $coastalSpikers = Team::where('name', 'Coastal Spikers')->firstOrFail();

        $users = User::all()->keyBy('email');

        // Thunder Hawks (Basketball) — 3 members
        $thunderHawks->members()->create([
            'user_id' => $users['akmal@test.com']->id,
            'role' => 'captain',
            'position' => 'Point Guard',
            'joined_at' => now(),
        ]);

        $thunderHawks->members()->create([
            'user_id' => $users['farah@test.com']->id,
            'role' => 'player',
            'position' => 'Shooting Guard',
            'joined_at' => now(),
        ]);

        $thunderHawks->members()->create([
            'user_id' => $users['ismail@test.com']->id,
            'role' => 'player',
            'position' => 'Center',
            'joined_at' => now(),
        ]);

        // Coastal Spikers (Volleyball) — 2 members
        $coastalSpikers->members()->create([
            'user_id' => $users['nadia@test.com']->id,
            'role' => 'captain',
            'position' => 'Setter',
            'joined_at' => now(),
        ]);

        $coastalSpikers->members()->create([
            'user_id' => $users['zulkifli@test.com']->id,
            'role' => 'player',
            'position' => 'Outside Hitter',
            'joined_at' => now(),
        ]);
    }
}