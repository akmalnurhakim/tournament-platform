<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class Tournament extends Model
{
    protected $fillable = [
        'organizer_id', 'sport_type_id', 'name', 'format', 'description',
        'venue', 'location', 'visibility', 'invite_code', 'rules',
        'registration_start', 'registration_end', 'max_participants',
        'start_date', 'end_date', 'status',
    ];

    protected $appends = ['banner_url'];

    protected $casts = [
        'registration_start' => 'datetime',
        'registration_end' => 'datetime',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function sportType()
    {
        return $this->belongsTo(SportType::class);
    }

    public function committees()
    {
        return $this->hasMany(TournamentCommittee::class);
    }

    public function stages()
    {
        return $this->hasMany(TournamentStage::class);
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    protected function bannerUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->banner
                ? Storage::url($this->banner)
                : '/banners/default.jpg',
        );
    }

    public function hasGeneratedMatches(): bool
    {
        return $this->stages()
            ->whereHas('matches')
            ->exists();
    }

    public function approvedRegistrationsCount(): int
    {
        return $this->registrations()->where('status', 'approved')->count();
    }

    public function hasReachedParticipantLimit(): bool
    {
        if (is_null($this->max_participants)) {
            return false; // unlimited — no cap to reach
        }

        return $this->approvedRegistrationsCount() >= $this->max_participants;
    }

    public function readyForBracketGeneration(): bool
    {
        if (is_null($this->max_participants)) {
            return false; // no defined target, so "reached the required number" is undefined
        }

        return $this->approvedRegistrationsCount() >= $this->max_participants;
    }
}