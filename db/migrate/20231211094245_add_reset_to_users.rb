class AddResetToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :reset_token, :string, default: nil
    add_column :users, :reset_sent_at, :datetime, default: nil
  end
end
