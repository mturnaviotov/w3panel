module Mepp
  module Utils

    def downcase_key(hash)
      new_hash = {}
      hash.each do |k,v|
        new_hash.merge!(k.downcase.to_sym => v)
      end
      new_hash
    end

    def return_error(id, message)
      raise ArgumentError.new(msg = "#{id},#{message}")
    end
  end
end
