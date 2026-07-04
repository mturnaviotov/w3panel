class DnsZonesController < ApplicationController
  include Pagination

  include Pundit::Authorization

  before_action :authenticate_user!
  before_action :set_item, only: [:show, :update, :axfr_retrieve, :notify, :destroy]

  def index
    items = policy_scope(DnsZone)
    
    if params[:name].present?
      items = items.where("name ILIKE ?", "%#{params[:name]}%")
    end
    
    render_paginated(items, each_serializer: DnsZoneShortSerializer)
  end

  def create
    @item = DnsZone.new(item_params)
    @item.masters = item_params[:masters]
    @item.nameservers = item_params[:nameservers]
		if (@item.customer.nil?)
			@item.customer = @current_user.customer
		end
    if @item.save
	    @item.reload_zone
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @item
  end

  def update
    if @item.update(item_params)
      @item.reload_zone
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def axfr_retrieve
    @item.axfr_retrieve
  end

  def notify
    @item.notify
  end

  def destroy
   if @item.destroy
      render :json => {}, status: :gone
   else
      render json: @item.errors, status: :unprocessable_entity
   end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_item
    @item = policy_scope(DnsZone).find(params[:zone_id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def item_params
    params.require(:dns_zone).permit(policy(DnsZone).permitted_attributes)
  end

end
