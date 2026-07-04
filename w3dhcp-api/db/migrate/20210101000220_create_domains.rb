class CreateDomains < ActiveRecord::Migration[6.1]
  def change
    create_table :domains, id: :uuid do |t|

      t.string     :name,        unique: true, index: true
      t.string     :name_ascii,  unique: true, index: true

      t.string     :licence,                default: ''
      t.string     :pw,                     default: ''
      t.hstore     :contacts,               default: {}
      t.hstore     :ids,                    default: {}
      t.hstore     :dates,                  default: {}
      t.string     :hostobject,             array: true,  null:   false
      t.string     :status,                 array: true,  default: []

      t.datetime   :comment_reseller_date
      t.string     :comment_reseller_text,	default: ''
      t.datetime   :comment_owner_date
      t.string     :comment_owner_text,			default: ''

      t.belongs_to :domain_zone,	type: :uuid, index: true, foreign_key: true
      t.belongs_to :customer,			type: :uuid, index: true, foreign_key: true
      t.belongs_to :registry,			type: :uuid, index: true, foreign_key: true
      t.belongs_to :subscription, type: :uuid, index: true, foreign_key: true

      t.timestamps
    end
  end
end
