class IpAddressesController < ApplicationController
  def index
    render json: IpAddress.all
  end

  def create
    @ip_address = IpAddress.new(ip_address_params)
    if @ip_address.save
      render json: @ip_address
    else
      render json: { message: @ip_address.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def update
    @ip_address = IpAddress.find(params[:id])
    if @ip_address.update(ip_address_params)
      render json: @ip_address
    else
      render json: { message: @ip_address.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def destroy
    @ip_address = IpAddress.find(params[:id])
    @ip_address.destroy
    head :no_content
  end

  private

  def ip_address_params
    params.require(:ip_address).permit(:ip, :shared, :default)
  end
end
