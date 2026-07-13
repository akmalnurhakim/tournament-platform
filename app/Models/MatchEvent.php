<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchEvent extends Model
{
    protected $fillable = [
        'match_id', 'participant_id', 'user_id', 'event_type', 'minute', 'remarks',
    ];

    /** @return BelongsTo<GameMatch, $this> */
    public function match(): BelongsTo
    {
        return $this->belongsTo(GameMatch::class);
    }

    /** @return BelongsTo<Participant, $this> */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}