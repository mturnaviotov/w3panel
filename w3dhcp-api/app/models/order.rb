class Order < ApplicationRecord
  include Eventable

  belongs_to :customer
  belongs_to :reseller

  enum :status, { created: 1, approved: 2, processing: 3, done: 0 }

  before_validation :set_properties

  validates  :number,
             :presence => {:message => "Mumber must be present."},
             :uniqueness => {:message => "Number already exists."}

  validates  :items,
             :presence => {:message => "Items must be present." }

  validates  :summ,
             :presence => {:message => "Summ must be present." }

  validates  :customer,
             :presence => {:message => "Customer must be present." }

  validates  :reseller,
             :presence => {:message => "Reseller must be present." }

  scope :today, -> { where('updated_at >= ?', Date.current.at_beginning_of_day) }

  def set_properties
    self.number = next_number
  end

  def approve(approver)
    with_lock do
      if !status.eql?('created')
        errors.add(:errors, "Order already approved")
      else
        update!(
          approver: approver,
          status: :approved,
          approved: DateTime.now
        )
        process
      end
    end
  end

  def process
    # The original async processing is commented out due to lack of an actual EPP connection.
    # Resque.enqueue(TestJob, self.id)
    # Resque.enqueue(OrderProcessJob, self.id)

    # --- STUB: Simulate Domain Registration and Subscription Creation ---
    items.each do |item|
      if item['kind'] == 'domain' && item['operation'] == 'register'
        domain_name = item['name']
        
        # Determine zone
        zone_name = domain_name.split('.')[1..-1].join('.')
        domain_zone = DomainZone.find_by(name: "." + zone_name) || DomainZone.find_by(name: zone_name)
        registry = domain_zone&.registry
        
        # 1. Create Domain
        domain = Domain.find_or_create_by(name: domain_name) do |d|
          d.domain_zone = domain_zone
          d.customer = customer
          d.registry = registry
          d.dates = { "exDate" => (DateTime.now + 1.year).to_s }
          d.status = ["ok"]
          d.hostobject = ["ns1.example.com", "ns2.example.com"]
        end

        # 2. Create Subscription
        template = SubscriptionTemplate.where("name LIKE ?", ".#{zone_name}%").first
        Subscription.find_or_create_by(name: "#{domain_name} Domain") do |s|
          s.customer = customer
          s.subscription_template = template
          s.kind = 'domain'
          s.status = 'active'
          s.expiration = DateTime.now + 1.year
        end
      end
    end
    
    # Mark order as completed
    update!(status: :done)
  end


  private
  def next_number
    Date.today.strftime('%y%m%d')+('%0.3d' % SecureRandom.random_number(1000) )
  end
end
