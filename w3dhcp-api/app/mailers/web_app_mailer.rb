class WebAppMailer < ApplicationMailer
  def blocked(user, web_app)
    @user = user
    @web_app = web_app
    @subject = "Веб-сайт заблоковано | Website blocked"
    mail(to: @user.email, subject: @subject, from: "tech@example.com")
  end

  def unblocked(user, web_app)
    @user = user
    @web_app = web_app
    @subject = "Веб-сайт розблоковано | Website unblocked"
    mail(to: @user.email, subject: @subject, from: "tech@example.com")
  end
end
