<?php

namespace App\Http\Controllers;

use App\Models\SportType;
use Illuminate\Database\Eloquent\Collection;

class SportTypeController extends Controller
{
    /**
     * @return Collection<int, SportType>
     */
    public function index(): Collection
    {
        return SportType::all();
    }

    public function show(int $id): SportType
    {
        return SportType::findOrFail($id);
    }
}