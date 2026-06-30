<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Any authenticated user can create a team.
        // Authorization for update/delete (only the captain) lives in TeamPolicy.
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'sport_type_id' => ['required', 'integer', 'exists:sport_types,id'],
            'logo' => ['nullable', 'image', 'max:2048'], // 2MB max, image mimes only
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}