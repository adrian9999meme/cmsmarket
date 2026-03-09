<?php

/**
 * Finance Domain Routes
 * Payment callbacks (wallet recharge, order completion).
 * These routes are registered at /api/... (not under v1) for payment gateway redirects.
 * Controllers: Admin\OrderController, Admin\WalletController
 *
 * Note: Payment callbacks (complete-order, complete-recharge, payment-success)
 * are kept in api.php outside v1 prefix - payment gateways expect fixed URLs.
 */
