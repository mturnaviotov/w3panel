class FtpUserSerializer < ActiveModel::Serializer

  cache key: 'ftp_user', expired_at: 3.hours

  attributes :id, :gid, :uid, :username, :homedir, :web_app_id, :application_server

  belongs_to :customer, serializer: CustomerNameSerializer
  belongs_to :web_app

end
