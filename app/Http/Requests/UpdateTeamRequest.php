<?php

namespace App\Http\Requests;

use App\Models\Team;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        $team = $this->route('team');

        return $team instanceof Team
            && $this->user()?->can('update', $team);
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'sport_type_id' => ['sometimes', 'required', 'integer', 'exists:sport_types,id'],
            'logo' => ['sometimes', 'nullable', 'image', 'max:2048'], // 2MB max, image mimes only
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'status' => ['sometimes', 'required', 'string', 'in:active,disbanded,suspended'],
        ];
    }
}