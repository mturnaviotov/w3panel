class RegistrySerializer < ActiveModel::Serializer

  cache key: 'registry', expires_in: 3.hours

  attributes :id, :name, :domains, :domain_zones

  def domains
    object.domains.size
  end

  def domain_zones
    object.domain_zones.size
  end

end
