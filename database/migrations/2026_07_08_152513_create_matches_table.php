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
        Schema::create('matches', function (Blueprint $table) {
            $table->id();

            $table->foreignId('stage_id')
                ->constrained('tournament_stages')
                ->cascadeOnDelete();

            $table->foreignId('participant_a_id')
                ->nullable()
                ->constrained('participants')
                ->nullOnDelete();

            $table->foreignId('participant_b_id')
                ->nullable()
                ->constrained('participants')
                ->nullOnDelete();

            $table->foreignId('winner_participant_id')
                ->nullable()
                ->constrained('participants')
                ->nullOnDelete();

            $table->foreignId('next_match_id')
                ->nullable()
                ->constrained('matches')
                ->nullOnDelete();

            $table->unsignedTinyInteger('next_match_slot')
                ->nullable();

            $table->unsignedInteger('round_number')
                ->default(1);

            $table->unsignedInteger('match_number')
                ->nullable();

            $table->unsignedInteger('participant_a_score')
                ->default(0);

            $table->unsignedInteger('participant_b_score')
                ->default(0);

            $table->string('venue')
                ->nullable();

            $table->timestamp('scheduled_at')
                ->nullable();

            $table->timestamp('started_at')
                ->nullable();

            $table->timestamp('ended_at')
                ->nullable();

            $table->string('status')
                ->default('Scheduled');

            $table->text('remarks')
                ->nullable();

            $table->timestamps();

            $table->index([
                'stage_id',
                'round_number'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};