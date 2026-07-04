class CreateSubscriptionTemplates < ActiveRecord::Migration[6.1]
	def change
		create_table :subscription_templates, id: :uuid do |t|
			t.string	:name,					null: false
			t.integer :kind, 					default: 0
			t.integer :term, 					default: 1 # months
			t.boolean :listed,				default: true   # published 

			# prices
			t.decimal :register,			precision: 8, scale: 2
			t.decimal :renew,					precision: 8, scale: 2
			t.decimal :transfer,			precision: 8, scale: 2
			t.decimal :redemption,		precision: 8, scale: 2

			# Quotas
			t.decimal :disk,					default: 0
			t.string	:disk_unit,			default: 'm'
			t.integer :web_apps,			default: 0
			t.integer :databases,			default: 0

			t.integer :dns,						default: 0

			t.references :reseller, null: false, foreign_key: true, type: :uuid
			t.timestamps
		end
		add_index :subscription_templates, :name, unique: true
	end
end
