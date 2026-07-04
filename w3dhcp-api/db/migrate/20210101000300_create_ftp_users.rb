class CreateFtpUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :ftp_users, id: :uuid do |t|

	t.string  :username, uniq: true
	t.string  :password, null: false
	t.integer :uid, default: 0
	t.integer :gid, default: 0
	t.string  :homedir, default: '', null: false
	t.string  :shell, default: '/bin/nologin'
	t.string  :last_login, defaul: ''
	t.integer :login_count, default: 0
	t.string  :last_error_login, defaul: ''
	t.references :customer, null: false, foreign_key: true, type: :uuid
	t.timestamps
    end
  end
end
