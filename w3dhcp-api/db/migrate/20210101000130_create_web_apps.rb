class CreateWebApps < ActiveRecord::Migration[6.1]
  def change
    create_table :web_apps, id: :uuid do |t|
      t.string 	   :name,	null: false
      t.boolean    :active,	default: true
      t.references :ip_address, null: false, foreign_key: true, type: :uuid
      t.references :customer,	null: false, foreign_key: true, type: :uuid
	  t.integer  :app_type, default: 0
	  t.integer  :system_uid, default: 0
	  t.string   :web_root, default: ''
	  t.string   :redirect_to, default: ''
	  t.string   :application_server, default: 'example.com'
	  t.inet     :ip_int, default: '127.0.0.1'
	  t.inet     :ip_ext, default: '10.10.10.10/32'
	  t.string   :container_id, default: ''
	  t.string   :image_name, default: ''
	  t.integer  :quota_cpu, default: 150000
	  t.string   :quota_mem, default: '512M'
	  t.boolean  :ssl, default: 'no'

      t.timestamps
    end

    add_index :web_apps, :name, unique: true

  end
end
