<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $names = ['Akmal', 'Farah', 'Ismail', 'Nadia', 'Zulkifli'];

        foreach ($names as $name) {
            User::create([
                'name' => $name,
                'email' => strtolower($name) . '@test.com',
                'password' => Hash::make('akmal123'),
                'email_verified_at' => now(),
            ]);
        }
    }
}