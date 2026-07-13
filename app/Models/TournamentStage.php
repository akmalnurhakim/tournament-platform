<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TournamentStage extends Model
{
    protected $fillable = [
        'tournament_id', 'stage_type', 'name', 'stage_order',
        'group_count', 'advance_count', 'points_win', 'points_draw', 'points_loss',
    ];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function groupEntries()
    {
        return $this->hasMany(GroupEntry::class, 'stage_id');
    }

    public function matches()
    {
        return $this->hasMany(GameMatch::class, 'stage_id');
    }
}