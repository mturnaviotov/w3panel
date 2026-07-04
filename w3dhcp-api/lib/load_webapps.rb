# rails runner lib/load_webapps.rb
# Add domain for first customer. Example loading.

File.open("domains.txt", "r") do |f|
    f.each_line do |line|
	WebApp.create(name: line.strip, active: true, customer: Customer.first, ip_address: IpAddress.first)
    end
end
