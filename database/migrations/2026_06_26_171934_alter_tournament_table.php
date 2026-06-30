<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->boolean('is_private')
                ->default(false)
                ->after('description');

            $table->string('invite_code', 12)
                ->nullable()
                ->unique()
                ->after('is_private');
                
            $table->dateTime('registration_start')
                ->nullable()
                ->after('invite_code');

            $table->dateTime('registration_deadline')
                ->nullable()
                ->after('registration_start');
                
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropColumn(['is_private', 'invite_code', 'registration_start', 'registration_deadline']);
        });
    }
};
