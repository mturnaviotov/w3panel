units = ['reseller', 'customer', 'user', 'contact', 'ip_address', 'web_app', 'dns_zone', 'dns_record', 'registry', 'domain_zone', 'subscription_template', 'subscription', 'domain',  'order', 'ftp_user' ]
units.each do |item|
	puts item
	f = JSON.parse(File.read("/opt/w3dhcp/DB_DATA/#{item}"))
	f.each { |i| (item.camelize.constantize).create(i) }
end
