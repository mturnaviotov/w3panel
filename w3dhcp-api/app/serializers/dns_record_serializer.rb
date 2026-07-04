class DnsRecordSerializer < ActiveModel::Serializer

  cache key: 'dns_record', expired_at: 3.hours

  attributes :id, :name, :record_type, :records, :ttl, :comments

end
