<?php
namespace App\Http\Requests\Admin;

use App\Rules\UniqueRfidAcrossTables;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTrainerRequest extends FormRequest
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
        $id = $this->route('id');

        return [
            'name'     => 'required|string|max:255',
            'email'    => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($id),
            ],
            'phone'    => 'required|numeric|min:3',
            'rfid_uid' => [
                'nullable',
                'string',
                new UniqueRfidAcrossTables('trainers'),
            ],
        ];
    }
}
