pass = "4ae71adca734aa979b37887bff1db80ec6522ea25983f26abc7c7eda57ee01bd16f002b9"

res = Reseller.first
f = JSON.parse(File.read('/opt/w3dhcp/data.json'))
count = 0
f['clients'].each do |row|
	puts "R", row
	cust = Customer.where(name: row['fname']).first_or_create(name: row['fname'], corporate: row['fl'], reseller: res)
	puts "C", cust.name
	row['email'].split(',').each do |mail|
		User.create(email: mail.strip, password: pass, active: true, customer: cust)
	end
	begin
		if row['adrf']
	  	Contact.where(customer: cust, name: row['fname'], voice: row['phone'], email: row['email'], address: row['adrf']).create_or_find_by(customer: cust, name: row['fname'], voice: row['phone'], email: row['email'], address: row['adrf'])
		end
		if row['adry']
	  	Contact.where(customer: cust, name: row['fname'], voice: row['phone'], email: row['email'], address: row['adry']).create_or_find_by(customer: cust, name: row['fname'], voice: row['phone'], email: row['email'], address: row['adry'])
		end
	rescue
		puts "Contact skipped", row['fname']
   count+=1
	end

	row['domains'].each do |d|
	
		domain = Domain.find_by(name_ascii: d['name'])
 		if domain
			domain.update(customer: cust)
 			domain.save
		else
			begin
				domain = Domain.new(name: d['name'], customer: cust)
				sub = Subscription.where(name: d['name'], kind: 'domain').first_or_create(name: d['name'], kind: 'domain', status: 'active', expiration: d['term'], customer: cust, subscription_template: SubscriptionTemplate.find_by(name: domain.domain_zone.name))
				domain.subscription = sub
				domain.epp_update_info
				domain.save
				puts "Domain OK: ", domain.name
			rescue
				puts "Domain skipped, only subscription created", d['name']
				begin
					Subscription.create(name: d['name'], kind: 'domain', status: 'active', expiration: d['term'], customer: cust, subscription_template: SubscriptionTemplate.find_by(name: 'manual'))
				rescue
					puts 'SKIPPED, Already present: ', d['name']
				end
			end
		end
	end
end

puts 'rescue count', count