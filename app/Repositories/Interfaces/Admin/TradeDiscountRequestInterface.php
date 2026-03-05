<?php

namespace App\Repositories\Interfaces\Admin;

interface TradeDiscountRequestInterface
{
    public function query();

    public function all();

    public function paginate($limit);

    public function get($id);

    public function store($request);

    public function update($request, $id);

    public function delete($id);

    public function approve($id, $adminId);

    public function reject($id, $adminId, $reason);

    public function filter($request);
}