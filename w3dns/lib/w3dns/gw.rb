require 'net/http'
require 'json'

module W3dns

	class Gw

		@url
		@headers

		def self.configure(url, headers)
			@url = url
			@headers = headers
			self
		end

		def self.request(localuri, body = '', method = 'get')
			uri = URI(@url+localuri)
			req = ''
			result = ''
			case method
				when 'patch'
					req = Net::HTTP::Patch.new(uri, @headers)
				when 'get'
					req = Net::HTTP::Get.new(uri, @headers)
				when 'put'
					req = Net::HTTP::Put.new(uri, @headers)
				when 'post'
					req = Net::HTTP::Post.new(uri, @headers)
				when 'delete'
					req = Net::HTTP::Delete.new(uri, @headers)
				end
				req.body = body.to_json
				res = Net::HTTP.start(uri.hostname, uri.port) do |http|
				http.request(req)
			end

			result = {code: res.response.code, message: res.response.message}
			begin
				case res.response.code.to_i
					when 200
						result[:body] = JSON.parse(res.body, symbolize_names: true) if !res.body.nil?
					when 204
						result[:body] = 'Data saved'
					else
						raise "#{res.response.code},#{res.response.message}"
				end
			rescue => e
				code, message = e.message.split(',')
				{code: code, message: message}
			end
			result
		end

	end
end
