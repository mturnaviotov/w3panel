class CreateDomainZones < ActiveRecord::Migration[6.1]
  def change
    create_table :domain_zones, id: :uuid do |t|

      t.string   "name",                        index: true
      t.string   "name_ascii",                  index: true
      t.boolean  "idn",                         default: false
      t.boolean  "idn_only",                    default: false

      t.integer  "min_registration_period",     default: 1
      t.integer  "max_registration_period",     default: 10
      t.integer  "min_domain_length",           default: 1
      t.integer  "max_domain_length",           default: 63

      t.boolean  "manual_processing",           default: false
      t.boolean  "licence_requirement",         default: false
      t.boolean  "files_upload_requirement",    default: false
      t.boolean  "proxy_contact_requirement",   default: false

      t.boolean  "period_hold_avail",           default: true
      t.integer  "period_hold_length",          default: 29
      t.boolean  "period_auto_renew_avail",     default: true
      t.integer  "period_auto_renew_length",    default: 29
      t.boolean  "period_redemption_avail",     default: true
      t.integer  "period_redemption_length",    default: 30
      t.boolean  "period_delete_avail",         default: true
      t.integer  "period_delete_length",        default: 5

      t.text     "comment",                     default: ''

      t.belongs_to :registry, type: :uuid, index: true, foreign_key: true

      t.timestamps
    end
  end
end
