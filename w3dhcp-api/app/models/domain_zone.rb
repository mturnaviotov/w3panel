class DomainZone < ApplicationRecord
  include Eventable

  include Normalize

  belongs_to :registry
  has_many   :domains,            inverse_of: :domain_zone
#  has_many   :zone_prices,         dependent: :destroy

  before_validation :set_properties

  validates  :name,
             :presence => {:message => "IDN Name can't be blank." },
             :uniqueness => {:message => "Zone already exists."}

  validates  :name_ascii,
             :presence => {:message => "ASCII Name can't be blank." },
             :uniqueness => {:message => "Zone already exists."}

#  scope :listed,    -> { joins(:zone_prices).where(listed: true, 'zone_prices.default': true) }
  scope :idn,       -> { where(idn: true, idn_only: false) }
  scope :idn_only,  -> { where(idn_only: true) }
  scope :name_like, -> (name) { where("name like ? or name_ascii like ?", "%#{name}%", "%#{name}%") }

#  def self.default_for(name)
#    zone = find_by("name like ? or name_ascii like ?", name, name)
#    zone.zone_prices.find_by(default: true)
#  end

#  def prices
#    self.zone_prices.find_by(default: true)
#  end

  private
  def set_properties
    self.name_ascii = domain_to_ascii(self.name.gsub(/^\./, ''))
    self.name       = domain_from_ascii(self.name)
  end

end
