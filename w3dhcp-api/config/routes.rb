Rails.application.routes.draw do
  scope 'api', :defaults => {:format => :json} do
    scope 'v1' do

      resources :users do
        collection do
          post 'register',    to: 'users#register'
        end
      end

#      post :sign_in, only: [:create] do
			  post '/sign_in', to: 'session#create'
#				#get  '/', to: 'users#show'
#      end

      resources :web_apps do
        member do
          post :start
          post :stop
          post :restart
          post :block
          post :unblock
        end
      end
      resources :ftp_users
      resources :ip_addresses

      resources :dns_zones, param: :zone_id do
        member do
          post '/axfr_retrieve',   to: 'dns_zones#axfr_retrieve'
          post '/notify',   to: 'dns_zones#notify'
          resources :dns_records
        end
      end

      resources :registries do
        member do
          post 'balance_update'
        end
      end

      resources :domain_zones

      resources :subscriptions
      resources :subscription_templates do
        collection do
          get 'list'
        end
      end

      resources :resellers

      resource :domain, only: [] do
        post 'check',    to: 'domain#check_result'
        post 'info',     to: 'domain#info_result'
      end

      resources :domains do
        collection do
          get 'count'
          post 'epp_update_info', to: 'domains#group_epp_update_info'
          post 'epp_status',      to: 'domains#group_epp_status'
          post 'epp_update_ns',   to: 'domains#group_epp_update_ns'
          post 'epp_delete',      to: 'domains#group_epp_delete'
          post 'epp_restore',     to: 'domains#group_epp_restore'
          post 'epp_renew',       to: 'domains#group_epp_renew'
          post 'epp_hold',        to: 'domains#group_epp_hold'
          post 'epp_unhold',      to: 'domains#group_epp_unhold'
        end
        member do
          post 'epp_update_info'
          post 'epp_update_ns'
          post 'epp_delete'
          post 'epp_restore'
          post 'epp_renew'
          post 'epp_hold'
          post 'epp_unhold'
          post 'update_comment'
        end
      end

      resources :customers
      resources :contacts

      resource :board, only: [:show]

      resources :orders, only: [:index, :show, :create, :destroy] do
        member do
          post 'approve'
#          get 'pdf'
        end
      end
      
      resources :events, only: [:index]

    end
  end
end
