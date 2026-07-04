class BoardsController < ApplicationController

  include Pundit::Authorization

  def show
    board = Hash.new
    board[:name]    = current_user.customer.name
    board[:customer]  = current_user.customer
    board[:web_apps] = current_user.customer.web_apps.size
    board[:domains] = policy_scope(Domain).size
    board[:dns_zones] = policy_scope(DnsZone).size
    board[:orders]  = policy_scope(Order).size
    board[:ftp_users]  = policy_scope(FtpUser).size
#    board[:events]  = policy_scope(Event.active).size
    board[:customers] = policy_scope(Customer).size if current_user.reseller_owner?
    board[:subscriptions] = policy_scope(Subscription).size if current_user.reseller_owner?
    board[:domain_zones] = policy_scope(DomainZone).size if current_user.hosting_owner?
    board[:registries] = policy_scope(Registry).size if current_user.hosting_owner?
    board[:resellers] = policy_scope(Reseller).size if current_user.hosting_owner?
    board[:contacts] = policy_scope(Contact).size if current_user.hosting_owner?

    render json: board #, serializer: BoardSerializer
  end

end
