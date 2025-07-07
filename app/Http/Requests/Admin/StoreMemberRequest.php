<?php
namespace App\Http\Requests\Admin;

use App\Rules\UniqueRfidAcrossTables;
use Illuminate\Foundation\Http\FormRequest;

class StoreMemberRequest extends FormRequest
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
            'staff_id'          => 'nullable|exists:users,id',
            'trainer_id'        => 'nullable|exists:trainers,id',
            'name'              => 'required|string',
            'email'             => 'required|email|unique:members,email',
            'phone'             => 'required|numeric|min:3',
            'birthdate'         => 'required|date',
            'weight'            => 'nullable|numeric|min:0',
            'height'            => 'nullable|numeric|min:0',
            'registration_date' => 'required|date',
            'is_member'         => 'required|boolean',
            'rfid_uid'          => [
                'required_if:is_member,true',
                'nullable',
                new UniqueRfidAcrossTables('members'),
            ],
        ];
    }
}
