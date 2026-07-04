class SessionController < ApplicationController

  skip_before_action :authenticate_user!, only: [:create]

  def create
    user = User.find_by(email: item_params[:email])
    if user && user.authenticate(item_params[:password])
			payload = Hash(email: user.email)
			payload[:operator] = user.hosting_owner?
			payload[:reseller] = user.reseller_owner?
			payload_signed = JsonWebToken.encode(payload)
			render json: {token: payload_signed}
    else
        render json: { errors: ['Not Authenticated'] }, status: :unauthorized
    end
  end

  private
  # Never trust parameters from the scary internet, only allow the white list through.
  def item_params
    params.require(:user).permit(:email, :password)
  end

end
