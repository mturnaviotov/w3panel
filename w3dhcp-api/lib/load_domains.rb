# rails runner lib/load_domains.rb
# Add domains from file for first customer. Example loading.

File.open('not-loaded.txt', 'a') do |errors|
	File.open('domains-to-load.txt', 'r') do |f|
			f.each do |item|
				puts item
				begin
					dom = Domain.new(name: item)
					dom.customer = Customer.first
					dom.epp_update_info
					dom.save
				rescue StandardError => e
  				puts "===== > ERROR: #{item}"
	  			errors << item
				end
			end
	end
end