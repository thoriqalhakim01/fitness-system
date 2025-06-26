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
        Schema::create('member_logs', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('member_id')->references('id')->on('members')->onDelete('cascade');
            $table->foreignUlid('trainer_id')->references('id')->on('trainers')->onDelete('cascade');
            $table->date('log_date');
            $table->text('notes')->nullable();
            $table->json('exercises')->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->text('progess_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member_logs');
    }
};
