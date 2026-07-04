class FtpUsersController < ApplicationController
  include Pagination

  include Pundit::Authorization

  before_action :authenticate_user!
  before_action :set_item, only: [:show, :update, :destroy]

  def index
    items = policy_scope(FtpUser)
    
    if params[:username].present?
      items = items.where("username ILIKE ?", "%#{params[:username]}%")
    end
    
    render_paginated(items)
  end

  def create
    @ftp_user = FtpUser.new(item_params)
    authorize @ftp_user
    
    if @ftp_user.save
      render json: @ftp_user
    else
      render json: { message: @ftp_user.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def show
    authorize @item
    render json: @item
  end

  def update
    authorize @item
    if @item.update(item_params)
      render json: @item
    else
      render json: { message: @item.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @item
    @item.destroy
    head :no_content
  end

  private

  def set_item
    @item = policy_scope(FtpUser).find(params[:id])
  end

  def item_params
    if action_name == 'update'
      params.require(:ftp_user).permit(policy(@item).permitted_attributes_for_update)
    else
      params.require(:ftp_user).permit(policy(FtpUser).permitted_attributes)
    end
  end

end
