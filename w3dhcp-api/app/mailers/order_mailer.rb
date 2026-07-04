class OrderMailer < ApplicationMailer

  def order_approved(user, order)
    @user = user
    @order = order
    @subject = "Order #{order.number} approved"
    mail(to: @user.email, subject: @subject)
  end

  def order_processed(user, order, failed)
    @user   = user
    @order  = order
    @failed = failed
    @subject = "Order #{order.number} processed#{' with errors' if !failed.empty?}"
    mail(to: @user.email, subject: @subject)
  end

end
