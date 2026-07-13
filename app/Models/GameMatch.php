<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameMatch extends Model
{
    protected $table = 'matches';

    protected $fillable = [
        'stage_id', 'round_number', 'bracket_position',
        'participant_a_id', 'participant_b_id',
        'participant_a_score', 'participant_b_score', 'winner_participant_id',
        'next_match_id', 'next_match_slot',
        'scheduled_at', 'started_at', 'ended_at',
        'venue', 'status', 'remarks',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function stage()
    {
        return $this->belongsTo(TournamentStage::class, 'stage_id');
    }

    public function participantA()
    {
        return $this->belongsTo(Participant::class, 'participant_a_id');
    }

    public function participantB()
    {
        return $this->belongsTo(Participant::class, 'participant_b_id');
    }

    public function winner()
    {
        return $this->belongsTo(Participant::class, 'winner_participant_id');
    }

    public function nextMatch()
    {
        return $this->belongsTo(GameMatch::class, 'next_match_id');
    }

    public function events()
    {
        return $this->hasMany(MatchEvent::class, 'match_id');
    }
}