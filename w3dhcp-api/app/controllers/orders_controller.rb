class OrdersController < ApplicationController
  include Pagination

  include Pundit::Authorization

  before_action :authenticate_user!

  before_action :set_item, only: [:show, :destroy, :approve, :pdf]

  # GET /orders
  # GET /orders.json
  def index
    items = policy_scope(Order)
    
    if params[:number].present?
      items = items.where("CAST(number AS TEXT) LIKE ?", "%#{params[:number]}%")
    end
    
    render_paginated(items, each_serializer: OrderBriefSerializer)
  end

  # GET /orders/1
  # GET /orders/1.json
  def show
    authorize @item
    render json: @item
  end

  def pdf
   srcfile = ERB.new(File.read(Rails.root.join("app/views/orders/order.pdf.erb"))).result(binding)
   Base64.encode64(WickedPdf.new.pdf_from_string(srcfile, encoding: "UTF-8"))
  end

  # POST /orders
  # POST /orders.json
  def create
    @item = Order.new(item_params)
#    binding.pry
    @item.to = current_user.customer.contacts.first.whois
#(:zipcode, :country, :name_idn, :organization_idn,
#      :address_idn, :city_idn, :region_idn, :voice, :email)
    @item.from = current_user.customer.reseller.owner.contacts.first.whois
#.slice(:zipcode, :country, :name_idn, :organization_idn, :address_idn,
#      :city_idn, :region_idn, :voice, :email, :private)
    @item.customer = current_user.customer
    @item.reseller = current_user.customer.reseller
#    @item.initiator = current_user.slice(:id, :email)
#    @item.billing_from = current_user.client.reseller.owner.bank_details
#    @item.billing_to = current_user.client.bank_details
    items_list = item_params[:items].map {|n| n.slice(:name, :kind, :operation, :name_ascii)}
    @item.items = items_list.map do |obj|
      item = obj.to_h
      if (item['kind'].eql?('domain') && item['operation'].eql?('register'))
        zone = Domain.new(name: obj[:name]).domain_zone
        zone_name = zone ? zone.name : ""
        # old more accurate seach
        # item[:price] = Domain.new(name: obj[:name]).domain_zone.zone_prices[0].register
        # item[:price] = SubscriptionTemplate.find_by(name: Domain.new(name: obj[:name]).domain_zone.name).register

        template = SubscriptionTemplate.where("name LIKE ?", "#{zone_name}%").first
        item['price'] = template.present? ? template.register : 0
      end
      item
    end

    @item.summ = @item.items.map {|s| (s['price'] || s[:price] || 0).to_f }.sum
    @item.date = DateTime.now
    if @item.save

      render json: @item
    else

      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def approve
    approver_user = current_user.slice(:id, :email, :customer_id)
    approver_user[:name] = current_user.customer.name
    @item.approve(approver_user)
    if @item.errors.empty?

      render json: @item
    else

      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def destroy
    if @item.destroy

      render json: '', status: :no_content
    else

      render json: @item.errors, status: :unprocessable_entity
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_item
    @item = policy_scope(Order).find(params[:id])
#    authorize @item if @item
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def item_params
    params.require(:order).permit(policy(Order).permitted_attributes)
  end

end
