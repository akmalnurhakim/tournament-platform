<?php

namespace App\Http\Controllers;

use App\Models\SportType;
use Illuminate\Http\Request;

class SportTypeController extends Controller
{
    public function index()
    {
        return SportType::all();
    }


    public function show($id)
    {
        return SportType::findOrFail($id);
    }
}