<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchParticipant extends Model
{
    use HasFactory;

    protected $fillable = ['match_id', 'team_id', 'player_id'];

    public function match()
    {
        return $this->belongsTo(Matches::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function player()
    {
        return $this->belongsTo(Player::class);
    }
}
