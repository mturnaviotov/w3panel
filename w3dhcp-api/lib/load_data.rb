c = Reseller.first.owner

a = File.read ('domains')
arr = a.split("\n")
arr.each{|i| src =i; DnsZone.where(name: src).update(active: true)}

#ftp as example
arr.each{|i| name = i.split(',')[0]; dir =  i.split(',')[1]; password = i.split(',')[2]; uid = i.split(',')[3]; gid = i.spli
t(',')[4]; FtpUser.create(username: name, password: (Digest::SHA256.hexdigest password), uid: uid, gid: gid, homedir: dir, customer_id: r.id)
 }

# static
arr.each{|i| name = i.split(',')[0]; ip_ext =  i.split(',')[1]; active =  i.split(',')[3]; WebApp.create(name: name,ip_ext
: ip_ext, app_type: :static, active: active, ip_address: IpAddress.first, customer: c)}

# redirect
arr.each{|i| name = i.split(',')[0]; ip_ext =  i.split(',')[1]; dst =  i.split(',')[3]; WebApp.create(name: name, ip_ext: ip_ext, app_type: :
redirect, redirect_to: dst, active: true, customer: c, ip_address: IpAddress.first)}

# apps
arr.each do |i|
  name = i.split(',')[0]
  system_uid =  i.split(',')[1]
  ip_ext =  i.split(',')[2]
  ip_int= i.split(',')[3]
  img= i.split(',')[4]
  customer = Domain.find_or_create_by(name: name).customer || Reseller.first.owner
  item = {name: name, ip_ext: ip_ext, ip_int: ip_int, system_uid: system_uid, image_name: img, active: true, redirect_to: '', customer: custom,
  ip_address: IpAddress.first, web_root: "/var/www/#{name}/web", app_type: (img =~ /alp/) ? 'php7' : 'php5'} ; WebApp.find_or_create_by(item)
 end
