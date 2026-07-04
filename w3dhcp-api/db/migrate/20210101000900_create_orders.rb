class CreateOrders < ActiveRecord::Migration[6.1]
  def change
    create_table :orders, id: :uuid do |t|

      t.integer  :number,       unique: true, index: true
      t.jsonb    :items,        null: false
      t.decimal  :summ,         null: false
      t.datetime :date,         null: false
      t.hstore   :from,			default: {}
      t.hstore   :to,			default: {}
      t.hstore   :approver,		default: {}
      t.integer  :status,       default: 1
      t.datetime :approved,		default: ''

      t.references :reseller, type: :uuid, index: true, foreign_key: true
      t.references :customer, type: :uuid, index: true, foreign_key: true

      t.timestamps
    end
  end
end
