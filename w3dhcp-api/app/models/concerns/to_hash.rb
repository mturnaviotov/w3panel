module ToHash

  def to_hash
    hash = self.attributes.select { |k, v| !v.nil? || !v.present? }
    hash.symbolize_keys
  end

end
