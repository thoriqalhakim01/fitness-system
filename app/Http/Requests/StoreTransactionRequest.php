<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'staff_id'         => 'required|exists:users,id',
            'member_id'        => 'required|exists:members,id',
            'package_id'       => 'required|exists:packages,id',
            'transaction_date' => 'required|date',
            'amount'           => 'required|numeric',
            'points'           => 'nullable|numeric',
            'payment_method'   => 'required|string|in:cash,bank_transfer,credit_card,qris,e_wallet',
            'notes'            => 'nullable|string',
        ];
    }
}
