class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events, id: :uuid do |t|
      t.integer :event_type, default: 0
      t.integer :event_action, default: 0
      t.string :ip
      t.uuid :user_id
      t.uuid :customer_id
      t.string :item_url
      t.string :item
      t.text :description

      t.timestamps
    end

    add_index :events, :user_id
    add_index :events, :customer_id
  end
end
