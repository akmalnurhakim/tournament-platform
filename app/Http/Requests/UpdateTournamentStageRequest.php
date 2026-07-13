<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTournamentStageRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var \App\Models\Tournament $tournament */
        $tournament = $this->route('tournament');

        return $this->user()->can('update', $tournament)
            && $tournament->status === 'draft';
    }

    /**
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        return [
            'stage_type' => ['required', 'in:group,knockout,round_robin'],
            'name' => ['required', 'string', 'max:255'],
            'stage_order' => ['required', 'integer', 'min:1'],
            'group_count' => ['nullable', 'integer', 'min:1', 'required_if:stage_type,group'],
            'advance_count' => ['nullable', 'integer', 'min:1'],
            'points_win' => ['nullable', 'integer', 'min:0'],
            'points_draw' => ['nullable', 'integer', 'min:0'],
            'points_loss' => ['nullable', 'integer', 'min:0'],
        ];
    }
}