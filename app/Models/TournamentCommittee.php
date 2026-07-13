<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TournamentCommittee extends Model
{
    protected $fillable = [
        'tournament_id', 'user_id', 'committee_role', 'status', 'invited_by', 'joined_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
    ];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function inviter()
    {
        return $this->belongsTo(User::class, 'invited_by');
    }
}