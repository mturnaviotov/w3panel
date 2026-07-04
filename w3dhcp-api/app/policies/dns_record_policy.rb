class DnsRecordPolicy
  attr_reader :user, :record

  def initialize(user, item)
    @user = user
    @record = item
  end

  def permitted_attributes
    items = [:name, :record_type, :ttl, :comments => [], :records => []]
  end

  def index?
    true if @user.customer = @record.dns_zone.customer
  end

  def show?
    index?
  end

  # SOA and NS records prohibited die to zone configuration in whois
  # FIXME: NS can be edited for non our-epp zones
  def create?
    index? #['NS','SOA'].include?(@record.record_type)
  end

  def update?
    create?
  end

  def destroy?
    create?
  end

  def scope
    Pundit.policy_scope!(user, record.class)
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = User.find(user.id)
      @scope = scope
    end

    def resolve
      return scope.all
    end

  end
end
