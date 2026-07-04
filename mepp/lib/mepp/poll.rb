require 'erb'
require 'nokogiri'

module Mepp
  module Poll

    def poll
      xml = ERB.new(File.read("#{provider[:templates]}/poll.xml"))
      reply = request(xml.result(binding))
      return result_code(reply) if result_code(reply)[:code].to_i.eql?(1300)
      doc = Nokogiri::XML(reply)
      epp = doc.namespaces.values.select{|i| i.match('epp') }[0]
      msgcount = doc.xpath('//e:response//e:msgQ/@count', e: epp).first.value
      msgid = doc.xpath('//e:response//e:msgQ/@id', e: epp).first.value
      msg = doc.xpath('//e:response//e:msgQ//e:msg', e: epp).text
      File.open("/var/log/w3dhcp/mepp/poll/#{provider[:login]}_poll-#{msgid}.xml", 'w') {|f| f.write(reply)}
#      poll_ack(msgid)
      { msgid: msgid, 'msg': msg, 'unread': msgcount}
    end

    def poll_ack(msgid)
      xml = ERB.new(File.read("#{provider[:templates]}/poll_ack.xml"))
      reply = request(xml.result(binding))
      return result_code(reply) if result_code(reply)[:code].to_i.eql?(1300)
    end

  end
end
