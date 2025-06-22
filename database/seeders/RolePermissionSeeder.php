<?php
namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name'       => 'admin',
                'guard_name' => 'web',
            ],
            [
                'name'       => 'staff',
                'guard_name' => 'web',
            ],
            [
                'name'       => 'trainer',
                'guard_name' => 'web',
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
