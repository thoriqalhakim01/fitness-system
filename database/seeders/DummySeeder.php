<?php
namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Member;
use App\Models\Package;
use App\Models\Point;
use App\Models\Trainer;
use App\Models\TrainingSession;
use App\Models\TrainingSessionMember;
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

        $allTrainers = Trainer::all();

        $memberAttendanceCount  = [];
        $trainerAttendanceCount = [];

        foreach ($allMembers as $member) {
            $memberAttendanceCount[$member->id] = 0;
        }

        foreach ($allTrainers as $trainer) {
            $trainerAttendanceCount[$trainer->id] = 0;
        }

        $totalSessions = 100;

        for ($i = 0; $i < $totalSessions; $i++) {
            $selectedTrainer = $allTrainers->random();

            $sessionTimestamp = now()->subDays(rand(1, 180))
                ->setTime(rand(6, 22), rand(0, 59), rand(0, 59));

            $trainingSession = TrainingSession::create([
                'staff_id'        => $admin->id,
                'trainer_id'      => $selectedTrainer->id,
                'entry_timestamp' => $sessionTimestamp,
            ]);

            Attendance::create([
                'staff_id'        => $admin->id,
                'attendable_id'   => $selectedTrainer->id,
                'attendable_type' => Trainer::class,
                'entry_timestamp' => $sessionTimestamp,
            ]);

            $trainerAttendanceCount[$selectedTrainer->id]++;

            $sessionMemberCount = rand(1, 5);

            $availableMembers = $allMembers->filter(function ($member) use ($memberAttendanceCount) {
                return $memberAttendanceCount[$member->id] < 10;
            });

            if ($availableMembers->count() < $sessionMemberCount) {
                $availableMembers = $allMembers;
            }

            $selectedMembers = $availableMembers->random(min($sessionMemberCount, $availableMembers->count()));

            foreach ($selectedMembers as $member) {
                TrainingSessionMember::create([
                    'training_session_id' => $trainingSession->id,
                    'member_id'           => $member->id,
                ]);

                Attendance::create([
                    'staff_id'        => $admin->id,
                    'attendable_id'   => $member->id,
                    'attendable_type' => Member::class,
                    'entry_timestamp' => $sessionTimestamp->copy()->addMinutes(rand(0, 10)),
                ]);

                $memberAttendanceCount[$member->id]++;
            }
        }

        foreach ($allMembers as $member) {
            $currentCount = $memberAttendanceCount[$member->id];

            if ($currentCount < 10) {
                $needed = 10 - $currentCount;

                for ($j = 0; $j < $needed; $j++) {
                    $selectedTrainer = $allTrainers->random();

                    $sessionTimestamp = now()->subDays(rand(1, 180))
                        ->setTime(rand(6, 22), rand(0, 59), rand(0, 59));

                    $trainingSession = TrainingSession::create([
                        'staff_id'        => $admin->id,
                        'trainer_id'      => $selectedTrainer->id,
                        'entry_timestamp' => $sessionTimestamp,
                    ]);

                    if ($trainerAttendanceCount[$selectedTrainer->id] < 10) {
                        Attendance::create([
                            'staff_id'        => $admin->id,
                            'attendable_id'   => $selectedTrainer->id,
                            'attendable_type' => Trainer::class,
                            'entry_timestamp' => $sessionTimestamp,
                        ]);
                        $trainerAttendanceCount[$selectedTrainer->id]++;
                    }

                    TrainingSessionMember::create([
                        'training_session_id' => $trainingSession->id,
                        'member_id'           => $member->id,
                    ]);

                    Attendance::create([
                        'staff_id'        => $admin->id,
                        'attendable_id'   => $member->id,
                        'attendable_type' => Member::class,
                        'entry_timestamp' => $sessionTimestamp->copy()->addMinutes(rand(0, 10)),
                    ]);
                }
            }
        }

        foreach ($allTrainers as $trainer) {
            $currentCount = $trainerAttendanceCount[$trainer->id];

            if ($currentCount < 10) {
                $needed = 10 - $currentCount;

                for ($j = 0; $j < $needed; $j++) {
                    $sessionTimestamp = now()->subDays(rand(1, 180))
                        ->setTime(rand(6, 22), rand(0, 59), rand(0, 59));

                    $trainingSession = TrainingSession::create([
                        'staff_id'        => $admin->id,
                        'trainer_id'      => $trainer->id,
                        'entry_timestamp' => $sessionTimestamp,
                    ]);

                    Attendance::create([
                        'staff_id'        => $admin->id,
                        'attendable_id'   => $trainer->id,
                        'attendable_type' => Trainer::class,
                        'entry_timestamp' => $sessionTimestamp,
                    ]);

                    $sessionMembers = $allMembers->random(rand(1, 3));

                    foreach ($sessionMembers as $member) {
                        TrainingSessionMember::create([
                            'training_session_id' => $trainingSession->id,
                            'member_id'           => $member->id,
                        ]);

                        Attendance::create([
                            'staff_id'        => $admin->id,
                            'attendable_id'   => $member->id,
                            'attendable_type' => Member::class,
                            'entry_timestamp' => $sessionTimestamp->copy()->addMinutes(rand(0, 10)),
                        ]);
                    }
                }
            }
        }
    }
}
