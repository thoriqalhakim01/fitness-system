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
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropForeign(['member_id']);
            $table->dropColumn('member_id');

            $table->ulid('attendable_id')->after('staff_id');
            $table->string('attendable_type')->after('attendable_id');

            $table->index(['attendable_type', 'attendable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropIndex(['attendable_type', 'attendable_id']);

            $table->dropColumn(['attendable_id', 'attendable_type']);

            $table->foreignUlid('member_id')->references('id')->on('members')->onDelete('cascade');
        });
    }
};
