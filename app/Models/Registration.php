<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    protected $fillable = [
        'tournament_id', 'participant_id', 'status', 'remarks',
        'registrated_at', 'approved_at', 'approved_by', 'withdrawn_at',
    ];

    protected $casts = [
        'registrated_at' => 'datetime',
        'approved_at' => 'datetime',
        'withdrawn_at' => 'datetime',
    ];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function participant()
    {
        return $this->belongsTo(Participant::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}