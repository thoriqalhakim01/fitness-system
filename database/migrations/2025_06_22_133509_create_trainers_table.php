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
        Schema::create('trainers', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('staff_id')->nullable()->references('id')->on('users')->onDelete('set null');
            $table->foreignUlid('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('rfid_uid')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trainers');
    }
};
