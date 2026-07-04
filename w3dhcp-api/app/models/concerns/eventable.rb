module Eventable
  extend ActiveSupport::Concern

  included do
    after_commit :log_create_event, on: :create
    after_commit :log_update_event, on: :update
    after_commit :log_destroy_event, on: :destroy
  end

  def log_create_event
    create_event(:e_create, :info, "Created #{self.class.name} #{self.id}")
  end

  def log_update_event
    create_event(:e_update, :info, "Updated #{self.class.name} #{self.id}")
  end

  def log_destroy_event
    create_event(:e_delete, :info, "Deleted #{self.class.name} #{self.id}")
  end

  def create_event(action, type, description)
    # Don't try to log events if there's no DB connection or Event table doesn't exist yet
    return unless ActiveRecord::Base.connection.table_exists?('events')

    user = Current.user
    customer = user&.customer
    
    # If the model itself is a customer, link it. If the model responds to customer, link it.
    if self.is_a?(Customer)
      customer ||= self
    elsif self.respond_to?(:customer)
      customer ||= self.customer
    end

    Event.create!(
      event_type: type,
      event_action: action,
      ip: Current.ip_address || '127.0.0.1',
      user: user,
      customer: customer,
      item: self.class.name,
      description: description
    )
  rescue => e
    Rails.logger.error "Failed to create event: #{e.message}"
  end
end
