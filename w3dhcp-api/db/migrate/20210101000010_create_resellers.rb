class CreateResellers < ActiveRecord::Migration[6.1]
  def change
    create_table :resellers, id: :uuid do |t|
      t.boolean :hosting_operator, default: false
      t.boolean :reseller_owner, default: false

      t.timestamps
    end
  end
end
