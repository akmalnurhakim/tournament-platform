<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'captain_id'];

    public function captain()
    {
        return $this->belongsTo(User::class, 'captain_id');
    }

    public function players()
    {
        return $this->hasMany(Player::class);
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function matchParticipants()
    {
        return $this->hasMany(MatchParticipant::class);
    }
}
