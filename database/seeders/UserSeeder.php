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
            'name'              => 'Admin BBG',
            'email'             => 'admin@bigbear.co.id',
            'password'          => bcrypt('password'),
            'email_verified_at' => now()->timezone('Asia/Jakarta'),
        ]);

        $admin->assignRole('admin');
    }
}
