<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rfid_uid'          => substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 10),
            'name'              => fake()->name(),
            'email'             => fake()->email(),
            'phone'             => '8' . fake()->numerify('##########'),
            'birthdate'         => fake()->date('Y-m-d', '1990-01-01', '2010-12-31'),
            'weight'            => fake()->randomFloat(2, 40, 100),
            'height'            => fake()->randomFloat(2, 100, 200),
            'registration_date' => fake()->date('Y-m-d', '2023-01-01', '2024-12-31'),
            'status'            => fake()->randomElement(['active', 'inactive']),
            'is_member'         => fake()->boolean(),
        ];
    }
}
