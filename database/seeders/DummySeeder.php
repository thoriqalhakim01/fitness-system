<?php
namespace Database\Seeders;

use App\Models\Member;
use App\Models\Package;
use App\Models\Point;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class DummySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name'              => 'Admin Gym',
            'email'             => 'admin@example.com',
            'password'          => bcrypt('password'),
            'email_verified_at' => now()->timezone('Asia/Jakarta'),
        ]);

        $admin->assignRole('admin');

        $trainers   = User::factory(10)->create();
        $trainerIds = [];

        foreach ($trainers as $trainer) {
            $trainer->assignRole('trainer');

            $rfid = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 10);

            $trainerRecord = $trainer->trainer()->create([
                'staff_id' => $admin->id,
                'rfid_uid' => $rfid,
                'name'     => $trainer->name,
            ]);

            $trainerIds[] = $trainerRecord->id;
        }

        foreach ($trainerIds as $trainerId) {
            $memberCount = rand(3, 5);

            $members = Member::factory($memberCount)->create([
                'trainer_id' => $trainerId,
                'staff_id'   => $admin->id,
            ]);

            foreach ($members as $member) {
                if ($member->is_member) {
                    $pointCount = rand(1, 3);

                    Point::factory($pointCount)->create([
                        'member_id' => $member->id,
                    ]);
                }
            }
        }

        $staff = User::factory()->create([
            'name'              => 'Staff Gym',
            'email'             => 'staff@example.com',
            'password'          => bcrypt('password'),
            'email_verified_at' => now()->timezone('Asia/Jakarta'),
        ]);

        $staff->assignRole('staff');

        $allMembers     = Member::all();
        $allPackages    = Package::all();
        $paymentMethods = ['cash', 'credit_card', 'bank_transfer', 'e_wallet', 'qris'];

        foreach ($allMembers as $member) {
            $transactionCount = rand(5, 8);

            for ($i = 0; $i < $transactionCount; $i++) {
                if ($member->is_member) {
                    $selectedPackage = $allPackages->random();
                } else {
                    $selectedPackage = $allPackages->where('name', 'Pay/visit')->first();
                }

                if ($selectedPackage->name === 'Custom') {
                    $amount = rand(100000, 500000);
                    $points = rand(10, 30);
                } else {
                    $amount = $selectedPackage->price;
                    $points = $selectedPackage->points;
                }

                $paymentMethod = $paymentMethods[array_rand($paymentMethods)];

                $transactionDate = now()->subDays(rand(1, 180));

                Transaction::create([
                    'staff_id'         => $admin->id,
                    'member_id'        => $member->id,
                    'package_id'       => $selectedPackage->id,
                    'transaction_date' => $transactionDate,
                    'amount'           => $amount,
                    'points'           => $points,
                    'payment_method'   => $paymentMethod,
                    'notes'            => 'Transaction for ' . $member->name . ' - ' . $selectedPackage->name . ' package',
                ]);
            }
        }
    }
}
