---
name: w3panel-context
description: Architectural context and status of the W3Panel project for AI agents.
---

# W3Panel Architecture & Status Context

When working with this repository, the AI MUST keep the following context in mind:

### 1. Project Status (Portfolio / Archived)
The development of this hosting panel is **stopped** due to the low popularity of small private hosting services. The code serves as a proof of the developer's skills (portfolio).
- The infrastructure configuration is partially lost.
- Do not try to independently "fix" missing configurations unless the user explicitly asks to do so. Focus on working with the existing codebase.

### 2. Core Architecture
- **Routing**: `Nginx proxy` -> `upstream docker container` (the container is located on one of the servers).
- **Service Discovery**: Nginx discovers the correct upstream via a **private DNS zone**.
- **Security and Isolation**: Every client application is isolated.
  - To secure the internet from potential website hacks, **outbound FTP and SSH ports are blocked**.
  - **Outbound SMTP** traffic is blocked and routed to a **private mail relay**.

### 3. Rules for AI
- When analyzing code related to DNS, domains, and zones, always remember that the architecture relies on a private DNS zone for communication between Nginx and Docker.
- When solving network issues, consider the strict Firewall limitations (blocked outbound FTP/SSH, proxied SMTP).
