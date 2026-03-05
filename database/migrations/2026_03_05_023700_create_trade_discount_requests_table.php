<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('trade_discount_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('customer_id')
                ->constrained('customers')
                ->cascadeOnDelete();

            // If you store merchants as "sellers" table
            $table->unsignedBigInteger('store_id')->nullable();
            $table->string('merchant_name', 150)->nullable(); // external merchant manual

            $table->string('merchant_customer_number', 100)->nullable();

            $table->decimal('requested_discount_percent', 5, 2); // e.g., 0.00 - 99.99

            $table->json('proof_files')->nullable();

            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');

            $table->timestamp('approved_at')->nullable();
            $table->unsignedBigInteger('approved_by_admin_id')->nullable();

            $table->timestamp('rejected_at')->nullable();
            $table->unsignedBigInteger('rejected_by_admin_id')->nullable();
            $table->text('rejection_reason')->nullable();

            $table->timestamps();

            // indexes for CMS filtering
            $table->index(['status']);
            $table->index(['customer_id']);
            $table->index(['store_id']);
        });

        // Optional: add FK constraints if store/admin tables are known:
        // Schema::table('trade_discount_requests', function (Blueprint $table) {
        //     $table->foreign('store_id')->references('id')->on('sellers')->nullOnDelete();
        //     $table->foreign('approved_by_admin_id')->references('id')->on('users')->nullOnDelete();
        //     $table->foreign('rejected_by_admin_id')->references('id')->on('users')->nullOnDelete();
        // });
    }

    public function down(): void
    {
        Schema::dropIfExists('trade_discount_requests');
    }
};
