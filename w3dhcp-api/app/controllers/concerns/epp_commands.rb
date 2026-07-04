module EppCommands

  require 'mepp'
  require 'yaml'

  def epp_status_set
    render json: @item
  end

  def epp_update_info
    operation_status = :ok
    # begin
    #   @item.epp_update_info
    # rescue => e
    #   code,message = e.message.split(',')
    #   case code
    #     when '2303'
    #       Rails.cache.delete(Domain.find_by(name: @item.name).cache_key)
    #       result = @item.to_hash.merge!(deleted: true)
    #       @item.destroy
    #       @item = result
    #       operation_status = :gone
    #   end
    # end
    render json: @item, status: operation_status
  end

  def epp_hold
    # @item.epp_hold(current_user, request.remote_ip)
    render json: @item
  end

  def epp_unhold
    # @item.epp_unhold(current_user, request.remote_ip)
    render json: @item
  end

  def epp_renew
    # @item.epp_renew(item_params[:renew_years], current_user, request.remote_ip)
    # @item.registry.balance_update
    # DomainMailer.domain_renew_succesfull(current_user, @item).deliver_later
    render json: @item
  end

  def epp_delete
    # @item.epp_delete(current_user, request.remote_ip)
    # DomainMailer.domain_delete_succesfull(current_user, @item).deliver_later
    render json: @item
  end

  def epp_restore
    # @item.epp_restore(current_user, request.remote_ip)
    # @item.registry.balance_update
    render json: @item
  end

  def epp_update_ns
    # @item.epp_update_ns(item_params[:nameservers], current_user, request.remote_ip)
    # DomainMailer.domain_update_ns_succesfull(current_user, @item).deliver_later
    render json: @item
  end

  private
  def epp_proccessing
    # config = YAML.load_file('/opt/w3dhcp/config.yml')
    # @epp_clients = {}
    # config[:providers].keys.each {|c| @epp_clients[c.to_sym] = Mepp::Client.new(config[:providers][c]) }
  end

end
