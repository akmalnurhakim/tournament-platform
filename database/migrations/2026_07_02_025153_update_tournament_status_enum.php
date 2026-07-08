<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: add a temporary string column
        Schema::table('tournaments', function (Blueprint $table) {
            $table->string('status_new')->default('draft')->after('status');
        });

        // Step 2: copy existing data, mapping old → new vocabulary
        DB::table('tournaments')->update([
            'status_new' => DB::raw("
                CASE status
                    WHEN 'upcoming'  THEN 'draft'
                    WHEN 'ongoing'   THEN 'in_progress'
                    WHEN 'completed' THEN 'completed'
                    ELSE 'draft'
                END
            "),
        ]);

        // Step 3: drop the old enum, rename the new column
        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('tournaments', function (Blueprint $table) {
            $table->renameColumn('status_new', 'status');
        });
    }

    public function down(): void
    {
        Schema::table('tournaments', function (Blueprint $table) {
            $table->string('status_old')->default('upcoming')->after('status');
        });

        DB::table('tournaments')->update([
            'status_old' => DB::raw("
                CASE status
                    WHEN 'draft'        THEN 'upcoming'
                    WHEN 'open'         THEN 'upcoming'
                    WHEN 'closed'       THEN 'upcoming'
                    WHEN 'in_progress'  THEN 'ongoing'
                    WHEN 'completed'    THEN 'completed'
                    ELSE 'upcoming'
                END
            "),
        ]);

        Schema::table('tournaments', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('tournaments', function (Blueprint $table) {
            $table->renameColumn('status_old', 'status');
        });
    }
};
