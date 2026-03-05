<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();

            $table->enum('customer_type', ['regular', 'trade'])
                ->default('regular')
                ->index();

            $table->enum('trade_status', ['pending', 'approved', 'rejected'])
                ->nullable()
                ->index();

            $table->string('company_name')->nullable();
            $table->string('vat_number')->nullable();
            $table->string('registration_number')->nullable();

            $table->timestamp('trade_approved_at')->nullable();

            $table->foreignId('trade_approved_by_admin_id')->nullable();

            $table->foreign('trade_approved_by_admin_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete()
                ->nullOnUpdate();

            $table->timestamp('trade_rejected_at')->nullable();

            $table->foreignId('trade_rejected_by_admin_id')->nullable();

            $table->foreign('trade_rejected_by_admin_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete()
                ->nullOnUpdate();

            $table->text('trade_rejection_reason')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
