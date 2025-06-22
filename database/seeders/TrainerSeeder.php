<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class TrainerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name'              => 'Thoriq Al Hakim',
            'email'             => 'thoriq.alhakim@example.com',
            'password'          => bcrypt('12345678'),
            'email_verified_at' => now()->timezone('Asia/Jakarta'),
        ]);

        $user->trainer()->create();

        $user->assignRole('trainer');
    }
}
