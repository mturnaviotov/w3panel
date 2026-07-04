class JsonWebToken
  def self.encode(payload)
    JWT.encode payload, Rails.application.secret_key_base, 'HS512'
  end

  def self.decode(token)
    (JWT.decode(token, Rails.application.secret_key_base, true, { :algorithm => 'HS512' }))[0]
  rescue
    nil
  end
end
