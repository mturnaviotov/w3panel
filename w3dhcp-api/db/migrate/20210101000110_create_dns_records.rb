class CreateDnsRecords < ActiveRecord::Migration[6.1]
  def change
    create_table :dns_records, id: :uuid do |t|
      t.string :name,		null: false
      t.string :record_type,	null: false
      t.string :records,	array: true, null: false
      t.integer :ttl,		default: 3600
      t.string :comments,	array: true
      t.references :dns_zone, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end

  end
end
