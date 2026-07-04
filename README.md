# W3Panel - Custom Hosting Management Platform

**W3Panel** is a fully-featured, custom-built hosting services management panel and infrastructure orchestration system developed with Ruby on Rails and ReactJS (Ant Design).

It was initially presented at the OSDN conference right before the COVID-19 pandemic. The main goal was to replace paid alternatives like Plesk or cPanel and build a robust system without using PHP/PERL for the control panel itself—avoiding the myriad of issues found in hundreds of abandoned free panels.

The system was designed from the ground up to secure both the internet and clients from compromised websites. Starting around 2014-2015 when Docker was emerging, the architecture adopted containerization so that every client website is completely independent. Each site runs in its own container with strict CPU/RAM quotas, and all outbound SSH, FTP, and SMTP ports are blocked (SMTP is routed exclusively through a private relay). If a site (e.g., a vulnerable WordPress instance) gets hacked, it can be isolated or shut down with a single command or via automated monitoring pro active system. 

While there is some overhead (each container has its own Apache/PHP), they are administered independently, with config files (`/etc/apache`, `/etc/php`) and directories (`/var/www`, `/var/log`) mounted from the host. At the time, standard panels like Plesk/cPanel ran a single shared Nginx and Apache instance for the entire server.

**Features include:**
- Domain management via EPP (Hostmaster, Ukrnames) and DNS zones (supported thousands of DNS zones and tens of thousands of domains in production on a now-defunct hosting provider).
- Management of FTP, users, email, and standard hosting services.
- Order processing with manual payment confirmation - lost recent code approaches,but LiqPay/PrivatBank (Ukraine) or other payment integrations, can be added
- Granular access roles for operators, resellers, and clients.
- A planned cluster architecture where a frontend Nginx routed traffic to multiple backend container machines via an internal DNS zone and OSPF routing.

*Note: Some recent infrastructure configurations and code additions were lost in 2022. However, this project is being shared so it doesn't fade into oblivion—knowing that many hosting providers, ISPs, and domain registrars still process things manually.*

---

## 📌 Project Status
**Development is stopped.**
Considering the almost non-existent popularity of small private hosting providers in the modern world, the active development of this panel has been halted. A portion of the infrastructure configuration was lost along with the code, but the existing codebase remains as a proof of work (portfolio) and a demonstration of architectural vision.

## 🏗 Architecture

The core architecture is built upon reverse proxying and container isolation:

- **Routing**: `Nginx proxy` -> `upstream Docker container` (running on one of the backend servers).
- **Service Discovery**: Nginx discovers the location of upstream containers via a **private DNS zone** plus OSPF routing. 
- **Isolation & Security**: Each client's website or application runs in its own isolated Docker container. To secure the internet from potentially compromised websites, strict rules are applied:
  - Outbound `FTP` and `SSH` connections from the containers are **blocked**.
  - Outbound `SMTP` traffic is forcibly routed to a **private mail relay** to control and prevent spam distribution.

## 💻 Tech Stack
- **Backend API**: latest on 2026 vetsions Ruby on Rails 8, Ruby 4.0, PostgreSQL, Redis/Queue.
- **Frontend**: React (w3dhcp-web) - latest reactjs/Vite approach + Ant.Design as UI framework
- **Infrastructure**: Docker, PowerDNS, Nginx, private DNS zone, isolated networks, ansible for async backround tasks via Rails/Resque module

---

## 🚀 Running a Local Demonstration

To explore the panel and see how it works locally, you can use the provided Docker Compose configuration.

1. Clone the repository and navigate to the project directory.
2. Start the demonstration environment:
   ```bash
   docker compose up
   ```
3. Once all containers are initialized, the panel's API and frontend will be accessible locally.
4. use user@axample.com as login and password for root user. all queries for unexistant EPP services are stubbed

> [!IMPORTANT]
> **This setup is strictly for local demonstration purposes.** The provided Docker configuration is tailored for development and previewing the system. For production deployment, infrastructure orchestration, or actual business use, please contact the author directly for help to production use
