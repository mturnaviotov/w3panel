class WebAppSerializer < ActiveModel::Serializer

  cache key: 'web_app', expired_at: 3.hours

  attributes :id, :name, :active, :app_type, :system_uid, :web_root, :redirect_to, :application_server, :ip_int, :ip_ext, :container_id, 
		:image_name, :quota_cpu, :quota_mem, :ssl, :ip_address_id

  belongs_to :customer, serializer: CustomerNameSerializer
#  belongs_to :ip_address, serializer: IpAddressSerializer

end
