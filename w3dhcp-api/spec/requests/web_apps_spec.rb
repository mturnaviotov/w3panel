require 'rails_helper'

RSpec.describe "WebApps", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/web_apps/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/web_apps/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/web_apps/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/web_apps/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /delete" do
    it "returns http success" do
      get "/web_apps/delete"
      expect(response).to have_http_status(:success)
    end
  end

end
