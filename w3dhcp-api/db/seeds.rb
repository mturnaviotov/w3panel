# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Clean up database to allow idempotent seeding
User.destroy_all
Contact.destroy_all
WebApp.destroy_all
FtpUser.destroy_all
# Delete non-owner customers
Customer.where(owner: false).destroy_all
Domain.destroy_all
DomainZone.destroy_all
Registry.destroy_all
IpAddress.destroy_all
Subscription.destroy_all
SubscriptionTemplate.destroy_all
DnsZone.destroy_all

resellerOwner = Reseller.find_or_create_by(hosting_operator: true)
customerOwner = Customer.find_or_create_by(owner: true) do |c|
  c.name = 'Goodfather'
  c.reseller = resellerOwner
end

user = User.find_or_create_by(email: "user@example.com") do |u|
  u.password = "user@example.com"
  u.customer = customerOwner
end

Contact.find_or_create_by(email: 'user@example.com') do |c|
  c.name = 'Hosting Operator'
  c.voice = '+38067123456789'
  c.address = 'Zephyr, Solar System'
  c.customer = customerOwner
end

ip = IpAddress.find_or_create_by(ip: '10.10.10.10') do |i|
  i.shared = true
  i.default = true
end

WebApp.find_or_create_by(name: 'example.com') do |w|
  w.ip_address = ip
  w.customer = customerOwner
end

registry = Registry.find_or_create_by(name: 'default_registry_stub') do |r|
  r.manual = false
end

DomainZone.find_or_create_by(name: '.com') do |d|
  d.registry = registry
end
DomainZone.find_or_create_by(name: '.ua') do |d|
  d.registry = registry
end
DomainZone.find_or_create_by(name: '.kiev.ua') do |d|
  d.registry = registry
end

Domain.find_or_create_by(name: 'example.com') do |d|
  d.domain_zone = DomainZone.find_by(name: '.com')
  d.customer = customerOwner
  d.registry = registry
  d.dates = { "exDate" => (DateTime.now + 1.year).to_s }
  d.status = ["ok"]
  d.hostobject = ["ns1.example.com", "ns2.example.com"]
end

DnsZone.find_or_create_by(name: 'example.com') do |z|
  z.customer = customerOwner
  z.kind = 'Master'
  z.masters = []
  z.nameservers = ['ns1.example.com', 'ns2.example.com']
end

domain_template_com = SubscriptionTemplate.find_or_create_by(name: '.com Domain (1 Year)') do |t|
  t.kind = 'domain'
  t.term = 12
  t.listed = true
  t.register = 300.00
  t.renew = 320.00
  t.transfer = 300.00
  t.reseller = resellerOwner
end

domain_template_ua = SubscriptionTemplate.find_or_create_by(name: '.ua Domain (1 Year)') do |t|
  t.kind = 'domain'
  t.term = 12
  t.listed = true
  t.register = 450.00
  t.renew = 450.00
  t.transfer = 450.00
  t.reseller = resellerOwner
end

domain_template_kiev = SubscriptionTemplate.find_or_create_by(name: '.kiev.ua Domain (1 Year)') do |t|
  t.kind = 'domain'
  t.term = 12
  t.listed = true
  t.register = 250.00
  t.renew = 270.00
  t.transfer = 250.00
  t.reseller = resellerOwner
end

hosting_template = SubscriptionTemplate.find_or_create_by(name: 'Basic Hosting (1 Month)') do |t|
  t.kind = 'balance'
  t.term = 1
  t.listed = true
  t.register = 150.00
  t.renew = 150.00
  t.disk = 10.0
  t.disk_unit = 'g'
  t.reseller = resellerOwner
end

Subscription.find_or_create_by(name: 'example.com Domain') do |s|
  s.customer = customerOwner
  s.subscription_template = domain_template_com
  s.kind = 'domain'
  s.status = 'active'
  s.expiration = DateTime.now + 1.year
end

Subscription.find_or_create_by(name: 'example.com Hosting') do |s|
  s.customer = customerOwner
  s.subscription_template = hosting_template
  s.kind = 'domain' # or 'balance' if supported, wait, Subscription kind enum only has domain right now?
  s.status = 'active'
  s.expiration = DateTime.now + 1.month
end


FtpUser.find_or_create_by(username: 'example-ftp') do |f|
  f.password = 'password123'
  f.web_app = WebApp.find_by(name: 'example.com')
end
