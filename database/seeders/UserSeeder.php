<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name'              => 'Admin Gym',
            'email'             => 'admin@example.com',
            'password'          => bcrypt('12345678'),
            'email_verified_at' => now()->timezone('Asia/Jakarta'),
        ]);

        $admin->assignRole('admin');
    }
}
