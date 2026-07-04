class ResellersController < ApplicationController

  include Pundit::Authorization

  before_action :authenticate_user!
  before_action :set_item, only: [:show, :edit, :update, :start, :stop, :suspend, :activate, :backup, :destroy]

  # GET /web_apps
  # GET /web_apps.json
  def index
    render json: policy_scope(Reseller)
  end

  # GET /web_apps/1/edit
  def show
    render json: @item
  end

  # POST /web_apps
  # POST /web_apps.json
  def create
    @item = Reseller.new(item_params)
    if @item.save
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /web_apps/1
  # PATCH/PUT /web_apps/1.json
  def update
    if @item.update(item_params)
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # DELETE /web_apps/1
  # DELETE /web_apps/1.json
  def destroy
    if @item.destroy
      render :json => {},  status: :gone
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_item
      @item = policy_scope(Reseller).find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def item_params
      params.require(:reseller).permit(policy(Reseller).permitted_attributes)
    end

end
