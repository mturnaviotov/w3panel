class DomainCheck

  alias :read_attribute_for_serialization :send

  attr_accessor :id, :name, :name_ascii, :avail, :price, :reason, :kind, :operation

  def initialize(attributes)
    @id = attributes[:id]
    @name = attributes[:name]
    @name_ascii = attributes[:name_ascii] || ''
    @avail = attributes[:avail] || 0
    @reason = attributes[:reason] || ''
    @price = attributes[:price] || ''
		@kind  = 'domain'
		@operation = 'register'
  end

  def self.model_name
    @_model_name ||= ActiveModel::Name.new(self)
  end
end
