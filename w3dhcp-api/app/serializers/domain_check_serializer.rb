class DomainCheckSerializer < ActiveModel::Serializer

  attributes :id, :name, :name_ascii, :avail, :price, :reason, :kind, :operation

	def avail
	  object.avail == '1' ? true : false
	end

end
