<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('register', $this->route('tournament'));
    }

    public function rules(): array
    {
        $sportIsTeamBased = $this->route('tournament')->sportType->is_team_based;

        return [
            'team_id' => [
                $sportIsTeamBased ? 'required' : 'prohibited',
                'exists:teams,id',
            ],
        ];
    }
}