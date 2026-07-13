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
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('sport_type_id')->constrained()->restrictOnDelete();
            $table->string('name');
            $table->string('format')->nullable(); // single_elim, round_robin, etc.
            $table->text('description')->nullable();
            $table->string('venue')->nullable();
            $table->string('location')->nullable();
            $table->string('visibility')->default('public');
            $table->string('invite_code')->nullable()->unique();
            $table->text('rules')->nullable();
            $table->dateTime('registration_start')->nullable();
            $table->dateTime('registration_end')->nullable();
            $table->unsignedInteger('max_participants')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('status')->default('draft'); // matches your state machine
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tournaments');
    }
};