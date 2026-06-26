<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TournamentTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_tournament()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/tournaments', [
            'name' => 'Summer Cup',
            'sport_type_id' => 1,
            'is_team_based' => true,
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-15',
            'status' => 'upcoming',
            'organizer_id' => $user->id,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('tournaments', ['name' => 'Summer Cup']);
    }
}
