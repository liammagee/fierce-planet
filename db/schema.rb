# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110722161753) do

  create_table "capabilities", :force => true do |t|
    t.integer  "capability_type"
    t.string   "name"
    t.string   "code"
    t.text     "description"
    t.string   "icon"
    t.integer  "resource_level_cost"
    t.integer  "agent_pay_out"
    t.integer  "required_credits"
    t.integer  "required_level"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "entry_points", :force => true do |t|
    t.integer  "level_id"
    t.integer  "agent_type"
    t.integer  "x"
    t.integer  "y"
    t.boolean  "renew_each_wave"
    t.integer  "initial_number"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "feedbacks", :force => true do |t|
    t.integer  "user_id"
    t.text     "comments"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "levels", :force => true do |t|
    t.string   "name"
    t.integer  "world_width"
    t.integer  "world_height"
    t.integer  "initial_agent_number"
    t.integer  "wave_number"
    t.integer  "expiry_limit"
    t.boolean  "allow_offscreen_cycling"
    t.boolean  "allow_patches_on_path"
    t.text     "notice"
    t.text     "tiles"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image_src"
    t.string   "sound_src"
    t.string   "entry_points"
    t.string   "exit_points"
    t.string   "google_map_tilt"
    t.string   "google_map_zoom"
    t.string   "google_map_long"
    t.string   "google_map_lat"
    t.text     "resources"
  end

  create_table "profile_capabilities", :force => true do |t|
    t.integer  "profile_id"
    t.integer  "capability_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "profiles", :force => true do |t|
    t.integer  "user_id"
    t.string   "nickname"
    t.integer  "current_score"
    t.integer  "highest_score"
    t.integer  "current_level"
    t.integer  "highest_level"
    t.string   "status"
    t.text     "capabilities"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "total_saved",                               :default => 0
    t.integer  "total_expired",                             :default => 0
    t.integer  "total_resources_spent",                     :default => 0
    t.integer  "total_economic_resources",                  :default => 0
    t.integer  "total_environmental_resources",             :default => 0
    t.integer  "total_social_resources",                    :default => 0
    t.integer  "credits",                                   :default => 0
    t.string   "profile_class",                             :default => "Novice"
    t.integer  "progress_towards_next_class",               :default => 0
    t.integer  "total_levels",                              :default => 0
    t.string   "total_resources_spent_by_category",         :default => ""
    t.integer  "ave_saved",                                 :default => 0
    t.integer  "ave_expired",                               :default => 0
    t.integer  "ave_resources_spent",                       :default => 0
    t.string   "ave_resources_spent_by_category",           :default => ""
    t.integer  "game_total_levels",                         :default => 0
    t.integer  "game_highest_level",                        :default => 0
    t.integer  "game_score",                                :default => 0
    t.integer  "game_total_saved",                          :default => 0
    t.integer  "game_total_expired",                        :default => 0
    t.integer  "game_total_resources_spent",                :default => 0
    t.string   "game_total_resources_spent_by_category",    :default => ""
    t.integer  "game_ave_saved",                            :default => 0
    t.integer  "game_ave_expired",                          :default => 0
    t.integer  "game_ave_resources_spent",                  :default => 0
    t.string   "game_ave_resources_spent_by_category",      :default => ""
    t.boolean  "current_level_is_preset",                   :default => true
    t.integer  "current_level_waves",                       :default => 0
    t.integer  "current_level_saved_this_wave",             :default => 0
    t.integer  "current_level_saved",                       :default => 0
    t.integer  "current_level_expired",                     :default => 0
    t.integer  "current_level_resources_in_store",          :default => 0
    t.integer  "current_level_resources_spent",             :default => 0
    t.string   "current_level_resources_spent_by_category", :default => ""
  end

  create_table "services", :force => true do |t|
    t.integer  "user_id"
    t.string   "provider"
    t.string   "uid"
    t.string   "uname"
    t.string   "uemail"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                               :default => "",    :null => false
    t.string   "encrypted_password",   :limit => 128, :default => "",    :null => false
    t.string   "reset_password_token"
    t.string   "remember_token"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                       :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "admin",                               :default => false
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
