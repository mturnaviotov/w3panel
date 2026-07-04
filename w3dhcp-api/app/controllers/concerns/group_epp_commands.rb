module GroupEppCommands

  include EppCommands

  def set_items
    @items = []
    group_item_params[:id].each do |domain|
      next if Domain.find_by(id: domain).nil?
      @items << Domain.find_by(id: domain)
    end
  end

  def group_epp_status
    @newitems = []
    removelist =  group_item_status[:options][:statuslist].to_hash.map{ |k,v| v.eql?(false) ? k : nil }.compact
    addlist    =  group_item_status[:options][:statuslist].to_hash.map{ |k,v| v.eql?(true) ? k : nil }.compact
    @items.each do |item|
      item.epp_status_rem(["clientUpdateProhibited"], current_user, request.remote_ip) if item.status.include?("clientUpdateProhibited")
      item.epp_status_rem(removelist, current_user, request.remote_ip) if !removelist.empty?
      item.epp_status_add(addlist, current_user, request.remote_ip) if !addlist.empty?
      @newitems.push(item)
    end
    render json: @newitems
  end

  def group_epp_update_info
    @newitems = []
    @items.each do |item|
      old_item = item.to_hash
      begin
        item.epp_update_info
        @newitems.push(item)

      rescue => e
        code,message = e.message.split(',')
        case code
          when '2303'
            Rails.cache.del(Domain.find_by(name: item.name).cache_key)

            item.destroy
            old_item[:deleted] = true
            @newitems.push(old_item)
        end
      end
    end
    render json: @newitems
  end


  def group_epp_hold
    @newitems = []
    @items.each do |item|
      item.epp_hold(current_user, request.remote_ip)
      @newitems.push(item)
    end
    render json: @newitems
  end

  def group_epp_unhold
    @newitems = []
    @items.each do |item|
      item.epp_unhold(current_user, request.remote_ip)
      @newitems.push(item)
    end
    render json: @newitems
  end

  def group_epp_renew
    @newitems = []
    @items.each do |item|
      item.epp_renew(group_item_params[:options][:renew_years], current_user, request.remote_ip)
      @newitems.push(item)
    end
    render json: @newitems
  end

  def group_epp_delete
    @newitems = []
    @items.each do |item|
      item.epp_delete(current_user, request.remote_ip)
      @newitems.push(item)
    end
    render json: @newitems
  end

  def group_epp_restore
    @newitems = []
    @items.each do |item|
      item.epp_restore(current_user, request.remote_ip)
      @newitems.push(item)
    end
    render json: @newitems
  end

end
