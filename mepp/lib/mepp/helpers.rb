require 'erb'
require 'nokogiri'

module Mepp
  module Helpers

    def currency_rates
      xml = ERB.new(File.read("#{provider[:templates]}/hello.xml"))
      reply = request(xml.result(binding))
      doc = Nokogiri::XML(reply)
      epp = doc.namespaces.values.select{|i| i.match('epp') }[0]
      resdata = doc.xpath('//e:epp/e:greeting/e:dcp/e:statement/e:recipient/e:ours', e: epp).text
      usd, rur = resdata.scan(/\d+\.\d+/)
      {'usd': usd, 'rur': rur}
    end

    def balance
      xml = ERB.new(File.read("#{provider[:templates]}/balance.xml"))
      reply = request(xml.result(binding))
      return result_code(reply) if result_code(reply)[:code].to_i > 1000
      doc = Nokogiri::XML(reply)
      epp = doc.namespaces.values.select{|i| i.match('epp') }[0]
      resdata = doc.xpath('//e:epp/e:response/e:resData', e: epp).first.children.first
      if resdata.attribute('hrn')
        amount  = resdata.attribute('hrn').value if resdata.attribute('hrn')
      else
        balance_namespace = resdata.namespace.href
        amount = resdata.xpath('//d:balance', d: balance_namespace).text
      end
      amount
    end

    def log(object, level = 5)
      if level.eql?(4)
        @logger.add(4) { object }
        return
      end
      if @options[:loglevel] >= level
        @logger.add(level) { object }
      end
      #0 DEBUG
      #1 INFO
      #2 WARN
      #3 ERROR
      #4 FATAL
      #5 ANY
    end

  end
end
