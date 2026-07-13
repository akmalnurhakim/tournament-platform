<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SportType extends Model
{
    protected $fillable = [
        'name', 'is_team_based', 'min_players', 'max_players', 'active_players',
    ];

    protected $casts = [
        'is_team_based' => 'boolean',
    ];

    public function teams()
    {
        return $this->hasMany(Team::class);
    }

    public function tournaments()
    {
        return $this->hasMany(Tournament::class);
    }
}