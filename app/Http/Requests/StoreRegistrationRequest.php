<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('register', $this->route('tournament'));
    }

    /**
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        /** @var \App\Models\Tournament $tournament */
        $tournament = $this->route('tournament');

        $sportIsTeamBased = $tournament->sportType->is_team_based;

        return [
            'team_id' => [
                $sportIsTeamBased ? 'required' : 'prohibited',
                'exists:teams,id',
            ],
        ];
    }
}