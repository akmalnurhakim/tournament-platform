<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTournamentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        \Log::info('Store tournament authorize check', ['user' => $this->user()?->id]);
        return true; //authenticated users can create tournament, ownershhp handled in controller
    }
    
    /**
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        return [
            'sport_type_id' => ['required', 'exists:sport_types,id'],
            'name' => ['required', 'string', 'max:255'],
            'format' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'venue' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'visibility' => ['required', 'in:public,private'],
            'rules' => ['nullable', 'string'],
            'registration_start' => ['nullable', 'date'],
            'registration_end' => ['nullable', 'date', 'after_or_equal:registration_start'],
            'max_participants' => ['nullable', 'integer', 'min:2'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'banner' => ['nullable', 'image', 'max:2048'], // 2MB limit, image mimes only
        ];
    }
}
