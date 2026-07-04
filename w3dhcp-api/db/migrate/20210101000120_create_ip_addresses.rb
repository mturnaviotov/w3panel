class CreateIpAddresses < ActiveRecord::Migration[6.1]
  def change
    create_table :ip_addresses, id: :uuid do |t|
      t.inet 	:ip, null: false
      t.boolean :shared, default: false
      t.boolean :default, default: false

      t.timestamps
    end
  end
end
