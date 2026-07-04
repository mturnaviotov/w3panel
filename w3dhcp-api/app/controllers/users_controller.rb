class UsersController < ApplicationController
  include Pagination

	include Pundit::Authorization

  before_action :authenticate_user!, except: [:register]
  before_action :set_item, only: [:show, :update, :destroy]

  def index
    items = policy_scope(User)
    
    if params[:email].present?
      items = items.where("email ILIKE ?", "%#{params[:email]}%")
    end
    
    render_paginated(items)
  end

  def create
    @item = User.new(item_params)
    if @item.save
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def register
    #  name: '', customer_name: '', voice: '', email: '', password: '', corporate: false
	item = item_register_params
	customer_name = item[:corporate] ? item[:customer_name] : item[:name]
	customer = Customer.create(name: customer_name, corporate: item[:corporate], reseller: Reseller.first)
	contact  = Contact.create(name: item[:name], customer: customer, email: item[:email], voice: item[:voice])
    user     = User.create(email: item[:email], password: item[:password], active: true, customer: customer)
	if (customer && contact && user)
  	  UserMailer.registration(user, contact, customer).deliver_later
	  render json: '', status: :no_content
	else
	  render json: '', status: :unprocessable_entity
	end
  end

  def show
    render json: @item
  end

  # private
  # Never trust parameters from the scary internet, only allow the white list through.

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_item
    @item = policy_scope(User).find(params[:id])
  end

  def item_params
    params.require(:user).permit(policy(User).permitted_attributes)
  end

  def item_register_params
    params.require(:user).permit(policy(User).permitted_register_attributes)
  end

end
