class RegistriesController < ApplicationController

  include Pundit::Authorization

  before_action :authenticate_user!
  before_action :set_item, only: [:show, :update, :balance_update, :destroy]

  # GET /registrys
  # GET /registrys.json
  def index
    render json: policy_scope(Registry)
  end

  # GET /registrys/1
  # GET /registrys/1.json
  def show
    render json: @item
  end

  # POST /registrys
  # POST /registrys.json
  def create
    authorize Registry
    @item = Registry.new(item_params)
    if @item.save

      render json: @item
    else

      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /registrys/1
  # PATCH/PUT /registrys/1.json
  def update
    if @item.update(item_params)

      render json: @item
    else

      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def balance_update
    @item.balance_update
    render json: @item
  end

  # DELETE /registrys/1
  # DELETE /registrys/1.json
  def destroy
    if @item.destroy

     render json: @item
    else

      render json: @item.errors, status: :unprocessable_entity
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_item
      @item = policy_scope(Registry).find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def item_params
      params.require(:registry).permit(policy(Registry).permitted_attributes)
    end

end
