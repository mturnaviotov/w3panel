class CreateSubscriptions < ActiveRecord::Migration[6.1]
	def change
		create_table :subscriptions, id: :uuid do |t|
			t.string	:name
			t.integer :kind,				default: ''
			t.integer :status,			default: 0
			t.datetime :expiration,	default: ''
			
			t.references :customer, null: false, foreign_key: true, type: :uuid
			t.references :subscription_template, null: false, foreign_key: true, type: :uuid

			t.timestamps
		end

		add_index :subscriptions, [:name, :kind, :customer_id], unique: true
	end
end
