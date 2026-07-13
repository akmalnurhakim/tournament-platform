<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TournamentStage extends Model
{
    protected $fillable = [
        'tournament_id', 'stage_type', 'name', 'stage_order',
        'group_count', 'advance_count', 'points_win', 'points_draw', 'points_loss',
    ];

    /** @return BelongsTo<Tournament, $this> */
    public function tournament(): BelongsTo
    {
        return $this->belongsTo(Tournament::class);
    }

    /** @return HasMany<GroupEntry, $this> */
    public function groupEntries(): HasMany
    {
        return $this->hasMany(GroupEntry::class, 'stage_id');
    }

    /** @return HasMany<GameMatch, $this> */
    public function matches(): HasMany  
    {
        return $this->hasMany(GameMatch::class, 'stage_id');
    }
}