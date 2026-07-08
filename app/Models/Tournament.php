<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Validation\ValidationException;

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

    // Valid forward transitions
    const TRANSITIONS = [
        'draft'       => ['open'],
        'open'        => ['closed'],
        'closed'      => ['open', 'in_progress'], // closed → open is the one allowed revert
        'in_progress' => ['completed'],
        'completed'   => [],
    ];

    // Human-readable labels for the UI
    const STATUS_LABELS = [
        'draft'       => 'Draft',
        'open'        => 'Open for Registration',
        'closed'      => 'Registration Closed',
        'in_progress' => 'In Progress',
        'completed'   => 'Completed',
    ];

    public function canTransitionTo(string $newStatus): bool
    {
        return in_array($newStatus, self::TRANSITIONS[$this->status] ?? []);
    }

    public function transitionTo(string $newStatus): void
    {
        if (!$this->canTransitionTo($newStatus)) {
            throw ValidationException::withMessages([
                'status' => "Cannot transition from \"{$this->status}\" to \"{$newStatus}\".",
            ]);
        }

        $this->update(['status' => $newStatus]);
    }

    public function nextStatuses(): array
    {
        return self::TRANSITIONS[$this->status] ?? [];
    }

    public function isOpen(): bool       { return $this->status === 'open'; }
    public function isDraft(): bool      { return $this->status === 'draft'; }
    public function isClosed(): bool     { return $this->status === 'closed'; }
    public function isInProgress(): bool { return $this->status === 'in_progress'; }
    public function isCompleted(): bool  { return $this->status === 'completed'; }

    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function sportType(): BelongsTo
    {
        return $this->belongsTo(SportType::class);
    }

    public function matches(): HasMany
    {
        return $this->hasMany(Matches::class);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }
}