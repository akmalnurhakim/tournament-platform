<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{

    protected $fillable = [
        'name',
        'sport_type_id',
        'description',
        'is_team_based',
        'start_date',
        'end_date',
        'status',
        'organizer_id',
    ];

    protected $casts = [
        'is_team_based' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    //organizer 
    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    //sport type
    public function sportType()
    {
        return $this->belongsTo(SportType::class);
    }

    //Matches
    public function matches()
    {
        return $this->hasMany(Matches::class);
    }

    //registrations
    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

}
