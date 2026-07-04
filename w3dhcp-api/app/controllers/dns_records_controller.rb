class DnsRecordsController < ApplicationController

  include Pundit::Authorization
	include W3dns

  before_action :authenticate_user!
  before_action :set_item, only: [:show, :update, :destroy]

  def index
    render json: policy_scope(DnsRecord.where(dns_zone: params[:zone_id]))
  end

  def create
    dns_zone = DnsZone.find(params[:zone_id])
    @item = dns_zone.dns_records.new(item_params)
    begin
      @item.save
			client = W3dns::Server.configure(
				ENV.fetch('DNS_SERVER_HOST', 'localhost'),
				ENV.fetch('DNS_SERVER_KEY', 'BO8zpNYJqJ7bc')
			)
			#zone = client.zone.get(@item.dns_zone.name)
			response = client.zone.get(@item.dns_zone.name).zone.update_record(@item.name, @item.record_type, @item.records)
			soa = @item.dns_zone.dns_records.filter{|r| r.record_type == 'SOA'}.first
			soa.records[0] = response.records[0].content
			soa.save
      render json: @item
    rescue => e
      Rails.logger.error("DnsRecord create error: #{e.message}")
      Rails.logger.error(e.backtrace.join("\n"))
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  def show
    render json: @item
  end

  def update
    if @item.update(item_params)
			response = @zone.update_record(@item.name, @item.record_type, @item.records)
			soa = @item.dns_zone.dns_records.filter{|r| r.record_type == 'SOA'}.first
			soa.records[0] = response.records[0].content
			soa.save
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def destroy
		if @item.destroy
			response = @zone.delete_record(@item.name, @item.record_type)
			soa = @item.dns_zone.dns_records.filter{|r| r.record_type == 'SOA'}.first
			soa.records[0] = response.records[0].content
			soa.save
      render :json => {}, status: :gone
   else
      render json: @item.errors, status: :unprocessable_entity
   end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_item
    @item = policy_scope(DnsRecord).find(params[:id])
	@client = W3dns::Server.configure(
		ENV.fetch('DNS_SERVER_HOST', 'localhost'),
		ENV.fetch('DNS_SERVER_KEY', 'BO8zpNYJqJ7bc')
	)
	@zone = @client.zone.get(@item.dns_zone.name)
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def item_params
    params.require(:dns_record).permit(policy(DnsRecord).permitted_attributes)
  end

end