class OrderProcessJob
  @queue = :order_process

  def self.perform(id)
    logger = Logger.new(Rails.root.join('log/order_process_job.log'))
    order = Order.find(id)
    order.update(status: 3)
#    ActiveRecord::Base.clear_active_connections!
    logger.info "Order id # #{order.id} number # #{order.number} processing"
    failed = []
    order.items.each do |item|
      case item['kind']
        when 'domain'
          customer = order.customer
#          epp = Domain.new(name: item['name']).registry_partner.epp_operations
          logger.info 'Selected Registry partner: '+Domain.new(name: item['name']).registry_partner.name
          #RegistryPartner.where(name: 'hm_register_t').first.epp
          case item['operation_type']
            when 'create'
              check      = epp.domain_check(item['name'])
              if check[:avail].eql?('0')
                logger.error 'Domain check failed: '+item['name']
                failed << {'name': item['name'], 'service_type': item['service_type'], 'reason': check[:reason]}
                next
              end
              owner      = epp.contact_create(client.whois)
              adminc     = epp.contact_create(client.reseller.owner.whois)
              techc      = epp.contact_create(client.reseller.owner.whois)
              finance    = epp.contact_create(client.reseller.owner.whois)
              contacts   = {registrant: owner[:id], admin: [adminc[:id]], tech: [techc[:id]], billing: finance[:id]}
              logger.info 'Contacts: '+contacts.inspect
              result     = epp.domain_create(item['name'], contacts, client.reseller.owner.name_servers, 1)
              logger.info 'EPP Registration result: '+result.inspect
              if result[:code].eql?('1000')
                domain = Domain.new(epp.domain_info(item['name']))
                logger.info 'Domain created: '+domain.name
                domain.client_id = order.client_id
                domain.save
                logger.info domain.inspect
              else
                logger.error 'Domain create failed: '+item['name']
                failed << {'name': item['name'], 'service_type': item['service_type', 'reason': result[:reason]]}
              end
          end
      end
    end
    order.update(status: 0)
    logger.info 'failed items'+failed.inspect
    OrderMailer.order_processed(order.client.contacts.first, order, failed.uniq).deliver
    OrderMailer.order_processed(order.client.reseller.owner.contacts.first, order, failed.uniq).deliver
    logger.info "Order id # #{order.id} number # #{order.number} completed"
  end
end
