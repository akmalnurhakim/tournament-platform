<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matches extends Model
{
    use HasFactory;

    protected $fillable = ['tournament_id', 'scheduled_at', 'status'];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function participants()
    {
        return $this->hasMany(MatchParticipant::class);
    }
}
