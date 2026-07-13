<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TournamentCommittee extends Model
{
    protected $fillable = [
        'tournament_id', 'user_id', 'committee_role', 'status', 'invited_by', 'joined_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
    ];

    /** @return BelongsTo<Tournament, $this> */
    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<User, $this> */
    public function inviter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }
}