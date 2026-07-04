class CreateCustomers < ActiveRecord::Migration[6.1]
  def change
    create_table :customers, id: :uuid do |t|
      t.boolean :owner,      default: false
      t.boolean :corporate,  default: false
      t.string  :name,       null:    false
	    t.jsonb   :epp,        default: {}
      t.references :reseller, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end

    add_index :customers, :name,  unique: true
  end
end
