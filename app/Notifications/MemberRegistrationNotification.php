<?php
namespace App\Notifications;

use App\Models\Member;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MemberRegistrationNotification extends Notification
{
    use Queueable;

    protected $member;
    protected $registeredBy;

    public function __construct(Member $member, string $registeredBy)
    {
        $this->member       = $member;
        $this->registeredBy = $registeredBy;
    }

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type'          => 'member_registration',
            'title'         => 'New Member Registration',
            'message'       => $this->getMessage(),
            'member_id'     => $this->member->id,
            'member_name'   => $this->member->name,
            'registered_by' => $this->registeredBy,
            'action_url'    => route('admin.members.show', $this->member->id),
            'action_label'  => 'View Member',
        ];
    }

    protected function getMessage()
    {
        $message = 'New member ' . $this->member->name . ' registered';

        if ($this->registeredBy !== 'independently') {
            $message .= " through trainer {$this->registeredBy}";
        } else {
            $message .= " independently";
        }

        return $message;
    }
}
