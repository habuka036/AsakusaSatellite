class CreateRooms < ActiveGroonga::Migration
  def up
    create_table(:rooms) do |table|
      table.short_text(:title)
      table.time(:created_at)
      table.reference(:user, "users")
    end
  end

  def down
    remove_table(:rooms)
  end
end