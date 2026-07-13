<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GroupEntry extends Model
{
    protected $fillable = [
        'stage_id', 'participant_id', 'group_label',
    ];

    /** @return BelongsTo<TournamentStage, $this> */
    public function stage(): BelongsTo
    {
        return $this->belongsTo(TournamentStage::class);
    }

    /** @return BelongsTo<Participant, $this> */
    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}