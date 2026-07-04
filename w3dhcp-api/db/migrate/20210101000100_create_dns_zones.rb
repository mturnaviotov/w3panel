class CreateDnsZones < ActiveRecord::Migration[6.1]
  def change
    create_table :dns_zones, id: :uuid do |t|
      t.string :name, null: false
      t.string :kind, default: 'Master'
      t.string :masters, array: true, default: []
      t.string :nameservers, array: true, default: []
      t.string :serial, default: ''
      t.boolean :active, default: true
      t.boolean :disabled, default: false
      t.references :customer, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end

    add_index :dns_zones, :name, unique: true
  end
end
