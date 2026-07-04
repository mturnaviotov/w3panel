class CreateRegistries < ActiveRecord::Migration[6.1]
	def change
		create_table :registries, id: :uuid do |t|

			t.string	:name,		unique: true, index: true
			t.boolean	:manual,	default: false
			t.timestamps
		end
	end
end
