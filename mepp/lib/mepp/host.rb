require 'erb'
require 'nokogiri'

module Mepp
  module Host

    def host_check(host)
      xml = ERB.new(File.read("#{provider[:templates]}/host_check.xml"))
      reply = request(xml.result(binding))
      doc = Nokogiri::XML(reply)
      epp = doc.namespaces.values.select{|i| i.match('epp') }[0]
      resdata = doc.xpath('//e:epp/e:response/e:resData', e: epp).first.children.first
      host_namespace = resdata.namespaces.values.select{|i| i['host']}[0]
      hostcheckset = doc.xpath('//e:epp//e:resData//d:chkData//d:cd', e: epp, d: host_namespace)
      hosts = []
      hostcheckset.each do |p|
        reason = ''
        if p.xpath('//d:cd/d:reason', d: host_namespace).first
          reason = p.xpath('//d:cd/d:reason', d: host_namespace).first.text
        end
        name = p.xpath('//d:cd/d:name', d: host_namespace).first
        avail = name.attribute('avail').value 
        hosts << Hash['name': name.text, 'avail': avail, 'reason': reason ]
      end
      return hosts
    end

    def host_info(host)
      xml = ERB.new(File.read("#{provider[:templates]}/host_info.xml"))
      reply = request(xml.result(binding))
      return result_code(reply) if result_code(reply)[:code].to_i > 1000
      doc = Nokogiri::XML(reply)
      epp = doc.namespaces.values.select{|i| i.match('epp') }[0]
      resdata = doc.xpath('//e:epp/e:response/e:resData', e: epp).first.children.first
      host_namespace = resdata.namespaces.values.select{|i| i['host']}[0]
      hostcheck = doc.xpath('//e:epp//e:resData//d:infData', e: epp, d: host_namespace)
      host = {}
      status = []
      hostcheck.children.each do |child|
        host[child.name.to_sym] = child.content
        status << child.attr('s') if (child.is_a?(Nokogiri::XML::Element) && child.name.eql?('status'))
      end
      host[:status] = status
      return host
    end

    def host_delete(host)
      xml = ERB.new(File.read("#{provider[:templates]}/host_delete.xml"))
      reply = request(xml.result(binding))
      result_code(reply)
    end

    def host_create(host, ipv4, ipv6)
      xml = ERB.new(File.read("#{provider[:templates]}/host_create.xml"))
      reply = request(xml.result(binding))
      result_code(reply)
    end

  end
end