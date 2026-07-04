class WebAppsController < ApplicationController
  include Pagination

  include Pundit::Authorization

  # GET /web_apps
  # GET /web_apps.json
  def index
    items = policy_scope(WebApp)
    
    if params[:name].present?
      items = items.where("name ILIKE ?", "%#{params[:name]}%")
    end
    
    render_paginated(items)
  end

  def show
#    render json: #current_user.customer.web_apps
  end

  def create
    @web_app = WebApp.new(web_app_params)
    if @web_app.save
      render json: @web_app
    else
      render json: { message: @web_app.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def update
    @web_app = WebApp.find(params[:id])
    if @web_app.update(web_app_params)
      render json: @web_app
    else
      render json: { message: @web_app.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def destroy
    @web_app = WebApp.find(params[:id])
    authorize @web_app
    @web_app.destroy
    head :no_content
  end

  def start
    @web_app = WebApp.find(params[:id])
    authorize @web_app
    
    if !@web_app.active
      return render json: { message: "Cannot start a blocked web app" }, status: :forbidden
    end
    
    # Stub: remote docker start
    @web_app.update(container_id: SecureRandom.hex(12))
    render json: @web_app
  end

  def stop
    @web_app = WebApp.find(params[:id])
    authorize @web_app
    
    # Stub: remote docker stop
    @web_app.update(container_id: "")
    render json: @web_app
  end

  def restart
    @web_app = WebApp.find(params[:id])
    authorize @web_app
    
    if !@web_app.active
      return render json: { message: "Cannot restart a blocked web app" }, status: :forbidden
    end
    
    # Stub: remote docker restart
    @web_app.update(container_id: SecureRandom.hex(12))
    render json: @web_app
  end

  def block
    @web_app = WebApp.find(params[:id])
    authorize @web_app
    
    @web_app.update(active: false, container_id: "")
    WebAppMailer.blocked(current_user, @web_app).deliver_now
    render json: @web_app
  end

  def unblock
    @web_app = WebApp.find(params[:id])
    authorize @web_app
    
    @web_app.update(active: true)
    WebAppMailer.unblocked(current_user, @web_app).deliver_now
    render json: @web_app
  end

  private

  def web_app_params
    params.require(:web_app).permit(:name, :app_type, :customer_id, :ip_address_id, :active)
  end
end
