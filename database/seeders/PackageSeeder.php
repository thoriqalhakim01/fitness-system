<?php
namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'name'     => 'Custom',
                'price'    => 0,
                'points'   => 0,
                'duration' => 0,
            ],
            [
                'name'     => 'Pay/visit',
                'price'    => 50000,
                'points'   => 0,
                'duration' => 0,
            ],
            [
                'name'     => 'Gold',
                'price'    => 2000000,
                'points'   => 50,
                'duration' => 180,
            ],
            [
                'name'     => 'Silver',
                'price'    => 1800000,
                'points'   => 40,
                'duration' => 180,
            ],
        ];

        foreach ($packages as $package) {
            Package::create($package);
        }
    }
}
