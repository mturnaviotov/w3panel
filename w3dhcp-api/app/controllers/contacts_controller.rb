class ContactsController < ApplicationController

  include Pundit::Authorization
  # GET /contacts
  # GET /contacts.json
  def index
    render json: policy_scope(Contact)
  end

  def show
#    render json: #current_user.customer.web_apps
  end

  def create
  end

  def update
  end

  def delete
  end
end
