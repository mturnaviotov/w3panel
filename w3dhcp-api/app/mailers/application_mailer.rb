class ApplicationMailer < ActionMailer::Base

  default     from: "'Notification system' <admin@example.com>",
               bcc: '<admin@example.com>,',
          reply_to: 'support@example.com'

  layout 'mailer'
end
