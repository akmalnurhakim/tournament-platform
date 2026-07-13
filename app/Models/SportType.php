<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SportType extends Model
{
    protected $fillable = [
        'name', 'is_team_based', 'min_players', 'max_players', 'active_players',
    ];

    protected $casts = [
        'is_team_based' => 'boolean',
    ];

    /** @return HasMany<Team, $this> */
    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    /** @return HasMany<Tournament, $this> */
    public function tournaments(): HasMany
    {
        return $this->hasMany(Tournament::class);
    }
}