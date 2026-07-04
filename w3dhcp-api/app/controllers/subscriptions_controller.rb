class SubscriptionsController < ApplicationController
  include Pagination

  include Pundit::Authorization
  # GET /web_apps
  # GET /web_apps.json
  def index
    items = policy_scope(Subscription)
    
    if params[:name].present?
      items = items.where("name ILIKE ?", "%#{params[:name]}%")
    end
    
    render_paginated(items)
  end

  def show
#    render json: #current_user.customer.web_apps
  end

  def create
  end

  def update
  end

  def delete
  end
end
