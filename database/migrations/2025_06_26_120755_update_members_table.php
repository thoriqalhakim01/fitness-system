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
        Schema::table('members', function (Blueprint $table) {
            $table->date('birthdate')->nullable()->after('phone');
            $table->decimal('weight', 5, 2)->nullable()->after('birthdate');
            $table->decimal('height', 5, 2)->nullable()->after('weight');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn(['birthdate', 'weight', 'height']);
        });
    }
};
