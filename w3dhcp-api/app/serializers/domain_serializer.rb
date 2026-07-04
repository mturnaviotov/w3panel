class DomainSerializer < ActiveModel::Serializer

  cache key: 'domain', expired_at: 3.hours

  attributes :id, :name, :name_ascii, :contacts,  :comment_date, :comment_text, :dates, :hostobject,
    :status, :date_expire, :date_renew, :date_redemption, :created_at, :updated_at

  belongs_to :domain_zone, serializer: DomainZoneNameSerializer
  belongs_to :customer, serializer: CustomerNameSerializer
  belongs_to :registry, serializer: RegistryNameSerializer


  def comment_date
    if current_user.reseller_owner?
      object.comment_reseller_date
    else
      object.comment_owner_date
    end
  end

  def comment_text
    if current_user.reseller_owner?
      object.comment_reseller_text
    else
      object.comment_owner_text
    end
  end

end
