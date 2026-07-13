<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    /** @return BelongsTo<TournamentStage, $this> */
    public function stage(): BelongsTo
    {
        return $this->belongsTo(TournamentStage::class);
    }

    /** @return BelongsTo<Participant, $this> */
    public function participantA(): BelongsTo
    {
        return $this->belongsTo(Participant::class, 'participant_a_id'); // adjust FK
    }

    /** @return BelongsTo<Participant, $this> */
    public function participantB(): BelongsTo
    {
        return $this->belongsTo(Participant::class, 'participant_b_id'); // adjust FK
    }

    /** @return BelongsTo<Participant, $this> */
    public function winner(): BelongsTo
    {
        return $this->belongsTo(Participant::class, 'winner_id'); // adjust FK
    }

    /** @return BelongsTo<GameMatch, $this> */
    public function nextMatch(): BelongsTo
    {
        return $this->belongsTo(GameMatch::class, 'next_match_id'); // adjust FK
    }

    /** @return HasMany<MatchEvent, $this> */
    public function events(): HasMany
    {
        return $this->hasMany(MatchEvent::class);
    }
}