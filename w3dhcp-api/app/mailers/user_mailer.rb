class UserMailer < ApplicationMailer

  def registration(user, contact, customer)
    @user = user
	@contact = contact
	@customer = customer
    @subject = "Реєстрація успішна | Registation successfull"
    mail(to: @user.email, subject: @subject)
  end

end
