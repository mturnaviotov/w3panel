class RegistryNameSerializer < ActiveModel::Serializer

  cache key: 'registry_name', expires_in: 3.hours

  attributes :id, :name

end
