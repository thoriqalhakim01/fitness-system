<?php
namespace App\Services;

use App\Models\Member;
use App\Models\User;
use App\Notifications\MemberRegistrationNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class NotificationService
{
    public function sendMemberRegistrationNotification(Member $member, string $registeredBy)
    {
        $users = User::role(['admin', 'staff'])->get();

        Notification::send($users, new MemberRegistrationNotification($member, $registeredBy));

        Log::info('Sent member registration notification', [
            'member_id'        => $member->id,
            'registered_by'    => $registeredBy,
            'recipients_count' => $users->count(),
        ]);
    }
}
