class DomainZonesController < ApplicationController
  include Pagination

  include Pundit::Authorization

  before_action :authenticate_user!
  before_action :set_item, only: [:show, :update, :destroy]

  # GET /domain_zones
  # GET /domain_zones.json
  def index
    items = policy_scope(DomainZone)
    
    if params[:name].present?
      items = items.where("name ILIKE ?", "%#{params[:name]}%")
    end
    
    render_paginated(items)
  end


  # GET /domain_zones/1
  # GET /domain_zones/1.json
  def show
    render json: @item
  end

  # POST /domain_zones
  # POST /domain_zones.json
  def create
    @item = DomainZone.new(item_params)
    #authorize @item
    if @item.save
			puts @item

      render json: @item
    else

      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /domain_zones/1
  # PATCH/PUT /domain_zones/1.json
  def update
    if @item.update(item_params)

      render json: @item
    else

      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # DELETE /domain_zones/1
  # DELETE /domain_zones/1.json
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
      @item = policy_scope(DomainZone).find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def item_params
      params.require(:domain_zone).permit(policy(DomainZone).permitted_attributes)
    end

end
