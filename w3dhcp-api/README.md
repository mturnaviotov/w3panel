# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

# Installation:

    1. Create system user - for example w3dhcp, which will be used as application user with non-root privileges
    2. Install last stable ruby via rbenv (I use zsh in this example)
    3. Install PostgreSQL with server dev package
4. Execute SQL script:

  run psql (no root role is present)

 `sudo -u $psql_user psql``
 `CREATE ROLE w3dhcp superuser;
  CREATE DATABASE w3dhcp_development;
  grant all privileges on database w3dhcp_development to w3dhcp;
  alter role w3dhcp with login;
 `

5. then after `rails db:migrate` you need to drop superuser role, which was reqired to enable uuid and crypto extensions:

 `alter role w3dhcp nosuperuser;`

## Notes on Development Environment
**EPP Configuration:**
In this environment, we do not have access to an actual EPP server. 
The real EPP processing logic depends on a config file at `/opt/w3dhcp/config.yml`.
Because this file is missing, we have commented out the actual EPP commands in `app/controllers/concerns/epp_commands.rb` 
and replaced them with a stub that always returns a success JSON response. When deploying to production, 
uncomment the EPP logic and ensure the config file is present.

**Domain Check Stub:**
Similarly, because we lack a real EPP connection, the domain availability check in `app/controllers/domain_controller.rb` (`check_result`) has been stubbed to always return `{ avail: true }` without querying the registry. The original `Domain.epp_check` call is commented out.

**Order Processing Stub:**
The asynchronous order processing using `Resque.enqueue(TestJob)` has been commented out in `app/models/order.rb` (`process`) to avoid crashing when the job runner is inactive or when the EPP config is missing. Instead, a synchronous stub creates the `Domain` and `Subscription` records in the database with status "ok" and a 1-year expiration date, simulating a successful EPP transaction.

## TODOs / Technical Debt
* **Database Seeding Dependency:** The DNS server (PowerDNS) must be running and accessible *before* executing `rails db:seed`. Since the seeds create default DNS zones (e.g. `example.com`) which automatically trigger callbacks to sync the zone and SOA records via the PowerDNS API, running the seed without an active DNS server will fail or leave the zones unpopulated.

* **Order Creation Template Search:** We have "relaxed" the search when finding the price template for an order in `app/controllers/orders_controller.rb`. We now use a partial match (`LIKE "#{zone_name}%"`) instead of the older, strictly accurate search via `zone_prices` (which were removed). This should ideally be refactored to explicitly link templates to domain zones in the DB schema to ensure we don't accidentally pick the wrong template if prefixes overlap.

* **Order Processing Job (`Order::TestJob`):** Previously, `Resque.enqueue(Order::TestJob)` was used to asynchronously connect to the EPP registry to register domains and launch web apps on physical nodes using Ansible. Since Resque/Redis is disabled in this environment, this functionality is currently bypassed by a synchronous DB stub in `app/models/order.rb`.
  * **Implementation Reference:** A template for the background processor has been preserved in `app/jobs/test_job.rb`. It outlines the required logic: triggering the `MeppClient`, allocating an IP, defining a `system_uid`, creating the `WebApp` record, and executing the Ansible playbook to spawn a restricted Docker container.
  * **Ansible Template:** An Ansible playbook template `scripts/create_web_app.yml` has been added. It expects variables like `web_app_name`, `image_name`, `system_uid`, and enforces Docker quotas (`cpu_quota`, `memory`) while mounting `/var/customers/{id}/{app}` directories with identical FTP/Apache permissions.
