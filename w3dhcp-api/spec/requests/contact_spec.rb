require 'rails_helper'

RSpec.describe "Contacts", type: :request do
  describe "GET /name" do
    it "returns http success" do
      get "/contact/name"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /email" do
    it "returns http success" do
      get "/contact/email"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /phone1" do
    it "returns http success" do
      get "/contact/phone1"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /address" do
    it "returns http success" do
      get "/contact/address"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /customer:refererences" do
    it "returns http success" do
      get "/contact/customer:refererences"
      expect(response).to have_http_status(:success)
    end
  end

end
