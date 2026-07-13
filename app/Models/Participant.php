<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    protected $fillable = [
        'participant_type', 'user_id', 'team_id', 'guest_name', 'guest_contact',
    ];

    protected static function booted(): void
    {
        static::saving(function (Participant $participant) {
            $filled = collect([
                $participant->user_id,
                $participant->team_id,
                $participant->guest_name,
            ])->filter(fn ($v) => filled($v))->count();

            if ($filled !== 1) {
                throw new \InvalidArgumentException(
                    'A participant must have exactly one of user_id, team_id, or guest_name set.'
                );
            }
        });
    }

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

    public function groupEntries()
    {
        return $this->hasMany(GroupEntry::class);
    }
}