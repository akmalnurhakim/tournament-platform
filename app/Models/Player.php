<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'team_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
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
