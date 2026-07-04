class IpAddress < ApplicationRecord
  include Eventable
   has_many :web_apps
end
