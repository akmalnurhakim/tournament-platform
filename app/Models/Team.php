<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Team extends Model
{
    use HasFactory;
    protected $fillable = [
        'sport_type_id', 'name', 'logo', 'description', 'invite_code', 'status',
    ];

    /**
     * @return BelongsTo<SportType, $this>
     */
    public function sportType(): BelongsTo
    {
        return $this->belongsTo(SportType::class);
    }

    /**
     * @return HasMany<TeamMember, $this>
     */
    public function members(): HasMany
    {
        return $this->hasMany(TeamMember::class);
    }

    /**
     * @return HasMany<Participant, $this>
     */
    public function participants(): HasMany
    {
        return $this->hasMany(Participant::class);
    }

    /**
     * @return HasOne<TeamMember, $this>
     */
    public function captain(): HasOne
    {
        return $this->hasOne(TeamMember::class)->where('role', 'captain');
    }

    public function isCaptain(User $user): bool
    {
        return $this->members()
            ->where('user_id', $user->id)
            ->where('role', 'captain')
            ->exists();
    }
}