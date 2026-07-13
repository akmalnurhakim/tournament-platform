<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGuestRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('addGuest', $this->route('tournament'));
    }

    public function rules(): array
    {
        return [
            'guest_name' => ['required', 'string', 'max:255'],
            'guest_contact' => ['nullable', 'string', 'max:255'],
        ];
    }
}