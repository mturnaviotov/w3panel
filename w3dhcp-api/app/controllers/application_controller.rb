class ApplicationController < ActionController::API

  before_action :authenticate_user!
  before_action :set_current_request_details

  attr_reader   :current_user

  protected
  def authenticate_user!
    unless user_id_in_token?
      render json: { errors: ['Not Authenticated'] }, status: :unauthorized
      return
    end

    @current_user = User.find_by(email: auth_token['email'])#Rails.cache.get('users:'+auth_token['email'])
    if (@current_user.nil?)
      #@current_user = User.find_by(email: auth_token['email'])
      Rails.cache.set('users:'+auth_token['email'], @current_user, ex: 1.hour)
    end
  rescue JWT::VerificationError, JWT::DecodeError
    render json: { errors: ['Not Authenticated'] }, status: :unauthorized
  end

  private

  def set_current_request_details
    Current.user = @current_user
    Current.ip_address = request.remote_ip
  end

  def http_token
    if request.headers['HTTP_AUTH_TOKEN'].present?
      request.headers['HTTP_AUTH_TOKEN'].split(' ').last
    end
  end

  def auth_token
    JsonWebToken.decode(http_token)
  end

  def user_id_in_token?
    http_token && auth_token && auth_token['email']
  end

end
