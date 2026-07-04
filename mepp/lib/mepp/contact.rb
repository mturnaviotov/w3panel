require 'erb'
require 'nokogiri'

module Mepp
  module Contact

    def contact_check(contact)
      xml = ERB.new(File.read("#{provider[:templates]}/contact_check.xml"))
      reply = request(xml.result(binding))
      return result_code(reply) if result_code(reply)[:code].to_i > 1000
      doc = Nokogiri::XML(reply)
      epp = doc.namespaces.values.select{|i| i.match('epp') }[0]
      resdata = doc.xpath('//e:epp/e:response/e:resData', e: epp).first.children.first
      contact = resdata.namespaces.values.select{|i| i['contact']}[0]
      contactscheckset = doc.xpath('//e:epp//e:resData//d:chkData//d:cd', e: epp, d: contact)
      contacts = []
      contactscheckset.each do |p|
        reason = ''
        if p.xpath('//d:cd/d:reason', d: contact).first
          reason = p.xpath('//d:cd/d:reason', d: contact).first.text
        end
        name = p.xpath('//d:cd/d:id', d: contact).first
        avail = name.attribute('avail').value
        contacts << Hash['name': name.text, 'avail': avail, 'reason': reason ]
      end
      contacts[0]
    end

    def contact_create(contact)
      xml           = ERB.new(File.read("#{provider[:templates]}/contact_create.xml"))
      reply         = request(xml.result(binding))
      result        = result_code(reply)
      raise ArgumentError, "Contact info for #{contact} get error: code #{result_code(reply)[:code]}, message: #{result_code(reply)[:text]} " if result[:code].to_i > 1000
      doc           = Nokogiri::XML(reply)
      epp           = doc.namespaces.values.select{|i| i.match('epp') }[0]
      resdata       = doc.xpath('//e:epp/e:response/e:resData', e: epp).first.children.first
      contact       = resdata.namespaces.values.select{|i| i['contact']}[0]
      contactdata   = resdata.xpath('/e:epp/e:response/e:resData/c:creData/child::*', e: epp, c: contact)
      crdate        = contactdata.xpath('//c:crDate', c: contact).text
      id            = contactdata.xpath('//c:id', c: contact).text
      {'id': id, 'crDate': crdate}
    end

    def contact_info(contact)
      xml = ERB.new(File.read("#{provider[:templates]}/contact_info.xml"))
      reply = request(xml.result(binding))
      result = result_code(reply)
      raise ArgumentError, "Contact info for #{contact} get error: code #{result_code(reply)[:code]}, message: #{result_code(reply)[:text]} " if result[:code].to_i > 1000
      doc = Nokogiri::XML(reply)
      epp = doc.namespaces.values.select{|i| i.match('epp') }[0]
      resdata = doc.xpath('//e:epp/e:response/e:resData', e: epp).first.children.first
      contact = resdata.namespaces.values.select{|i| i['contact']}[0]
      contactdata = resdata.xpath('/e:epp/e:response/e:resData/c:infData/child::*', e: epp, c: contact)
      result = {}
      addresslist = {}
      status = []
      contactdata.each do |item|
        result[item.name.to_sym] = item.content if item.child.is_a?(Nokogiri::XML::Text)
        result[:pw] = item.child.content if item.name.eql?('authInfo')
        status << item.attr('s') if (item.is_a?(Nokogiri::XML::Element) && item.name.eql?('status'))
        if (item.is_a?(Nokogiri::XML::Element) && item.name.eql?('postalInfo'))
          postalData = {}
          addr = {}
          item.children.each {|pd| postalData[pd.name.to_sym] = pd.content}
          item.xpath('c:addr', c: contact).children.map {|x| addr[x.name.to_sym] = x.content}
          postalData['addr'.to_sym] = addr
          addresslist[(item.attribute('type').value).to_sym] = postalData
        end
      end
      result[:status] = status
      result[:postaldata] = addresslist
      result
    end

    def contact_delete(contact)
      xml = ERB.new(File.read("#{provider[:templates]}/contact_delete.xml"))
      reply = request(xml.result(binding))
      result_code(reply)
    end

  end
end