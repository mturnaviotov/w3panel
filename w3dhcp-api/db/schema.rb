# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2026_07_03_163055) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "hstore"
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  create_table "contacts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "voice", null: false
    t.string "cc", default: "UA"
    t.string "country", default: "Ukraine"
    t.string "zipcode", default: "001001"
    t.string "city", default: "Kyiv"
    t.string "sp", default: "Kyivska"
    t.string "address", default: ""
    t.text "billing_info", default: ""
    t.boolean "admin", default: false
    t.boolean "tech", default: false
    t.boolean "billing", default: false
    t.boolean "accept_eula", default: false
    t.boolean "accept_privacy", default: false
    t.uuid "customer_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_contacts_on_customer_id"
    t.index ["email"], name: "index_contacts_on_email", unique: true
    t.index ["voice"], name: "index_contacts_on_voice", unique: true
  end

  create_table "customers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "owner", default: false
    t.boolean "corporate", default: false
    t.string "name", null: false
    t.jsonb "epp", default: {}
    t.uuid "reseller_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_customers_on_name", unique: true
    t.index ["reseller_id"], name: "index_customers_on_reseller_id"
  end

  create_table "dns_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.string "records", null: false, array: true
    t.integer "ttl", default: 3600
    t.string "comments", array: true
    t.uuid "dns_zone_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["dns_zone_id"], name: "index_dns_records_on_dns_zone_id"
  end

  create_table "dns_zones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "kind", default: "Master"
    t.string "masters", default: [], array: true
    t.string "nameservers", default: [], array: true
    t.string "serial", default: ""
    t.boolean "active", default: true
    t.boolean "disabled", default: false
    t.uuid "customer_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_dns_zones_on_customer_id"
    t.index ["name"], name: "index_dns_zones_on_name", unique: true
  end

  create_table "domain_zones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "name_ascii"
    t.boolean "idn", default: false
    t.boolean "idn_only", default: false
    t.integer "min_registration_period", default: 1
    t.integer "max_registration_period", default: 10
    t.integer "min_domain_length", default: 1
    t.integer "max_domain_length", default: 63
    t.boolean "manual_processing", default: false
    t.boolean "licence_requirement", default: false
    t.boolean "files_upload_requirement", default: false
    t.boolean "proxy_contact_requirement", default: false
    t.boolean "period_hold_avail", default: true
    t.integer "period_hold_length", default: 29
    t.boolean "period_auto_renew_avail", default: true
    t.integer "period_auto_renew_length", default: 29
    t.boolean "period_redemption_avail", default: true
    t.integer "period_redemption_length", default: 30
    t.boolean "period_delete_avail", default: true
    t.integer "period_delete_length", default: 5
    t.text "comment", default: ""
    t.uuid "registry_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_domain_zones_on_name"
    t.index ["name_ascii"], name: "index_domain_zones_on_name_ascii"
    t.index ["registry_id"], name: "index_domain_zones_on_registry_id"
  end

  create_table "domains", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "name_ascii"
    t.string "licence", default: ""
    t.string "pw", default: ""
    t.hstore "contacts", default: {}
    t.hstore "ids", default: {}
    t.hstore "dates", default: {}
    t.string "hostobject", null: false, array: true
    t.string "status", default: [], array: true
    t.datetime "comment_reseller_date"
    t.string "comment_reseller_text", default: ""
    t.datetime "comment_owner_date"
    t.string "comment_owner_text", default: ""
    t.uuid "domain_zone_id"
    t.uuid "customer_id"
    t.uuid "registry_id"
    t.uuid "subscription_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_domains_on_customer_id"
    t.index ["domain_zone_id"], name: "index_domains_on_domain_zone_id"
    t.index ["name"], name: "index_domains_on_name"
    t.index ["name_ascii"], name: "index_domains_on_name_ascii"
    t.index ["registry_id"], name: "index_domains_on_registry_id"
    t.index ["subscription_id"], name: "index_domains_on_subscription_id"
  end

  create_table "events", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "event_type", default: 0
    t.integer "event_action", default: 0
    t.string "ip"
    t.uuid "user_id"
    t.uuid "customer_id"
    t.string "item_url"
    t.string "item"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["customer_id"], name: "index_events_on_customer_id"
    t.index ["user_id"], name: "index_events_on_user_id"
  end

  create_table "ftp_users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "username"
    t.string "password", null: false
    t.integer "uid", default: 0
    t.integer "gid", default: 0
    t.string "homedir", default: "", null: false
    t.string "shell", default: "/bin/nologin"
    t.string "last_login"
    t.integer "login_count", default: 0
    t.string "last_error_login"
    t.uuid "customer_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "web_app_id"
    t.string "application_server"
    t.uuid "ip_address_id"
    t.index ["customer_id"], name: "index_ftp_users_on_customer_id"
  end

  create_table "ip_addresses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.inet "ip", null: false
    t.boolean "shared", default: false
    t.boolean "default", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "orders", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "number"
    t.jsonb "items", null: false
    t.decimal "summ", null: false
    t.datetime "date", null: false
    t.hstore "from", default: {}
    t.hstore "to", default: {}
    t.hstore "approver", default: {}
    t.integer "status", default: 1
    t.datetime "approved"
    t.uuid "reseller_id"
    t.uuid "customer_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_orders_on_customer_id"
    t.index ["number"], name: "index_orders_on_number"
    t.index ["reseller_id"], name: "index_orders_on_reseller_id"
  end

  create_table "registries", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.boolean "manual", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_registries_on_name"
  end

  create_table "resellers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "hosting_operator", default: false
    t.boolean "reseller_owner", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "subscription_templates", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.integer "kind", default: 0
    t.integer "term", default: 1
    t.boolean "listed", default: true
    t.decimal "register", precision: 8, scale: 2
    t.decimal "renew", precision: 8, scale: 2
    t.decimal "transfer", precision: 8, scale: 2
    t.decimal "redemption", precision: 8, scale: 2
    t.decimal "disk", default: "0.0"
    t.string "disk_unit", default: "m"
    t.integer "web_apps", default: 0
    t.integer "databases", default: 0
    t.integer "dns", default: 0
    t.uuid "reseller_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_subscription_templates_on_name", unique: true
    t.index ["reseller_id"], name: "index_subscription_templates_on_reseller_id"
  end

  create_table "subscriptions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.integer "kind"
    t.integer "status", default: 0
    t.datetime "expiration"
    t.uuid "customer_id", null: false
    t.uuid "subscription_template_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_subscriptions_on_customer_id"
    t.index ["name", "kind", "customer_id"], name: "index_subscriptions_on_name_and_kind_and_customer_id", unique: true
    t.index ["subscription_template_id"], name: "index_subscriptions_on_subscription_template_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.boolean "active"
    t.uuid "customer_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_users_on_customer_id"
    t.index ["email"], name: "index_users_on_email"
  end

  create_table "web_apps", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.boolean "active", default: true
    t.uuid "ip_address_id", null: false
    t.uuid "customer_id", null: false
    t.integer "app_type", default: 0
    t.integer "system_uid", default: 0
    t.string "web_root", default: ""
    t.string "redirect_to", default: ""
    t.string "application_server", default: "example.com"
    t.inet "ip_int", default: "127.0.0.1"
    t.inet "ip_ext", default: "10.10.10.10"
    t.string "container_id", default: ""
    t.string "image_name", default: ""
    t.integer "quota_cpu", default: 150000
    t.string "quota_mem", default: "512M"
    t.boolean "ssl", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["customer_id"], name: "index_web_apps_on_customer_id"
    t.index ["ip_address_id"], name: "index_web_apps_on_ip_address_id"
    t.index ["name"], name: "index_web_apps_on_name", unique: true
  end

  add_foreign_key "contacts", "customers"
  add_foreign_key "customers", "resellers"
  add_foreign_key "dns_records", "dns_zones"
  add_foreign_key "dns_zones", "customers"
  add_foreign_key "domain_zones", "registries"
  add_foreign_key "domains", "customers"
  add_foreign_key "domains", "domain_zones"
  add_foreign_key "domains", "registries"
  add_foreign_key "domains", "subscriptions"
  add_foreign_key "ftp_users", "customers"
  add_foreign_key "orders", "customers"
  add_foreign_key "orders", "resellers"
  add_foreign_key "subscription_templates", "resellers"
  add_foreign_key "subscriptions", "customers"
  add_foreign_key "subscriptions", "subscription_templates"
  add_foreign_key "users", "customers"
  add_foreign_key "web_apps", "customers"
  add_foreign_key "web_apps", "ip_addresses"
end
