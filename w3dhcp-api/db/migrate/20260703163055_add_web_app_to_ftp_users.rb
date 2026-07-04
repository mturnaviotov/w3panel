class AddWebAppToFtpUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :ftp_users, :web_app_id, :uuid
    add_column :ftp_users, :application_server, :string
    add_column :ftp_users, :ip_address_id, :uuid
  end
end
