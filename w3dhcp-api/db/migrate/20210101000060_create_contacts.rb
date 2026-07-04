class CreateContacts < ActiveRecord::Migration[6.1]
	def change
		create_table :contacts, id: :uuid do |t|
			t.string	:name,			null: false
			t.string	:email,			null: false
			t.string	:voice,		  null: false

			t.string	:cc,				default: 'UA'
			t.string	:country,		default: 'Ukraine'
			t.string	:zipcode,		default: '001001'
			t.string	:city,			default: 'Kyiv'
			t.string	:sp,				default: 'Kyivska'
			t.string	:address,		default: ''

			t.text    :billing_info,    default: ''
			t.boolean :admin,						default: false
			t.boolean :tech,						default: false
			t.boolean :billing,					default: false
			t.boolean :accept_eula,			default: false
			t.boolean :accept_privacy,	default: false

			t.references :customer, null: false, foreign_key: true, type: :uuid

			t.timestamps

		end

		add_index :contacts, :email, unique: true
		add_index :contacts, :voice, unique: true

	end
end
