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
        Schema::create('training_session_members', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('training_session_id')->references('id')->on('training_sessions')->onDelete('cascade');
            $table->foreignUlid('member_id')->references('id')->on('members')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_session_members');
    }
};
