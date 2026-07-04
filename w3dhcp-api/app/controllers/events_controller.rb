class EventsController < ApplicationController
  include Pundit::Authorization

  before_action :authenticate_user!

  def index
    @events = policy_scope(Event)
    
    if params[:ip].present?
      @events = @events.where("ip LIKE ?", "%#{params[:ip]}%")
    end

    if params[:customer_name].present?
  @events = @events.joins(:customer).where("customers.name ILIKE ?", "%#{params[:customer_name]}%")
end

if params[:item].present?
  @events = @events.where("events.item ILIKE ?", "%#{params[:item]}%")
end


    if params[:date_from].present?
      @events = @events.where("created_at >= ?", Time.zone.parse(params[:date_from]).beginning_of_day)
    end

    if params[:date_to].present?
      @events = @events.where("created_at <= ?", Time.zone.parse(params[:date_to]).end_of_day)
    end

    total_count = @events.count

    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 10).to_i
    
    @events = @events.offset((page - 1) * per_page).limit(per_page)

    render json: {
      data: ActiveModel::Serializer::CollectionSerializer.new(@events, serializer: EventSerializer),
      meta: { total: total_count }
    }
  end
end
