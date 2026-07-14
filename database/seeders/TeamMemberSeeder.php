<?php

namespace Database\Seeders;

use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $teams = Team::orderBy('id')->get();
        $users = User::orderBy('id')->get();

        $positions = ['Point Guard', 'Shooting Guard', 'Center', 'Forward', 'Small Forward'];

        foreach ($teams as $teamIndex => $team) {
            $teamUsers = $users->slice($teamIndex * 5, 5)->values();

            foreach ($teamUsers as $memberIndex => $user) {
                $team->members()->create([
                    'user_id' => $user->id,
                    'role' => $memberIndex === 0 ? 'captain' : 'player',
                    'position' => $positions[$memberIndex],
                    'joined_at' => now(),
                ]);
            }
        }
    }
}