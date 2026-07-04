module W3dns

	class Record

		attr_accessor :content, :disabled

		def initialize(record)
			@content = record[:content]
			@disabled = record[:disabled] ||= false
			self
		end

		def new
			@content = record[:content]
			@disabled = record[:disabled] ||= false
			self
		end

		def to_s
			"content: #@content, disabled: #@disabled"
		end

		def to_json(*a)
			to_hash.to_json
		end

		def to_hash(*a)
			{ content: @content, disabled: @disabled }
		end

	end
end
