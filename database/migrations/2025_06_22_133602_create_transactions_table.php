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
        Schema::create('transactions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('staff_id')->nullable()->references('id')->on('users')->onDelete('set null');
            $table->foreignUlid('member_id')->references('id')->on('members')->onDelete('cascade');
            $table->foreignUlid('package_id')->nullable()->references('id')->on('packages')->onDelete('set null');
            $table->timestamp('transaction_date');
            $table->unsignedInteger('amount')->nullable();
            $table->unsignedInteger('points')->nullable();
            $table->string('payment_method')->comment('cash,credit_card,bank_transfer,e_wallet,qris');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
