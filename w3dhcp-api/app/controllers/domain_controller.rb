class DomainController < ApplicationController

  include Pundit::Authorization

  before_action :authenticate_user!, except: [:check_result, :info_result]
  before_action :set_item, only: [:check_result]

  def check_result
    if @domain.domain_zone.present?
      @domain_zones << @domain.domain_zone.name if @domain.domain_zone.present?
    end

    if @zones.present?
      @domain_zones << @zones
    end

    if @zones.empty? && @domain.domain_zone.nil?
      @domain_zones << DomainZone.limit(10).map(&:name_ascii)
    end

    @domain_zones.flatten.uniq.each do |zone|
      clean_zone = zone.start_with?('.') ? zone[1..-1] : zone
      domain = Domain.new(name: "#{@domain.name_short}.#{clean_zone}")
      if domain.registry.present?
        # EPP check is stubbed because we lack an actual EPP server connection.
        # See README.md for more details.
        # result = Domain.epp_check(domain.name)
        result = { avail: '1', reason: "Available (Stubbed)" }
        
        result[:name] = domain.name
        result[:name_ascii] = domain.name_ascii
        
        template = SubscriptionTemplate.where("name LIKE ?", "#{zone}%").first
        result[:price] = template.present? ? template.register : 0
        
        result[:id] = "#{@domain.name_short}.#{clean_zone}"
        result[:operation] = 'register'
        item =  DomainCheck.new(result)
        @domains << item
      end
    end
    @domains.uniq!
    render json: @domains, each_serializer: DomainCheckSerializer
  end

  def info_result
    render plain: `whois @domain.name`
  end

  private

  def set_item
    @domains = []
    @domain_zones = []
##### names = item_params[:name].split(',').map { |domain| Domain.new(name: domain.strip) to user domains with comma w/out domain zones
    @domain = Domain.new(item_params)
    @zones  = params.require(:zones).permit(:selected => [])['selected']

  end

  def item_params
    params.require(:domain).permit(policy(Domain).permitted_attributes)
  end

end
