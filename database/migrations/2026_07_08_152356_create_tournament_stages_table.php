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
        Schema::create('tournament_stages', function (Blueprint $table) {
            $table->id();

            $table->foreignId('tournament_id')
                ->constrained('tournaments')
                ->cascadeOnDelete();

            $table->string('name');

            $table->string('stage_type');

            $table->unsignedInteger('stage_order');

            $table->unsignedInteger('group_count')
                ->nullable();

            $table->unsignedInteger('advance_count')
                ->nullable();

            $table->unsignedInteger('points_win')
                ->default(3);

            $table->unsignedInteger('points_draw')
                ->default(1);

            $table->unsignedInteger('points_loss')
                ->default(0);

            $table->timestamps();

            // Stage order must be unique inside a tournament
            $table->unique([
                'tournament_id',
                'stage_order'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tournament_stages');
    }
};