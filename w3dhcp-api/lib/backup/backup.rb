units = ['reseller', 'customer',  'user', 'contact', 'ip_address', 'web_app', 'dns_zone', 'dns_record', 'registry', 'domain_zone', 'subscription_template', 'subscription', 'domain',  'order', 'ftp_user' ]
units.each do |item|
	puts item
	items = (item.camelize.constantize).all
	puts 'item count: ', items.count
	File.open("/opt/w3dhcp/DB_DATA/#{item}", 'w') do |f|
		f.write items.to_json
	end
end
