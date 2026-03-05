<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TradeDiscountRequestStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_id' => 'required|exists:customers,id',

            // either store_id OR merchant_name must exist
            'store_id' => 'nullable|integer',
            'merchant_name' => 'nullable|string|max:150',

            'merchant_customer_number' => 'nullable|string|max:100',
            'requested_discount_percent' => 'required|numeric|min:0|max:100',

            'proof_files' => 'nullable|array',
            'proof_files.*' => 'file|mimes:pdf,jpg,jpeg,png|max:5120',
        ];
    }
}
