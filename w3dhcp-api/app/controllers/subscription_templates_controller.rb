class SubscriptionTemplatesController < ApplicationController

  include Pundit::Authorization

  before_action :authenticate_user!, except: [:list]
  before_action :set_item, only: [:show, :update, :destroy]

  # GET /Customers
  # GET /Customers.json
  def index
    render json: policy_scope(SubscriptionTemplate)
  end

  # GET /domain_zones/list
  # guests, list for available to check domains
  def list
    render json: SubscriptionTemplate.where(listed: true), each_serializer: SubscriptionTemplateListSerializer
  end

  # GET /Customers/1
  # GET /Customers/1.json
  def show
    render json: @item
  end

  # POST /Customers
  # POST /Customers.json
  def create
    authorize SubscriptionTemplate
    @item = SubscriptionTemplate.new(item_params)
    if @item.save

      render json: @item
    else

      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /Customers/1
  # PATCH/PUT /Customers/1.json
  def update
    if @item.update(item_params)

      render json: @item
    else

      render json: @item.errors, status: :unprocessable_entity
    end
  end


  # DELETE /Customers/1
  # DELETE /Customers/1.json
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
      @item = policy_scope(SubscriptionTemplate).find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def item_params
      params.require(:subscription_template).permit(policy(SubscriptionTemplate).permitted_attributes)
    end

end
