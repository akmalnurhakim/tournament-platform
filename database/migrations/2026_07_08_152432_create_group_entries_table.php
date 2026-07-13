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
        Schema::create('group_entries', function (Blueprint $table) {
            $table->id();

            $table->foreignId('stage_id')
                ->constrained('tournament_stages')
                ->cascadeOnDelete();

            $table->foreignId('participant_id')
                ->constrained('participants')
                ->cascadeOnDelete();

            $table->string('group_label');

            $table->timestamps();

            // A participant can only belong to one group within a stage
            $table->unique([
                'stage_id',
                'participant_id'
            ]);

            // Helpful index when displaying a group
            $table->index([
                'stage_id',
                'group_label'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_entries');
    }
};