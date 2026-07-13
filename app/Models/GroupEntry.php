<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupEntry extends Model
{
    protected $fillable = [
        'stage_id', 'participant_id', 'group_label',
    ];

    public function stage()
    {
        return $this->belongsTo(TournamentStage::class, 'stage_id');
    }

    public function participant()
    {
        return $this->belongsTo(Participant::class);
    }
}