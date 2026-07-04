require 'erb'
require 'nokogiri'

module Mepp
  module Common

    def hello
      xml = ERB.new(File.read("#{provider[:templates]}/hello.xml"))
      request(xml.result(binding))
    end

  private
    def greeting(ssl_socket)
      read_data(ssl_socket)
    end

    def login
      xml = ERB.new(File.read("#{provider[:templates]}/login.xml"))
      xml.result(binding)
    end

    def logout
      xml = ERB.new(File.read("#{provider[:templates]}/logout.xml"))
      xml.result(binding)
    end

    def result_code(document)
      doc = Nokogiri::XML(document)
      code = doc.css('response//result').attr('code').value
      text = doc.css('response//result//msg').text
      {'code': code, 'text': text}
    end

  end
end
