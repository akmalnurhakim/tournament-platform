<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tournament extends Model
{
    use HasFactory;
    protected $fillable = [
        'organizer_id', 'sport_type_id', 'name', 'format', 'description',
        'venue', 'location', 'visibility', 'invite_code', 'rules',
        'registration_start', 'registration_end', 'max_participants',
        'start_date', 'end_date', 'status', 'banner',
    ];

    protected $appends = ['banner_url'];

    protected $casts = [
        'registration_start' => 'datetime',
        'registration_end' => 'datetime',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /** @return BelongsTo<User, $this> */
    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id'); // adjust FK if different
    }

    /** @return BelongsTo<SportType, $this> */
    public function sportType(): BelongsTo
    {
        return $this->belongsTo(SportType::class);
}

    /** @return HasMany<TournamentCommittee, $this> */
    public function committees(): HasMany
    {
        return $this->hasMany(TournamentCommittee::class);
    }

    /** @return HasMany<TournamentStage, $this> */
    public function stages(): HasMany
    {
        return $this->hasMany(TournamentStage::class);
    }

    /** @return HasMany<Registration, $this> */
    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

/** @return Attribute<string, never> */
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