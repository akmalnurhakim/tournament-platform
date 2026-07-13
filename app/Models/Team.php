<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = [
        'sport_type_id', 'name', 'logo', 'description', 'invite_code', 'status',
    ];

    public function sportType()
    {
        return $this->belongsTo(SportType::class);
    }

    public function members()
    {
        return $this->hasMany(TeamMember::class);
    }

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }
}