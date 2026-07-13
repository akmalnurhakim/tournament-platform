<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Participant extends Model
{
    protected $fillable = [
        'participant_type', 'user_id', 'team_id', 'guest_name', 'guest_contact',
    ];

    protected static function booted(): void
    {
        static::saving(function (Participant $participant) {
            $filled = count(array_filter([
                $participant->user_id,
                $participant->team_id,
                $participant->guest_name,
            ], fn ($v) => filled($v)));

            if ($filled !== 1) {
                throw new \InvalidArgumentException(
                    'A participant must have exactly one of user_id, team_id, or guest_name set.'
                );
            }
        }); 
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Team, $this> */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /** @return HasMany<Registration, $this> */
    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    /** @return HasMany<GroupEntry, $this> */
    public function groupEntries(): HasMany
    {
        return $this->hasMany(GroupEntry::class);
    }
}