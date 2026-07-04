require 'erb'
require 'nokogiri'

module Mepp
  module Domain

    def domain_list
      xml = ERB.new(File.read("#{provider[:templates]}/domain_list.xml"))
      reply = request(xml.result(binding))
      doc = Nokogiri::XML(reply)
      epp = doc.namespaces.values.select{|i| i.match('epp') }[0]
      resdata = doc.xpath('//e:epp/e:response/e:resData', e: epp).first.children.first
      domain  = resdata.namespace.href
      list = doc.xpath('//e:epp/e:response/e:resData/d:listData/d:domain', e: epp, d: domain)
      domains = []
      list.children.each do |domain|
        domains << domain.child.text if domain.name.eql?('name')
      end
      domains
    end

    def domain_zone_price(zone)
      xml = ERB.new(File.read("#{provider[:templates]}/domain_zone_price.xml"))
      reply = request(xml.result(binding))
      doc = Nokogiri::XML(reply)
      epp = doc.namespaces.values.select{|i| i.match('epp') }[0]
      resdata = doc.xpath('//e:epp/e:response/e:resData', e: epp).first.children.first
      domain  = resdata.namespace.href
      price = doc.xpath('//d:domain/d:price', d: domain).first.children.text
      {'zone': zone, 'price': price}
    end

    def domain_check(domain)
      if options[:testing]
        return {name: domain, avail: "0", reason: ""} if domain.match(/(false)/)
        return {name: domain, avail: "1", reason: ""} if domain.match(/(true)/)
      end
      xml = ERB.new(File.read("#{provider[:templates]}/domain_check.xml"))
      reply = request(xml.result(binding))
      return result_code(reply) if result_code(reply)[:code].to_i > 1000
      doc = Nokogiri::XML(reply)
      epp = doc.namespaces.values.select{|i| i.match('epp') }[0]
      resdata = doc.xpath('//e:epp/e:response/e:resData', e: epp).first.children.first
      domain_namespace = resdata.namespaces.values.select{|i| i['domain']}[0]
      domaincheckset = doc.xpath('//e:epp//e:resData//d:chkData//d:cd', e: epp, d: domain_namespace)
      domains = []
      domaincheckset.each do |p|
        reason = ''
        if p.xpath('//d:cd/d:reason', d: domain_namespace).first
          reason = p.xpath('//d:cd/d:reason', d: domain_namespace).first.text
        end
        name = p.xpath('//d:cd/d:name', d: domain_namespace).first
        avail = name.attribute('avail').value 
        domains << Hash['name': name.text, 'avail': avail, 'reason': reason ]
      end
      domains[0]
    end

    def domain_info(domain)
      dom = Hash.new
      hostobjects = []
      contacts = {}
      status = []
      dates = {}
      ids = {}

      if options[:testing]
        return {code: '2303', text: 'Object does not exist'} if domain.match(/(false)/)
        dom[:dates]      = {crDate: DateTime.now.to_s, exDate: (DateTime.now + 365).to_s}
        dom[:ids]        = {roid: 'test', clID: 'test', crID: 'test'}
        dom[:hostobject] = ['ns1.test', 'ns2.test']
        dom[:contacts] = {registrant: "test", admin: ['test'], contact: 'test',
          tech: ['test']}
        dom[:status] = status
        dom[:name] = domain
        return dom
      end

      xml = ERB.new(File.read("#{provider[:templates]}/domain_info.xml"))
      reply = request(xml.result(binding))
      result = result_code(reply)
      return_error(result[:code], result[:text]) if result[:code].to_i > 1000
      doc = Nokogiri::XML(reply)
      epp = doc.namespaces.values.select{|i| i.match('epp') }[0]
      resdata = doc.xpath('//e:epp/e:response/e:resData', e: epp).first.children.first
      resdata.children.each do |child|
        if child.child.is_a?(Nokogiri::XML::Text)
          dates[child.name.to_sym] = child.content if child.name =~ /[a-z]{1,2}date/i
          ids[child.name.to_sym] = child.content if child.name =~ /[a-z]{1,2}id/i
          (contacts[child.attribute('type').value.to_sym] ||= []) << child.content if child.name =~ /contact/
          contacts[child.name.to_sym] = child.content if child.name.match(/contact|registrant/)
          dom[child.name.to_sym] = child.content if child.name =~ /name/i
        end
        dom[:pw] = child.content if child.name.eql?('authInfo')
        status << child.attr('s') if (child.is_a?(Nokogiri::XML::Element) && child.name.eql?('status'))
        child.children.each do |c|
          hostobjects << c.content if (child.child.is_a?(Nokogiri::XML::Element) && c.name.eql?('hostObj'))
        end
      end
      dom[:dates]      = dates
      dom[:ids]        = ids
      dom[:hostobject] = hostobjects
      dom[:contacts] = contacts
      dom[:status] = status
      downcase_key(dom)
    end

    def domain_renew(domainname, period)
      domain = domain_info(domainname)
      xml = ERB.new(File.read("#{provider[:templates]}/domain_renew.xml"))
      reply = request(xml.result(binding))
      result_code(reply)
    end

    def domain_delete(domain)
      xml = ERB.new(File.read("#{provider[:templates]}/domain_delete.xml"))
      reply = request(xml.result(binding))
      result_code(reply)
    end

    # domain => 'example.com', hosts = ['a.example.com', 'b.example.com']
    # contacts => {registrant: 'reg-test', admin: 'reg-test', tech: 'reg-test', billing: 'reg-test' }
    def domain_create(domain, contacts, hosts, period)
      xml = ERB.new(File.read("#{provider[:templates]}/domain_create.xml"))
      reply = request(xml.result(binding))
      result_code(reply)
    end

    # domain => 'example.com', status = ['clientHold', 'clientUpdateProhibited', ...]
    def domain_status_add(domain, status)
      xml = ERB.new(File.read("#{provider[:templates]}/domain_status_add.xml"))
      reply = request(xml.result(binding))
      return result_code(reply)
    end

    # domain => 'example.com', status = ['clientHold', 'clientUpdateProhibited', ...]
    def domain_status_rem(domain, status)
      xml = ERB.new(File.read("#{provider[:templates]}/domain_status_rem.xml"))
      reply = request(xml.result(binding))
      result_code(reply)
    end
    #clientUpdateProhibited
    #clientDeleteProhibited
    #clientTransferProhibited
    #clientRenewProhibited
    #clientHold

    def domain_delete(domain)
      xml = ERB.new(File.read("#{provider[:templates]}/domain_delete.xml"))
      reply = request(xml.result(binding))
      result_code(reply)
    end

    def domain_restore(domain)
      xml = ERB.new(File.read("#{provider[:templates]}/domain_restore.xml"))
      reply = request(xml.result(binding))
      result_code(reply)
    end


    # contacts => {registrant: 'UANS-00000900178', admin: 'UANS-00001232688', tech: 'UANS-00000900178', billing: 'UANS-00000900178'}
    def domain_transfer(domain, contacts, pw)
      xml = ERB.new(File.read("#{provider[:templates]}/domain_transfer.xml"))
      reply = request(xml.result(binding))
      result_code(reply)
    end

    # contacts => {registrant: 'gm123', admin: ['reg'], tech: ['reg']}
    def domain_replace_contacts(domain, contacts)
      old_contacts = domain_info(domain)[:contacts]
      xml = ERB.new(File.read("#{provider[:templates]}/domain_replace_contacts.xml"))
      reply = request(xml.result(binding))
      result_code(reply)
    end

    def domain_update_ns(domain, nameservers)
      old_ns = domain_info(domain)[:hostobject]
      if !nameservers.empty? || !old_ns.empty?
        xml = ERB.new(File.read("#{provider[:templates]}/domain_update_ns.xml"))
        reply = request(xml.result(binding))
        result_code(reply)
      else
        {:code=>"5000", :text=>"No old and new hostobjects"}
      end
    end

  end
end