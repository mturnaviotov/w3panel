class CustomersController < ApplicationController
  include Pagination

  include Pundit::Authorization

  before_action :set_item, only: [:show, :update, :balance_update, :destroy]

  # GET /Customers
  # GET /Customers.json
  def index
    items = policy_scope(Customer)
    
    if params[:name].present?
      items = items.where("name ILIKE ?", "%#{params[:name]}%")
    end
    
    render_paginated(items, each_serializer: CustomerIndexSerializer)
  end

  # GET /Customers/1
  # GET /Customers/1.json
  def show
    render json: @item
  end

  # POST /Customers
  # POST /Customers.json
  def create
    @item = Customer.new(item_params)
	@item.reseller = Reseller.first if 	item_params[:reseller] == nil
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

  def balance_update
    @item.balance_update
    render json: @item
  end

  # DELETE /Customers/1
  # DELETE /Customers/1.json
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
      @item = policy_scope(Customer).find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def item_params
      params.require(:customer).permit(policy(Customer).permitted_attributes)
    end

end
