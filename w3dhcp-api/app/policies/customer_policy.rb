class CustomerPolicy
  attr_reader :user, :record

  def initialize(user, customer)
    @user = user
    @record = Customer.find_by(id: customer) if customer.present?
  end

  def permitted_attributes
     [:name, :corporate, :reseller_id]
		#:second_name, :phone1, :phone2, :c_admin, :c_tech, :c_billing, :accept_eula, :accept_privacy]
    #if user.admin? || user.owner_of?(post)
    #  [:title, :body, :tag_list]
    #else
    #  [:tag_list]
    #end
  end

  def index?
    true if @user.hosting_owner? || @user.reseller_owner?
  end

  def show?
    index?
  end

  def profile?
    index?
  end

  def create?
	true
    #index? #index?
  end

  def new?
    index? #index?
  end

  def update?
    index? #true if @user.client == @record.client
  end

  def edit?
    index?
  end

  def destroy?
    index?
    #(@user.client.eql?(Reseller.operator.owner) || @user.client.is_reseller?) && !@record.eql?(Reseller.operator.owner)
    #!(@record.domains.count > 0)
  end

  def reseller_activate?
    index?
    #@user.client.eql?(Reseller.operator.owner)
  end

  def scope
    Pundit.policy_scope!(user, record.class)
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      return scope.includes(:domains, :reseller, :contacts).all if @user.hosting_owner?
      return scope.includes(:domains, :reseller, :contacts).where(reseller: @user.reseller) if @user.reseller_owner?
    end

  end
end
