class DomainMailer < ApplicationMailer

  def domain_expires(user, domain)
    @user = user
    @domain = domain
    @subject = "Domain #{domain.name} expired at #{domain.date_expire}"
    mail(to: @user.email, subject: @subject)
  end

  def domains_expires_month(user, domains)
    @user = user
    @domains = domains.sort { |a,b| a.date_expire <=> b.date_expire }
    @subject = "Your #{@domains.count} domains expired in this month"
    mail(to: @user.email, subject: @subject)
  end

  def domain_renew_succesfull(user, domain)
    @user = user
    @domain = domain
    @subject = "Your #{@domain.name} domain succesfully renewed"
    mail(to: @user.email, subject: @subject)
  end

  def domain_delete_succesfull(user, domain)
    @user = user
    @domain = domain
    @subject = "Your #{@domain.name} domain succesfully deleted"
    mail(to: @user.email, subject: @subject)
  end

  def domain_update_ns_succesfull(user, domain)
    @user = user
    @domain = domain
    @subject = "Your #{@domain.name} domain NS succesfully updated"
    mail(to: @user.email, subject: @subject)
  end

end
