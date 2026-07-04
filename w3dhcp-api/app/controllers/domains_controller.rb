class DomainsController < ApplicationController
  include Pagination

  include Pundit::Authorization
  include Normalize
  include EppCommands
  include GroupEppCommands

  include ActionView::Helpers::SanitizeHelper

  before_action :authenticate_user!
  before_action :set_item, only: [:update_comment, :epp_update_info, :epp_delete, :epp_renew, :epp_hold,
                  :epp_status, :epp_unhold, :epp_restore, :show, :destroy, :epp_update_ns, :update]
  before_action :set_items, only: [:group_epp_update_info, :group_epp_delete, :group_epp_renew, :group_epp_hold,
                  :group_epp_status, :group_epp_unhold, :group_epp_restore, :group_epp_update_ns]

  before_action :epp_proccessing, only: [:epp_update_info, :epp_update_ns, :epp_delete, :epp_restore, :epp_hold, :epp_status, :group_epp_status, :epp_unhold, :epp_renew]

  def index
  domain = params[:scope] == 'near_expire' ? Domain.near_expire : Domain
  items = policy_scope(domain)
  
  if params[:name].present?
    items = items.where("name ILIKE ?", "%#{params[:name]}%")
  end
  
  render_paginated(items)
end

  def create
    @item = Domain.new(item_params_create)
	sub = Subscription.new(name: @item.name)
	sub.kind = 'domain'
	sub.expiration = @item.date_expire
	sub.customer = @item.customer
	sub.subscription_template = SubscriptionTemplate.find_by(name: @item.domain_zone.name)
	sub.save
	@item.subscription = sub
    @item.epp_update_info
    render json: @item
  end

  def show
    render json: @item
  end

  def update
    if @item.update(item_params)
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def count
    authorize Domain
    @json = { all: policy_scope(Domain).size, near_expire: policy_scope(Domain.near_expire).size }
    render json: @json
  end

  def update_comment
    if current_user.reseller_owner?
      @item.update(comment_reseller_date: DateTime.now, comment_reseller_text: item_params[:comment_text])
    else
      @item.update(comment_owner_date: DateTime.now, comment_owner_text: item_params[:comment_text])
    end

    render json: @item
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_item
    @item = policy_scope(Domain).find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def item_params
    params.require(:domain).permit(policy(Domain).permitted_attributes)
  end

  def item_params_create
    params.require(:domain).permit(policy(Domain).permitted_attributes_for_create)
  end

  def group_item_params
    params.require(:domain).permit(policy(Domain).permitted_attributes_for_group)
  end

  def group_item_status
    params.require(:domain).permit(policy(Domain).permitted_attributes_for_group_status)
  end

end
