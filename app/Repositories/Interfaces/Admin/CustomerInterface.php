<?php

namespace App\Repositories\Interfaces\Admin;

interface CustomerInterface
{
    /**
     * query
     */
    public function query();

    /**
     * Get all customers
     */
    public function all();

    /**
     * Paginated customers list
     */
    public function paginate($limit);

    /**
     * Get single customer by ID
     */
    public function get($id);

    /**
     * Create new customer
     */
    public function store($request);

    /**
     * Update existing customer
     */
    public function update($request);

    /**
     * Delete customer
     */
    public function delete($id);

    /**
     * Get customers by type (regular / trade)
     */
    public function getByType($type);

    /**
     * Get pending trade customers
     */
    public function getPendingTrade();

    /**
     * Approve trade customer
     */
    public function approveTrade($id, $adminId);

    /**
     * Reject trade customer
     */
    public function rejectTrade($id, $adminId, $reason);

    /**
     * Get customer by user ID
     */
    public function getByUser($userId);

    /**
     * Search customers (name/email/company)
     */
    public function search($keyword, $paginate = null);
}