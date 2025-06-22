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
        Schema::create('members', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('staff_id')->nullable()->references('id')->on('staffs')->onDelete('set null');
            $table->foreignUlid('trainer_id')->nullable()->references('id')->on('trainers')->onDelete('set null');
            $table->string('rfid_uid')->nullable();
            $table->string('name');
            $table->string('avatar')->nullable();
            $table->string('email')->unique();
            $table->string('phone');
            $table->date('registration_date')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->boolean('is_member')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
