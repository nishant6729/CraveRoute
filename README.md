<div align="center">

<!-- Hero Banner / Logo -->
<img src="https://img.shields.io/badge/CraveRoute-AI%20Food%20Delivery-174C3C?style=for-the-badge&logo=leaf&logoColor=white" alt="CraveRoute" height="65"/>

# CraveRoute

### 🍽️ Enterprise-Grade Microservices Food Delivery & Real-Time Tracking Platform

*Smart Ordering. Event-Driven Reliability. Seamless Delivery.*

<br/>

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring_Cloud-2024-6DB33F?style=for-the-badge&logo=spring&logoColor=white)](https://spring.io/projects/spring-cloud)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-Event_Bus-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)](https://kafka.apache.org/)
[![Redis](https://img.shields.io/badge/Redis-Geospatial_&_Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Groq AI](https://img.shields.io/badge/Groq_AI-Llama_3.3_70B-F55036?style=for-the-badge&logo=openai&logoColor=white)](https://groq.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/Grafana-Observability-F46800?style=for-the-badge&logo=grafana&logoColor=white)](https://grafana.com/)

<br/>

> **CraveRoute** is a production-ready, distributed cloud microservices food delivery ecosystem engineered with **Spring Boot 3**, **Apache Kafka**, **Redis Geospatial**, **React 18**, and an autonomous **Groq LLM AI Assistant**. It handles distributed transactions via SAGA Choreography, streams live driver telematics over WebSockets, and delivers end-to-end full-stack observability.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Architectural Highlights](#-key-architectural-highlights)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
  - [High-Level Topology](#high-level-topology)
  - [SAGA Transaction Choreography](#saga-transaction-choreography)
- [Microservices Catalog](#-microservices-catalog)
- [Core Features](#-core-features)
  - [🛒 Customer Experience](#-customer-experience)
  - [🛵 Driver Delivery Portal](#-driver-delivery-portal)
  - [🏪 Restaurant Owner Management](#-restaurant-owner-management)
  - [🤖 CraveRoute AI Assistant](#-craveroute-ai-assistant)
- [Quick Start with Docker](#-quick-start-with-docker)
- [Local Development Setup](#-local-development-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Kafka Event Streams](#-kafka-event-streams)
- [Observability & Monitoring](#-observability--monitoring)
- [Project Directory Structure](#-project-directory-structure)
- [UI & Screenshots](#-ui--screenshots)
- [Author & Credits](#-author--credits)
- [License](#-license)

---

## 🌟 Overview

Modern on-demand food delivery platforms require extreme availability, eventual consistency across multiple domains, high-frequency spatial tracking, and seamless multi-persona workflows.

**CraveRoute** demonstrates how to solve these distributed systems challenges in production:

| Problem Domain | Distributed Challenge | CraveRoute Solution |
|---|---|---|
| **Checkout Consistency** | Multi-service transaction failure risks (Inventory, Payment, Delivery) | **SAGA Choreography** via Kafka with automated compensating events and zero distributed locking overhead |
| **Telemetry Scalability** | Relational DB bottleneck under high-frequency driver GPS pings | **Redis Geospatial (GEOADD/GEORADIUS)** + WebSocket STOMP fan-out directly to client maps |
| **Intelligent Assistance** | Static FAQ bots fail to handle transactional actions | **CraveRoute AI**: Context-aware Spring AI + Groq (`llama-3.3-70b-versatile`) with native **Function / Tool Calling** |
| **Domain Decoupling** | Monolithic dependencies and schema coupling | **Database-per-Service pattern** isolating 7 distinct MySQL databases with asynchronous event streams |
| **Operational Visibility** | Black-box failures in multi-container microservices | **Micrometer + Prometheus + Grafana** unified dashboards tracking JVM, Kafka lag, and HTTP latency |

---

## 🚀 Key Architectural Highlights

- **Decoupled Microservice Boundaries**: 10 independent microservices communicating via asynchronous event-driven messaging and Spring Cloud Gateway.
- **Service Discovery & Config Centralization**: Netflix Eureka dynamically registers backend nodes, while Spring Cloud Config Server provides externalized, environment-aware properties.
- **Resilient SAGA Pattern**: Complete transaction lifecycle management (Order Placed ➔ Stock Checked ➔ Wallet Settled ➔ Courier Assigned) with automatic rollback compensations if any stage fails.
- **State-of-the-Art Generative AI**: Autonomous assistant that can inspect menus, check real-time order states, query user wallets, and add dishes directly into cart via tool execution.
- **Full-Stack Containerization**: One-click orchestration of 15 services and supporting data infrastructure via multi-stage Docker builds.

---

## 🛠 Tech Stack

### Backend & Cloud Microservices
| Technology | Version / Spec | Role in CraveRoute |
|---|---|---|
| **Java** | 21 (LTS OpenJDK) | Modern Java runtime utilizing virtual threads & records |
| **Spring Boot** | 3.x | Core application framework across all microservices |
| **Spring Cloud** | 2024 (Leyton) | API Gateway, Eureka Registry, Config Server |
| **Apache Kafka** | 3.x + Zookeeper | Distributed event stream backbone for SAGA workflows |
| **Redis** | 7.x | High-throughput Geospatial indexing, cart session cache, LLM memory |
| **MySQL** | 8.0 | Relational storage adopting Database-per-Service isolation |
| **Spring Security & JJWT** | 0.12.x | Stateless JWT authentication, role authorization, password hashing |
| **Spring AI** | 1.0.x | Tool-calling integration layer for Groq LLM |
| **Groq LLM** | `llama-3.3-70b-versatile` | Ultra-fast inference engine driving CraveRoute AI |
| **WebSockets** | STOMP + SockJS | Live GPS telematics streaming between drivers and customers |
| **Gradle** | Kotlin DSL | Service-level build and dependency automation |

### Frontend Client
| Technology | Role in CraveRoute |
|---|---|
| **React 18** | High-performance SPA with hooks and context state management |
| **Vite 6** | Modern bundler with lightning-fast Hot Module Replacement (HMR) |
| **Tailwind CSS v4** | Custom-themed modern UI design system with responsive layouts |
| **Leaflet.js** | Interactive live mapping and driver route visualization |
| **Lucide React** | Clean, accessible vector icon set |
| **Axios** | Interceptor-managed HTTP client with automated JWT injection |
| **SockJS / STOMP.js** | Client-side WebSocket subscriber for live driver tracking |

### DevOps, Monitoring & Tooling
| Tool | Purpose |
|---|---|
| **Docker & Docker Compose** | Multi-container orchestration for the complete stack |
| **Nginx** | Reverse proxy and production static asset serving for the web app |
| **Prometheus** | Time-series metrics collection via Spring Boot Actuators |
| **Grafana** | Pre-provisioned operational dashboards and real-time observability |

---

## 🏛️ System Architecture

### High-Level Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                      React 18 Single Page App                          │
│               http://localhost:5173  (Dev) / :3000 (Docker)            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST / STOMP WebSockets
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Spring Cloud API Gateway  (:8080)                    │
│             JWT Verification · Route Forwarding · Rate Limiting        │
└────────┬──────────┬──────────┬──────────┬──────────┬──────────┬────────┘
         │          │          │          │          │          │
         ▼          ▼          ▼          ▼          ▼          ▼
    User Svc   Restaurant    Order     Payment    Delivery      AI
     :8081       :8082       :8083      :8085      :8084      :8087
    (user_db) (rest_db)   (order_db) (pay_db)   (deliv_db)   (Redis)
         │          │          │          │          │          │
         └──────────┴──────────┴────┬─────┴──────────┴──────────┘
                                    │
                                    ▼
         ══════════════════════════════════════════════════════
               Apache Kafka Event Bus (SAGA Choreography)
         ══════════════════════════════════════════════════════
                                    ▲
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         │ Notification Service (:8086) [Gmail SMTP Dispatcher] │
         └─────────────────────────────────────────────────────┘

         Infrastructure:
         • Netflix Eureka (:8761)    • Spring Cloud Config (:8888)
         • MySQL 8.0 Cluster (:3306) • Redis Key-Value & Geo (:6379)
         • Prometheus (:9090)        • Grafana Observability (:3001)
```

---

### SAGA Transaction Choreography

CraveRoute ensures distributed data consistency across independent microservices using asynchronous domain events. If any step fails (e.g., insufficient wallet balance), compensating rollback events restore state automatically:

```
[ Customer ] ─── Checkout ───► [ Order Service ]
                                      │
                                      ▼ (order.placed)
                            [ Restaurant Service ]
                                      │
                       ┌──────────────┴──────────────┐
                 (Item Available)              (Out of Stock)
                       │                              │
                       ▼ (restaurant.confirmed)       ▼ (restaurant.rejected)
               [ Order Service ]             [ Order Service ] (Marks FAILED)
                       │
                       ▼ (payment.requested)
               [ Payment Service ]
                       │
         ┌─────────────┴─────────────┐
    (Wallet Debited)           (Insufficient Funds)
         │                           │
         ▼ (payment.completed)       ▼ (payment.failed)
   [ Delivery Service ]        [ Order Service ]
   (Assigns Courier)           (Compensates & Cancels Order)
         │
         ▼ (delivery.requested)
   [ Driver Dispatched ] ──► (Real-time GPS via Redis) ──► [ Customer Live Map ]
```

---

## 🔧 Microservices Catalog

| Service Name | Port | Primary Responsibilities | Data Store |
|---|:---:|---|---|
| **API Gateway** | `8080` | Entry point, JWT token validation, dynamic routing, CORS configuration | — |
| **Discovery Server** | `8761` | Netflix Eureka service registry & heartbeat health management | In-Memory |
| **Config Server** | `8888` | Centralized external configuration repository for all Spring microservices | Native Git/FS |
| **User Service** | `8081` | Authentication (Register/Login/OTP), profile management, digital wallet | `user_db` (MySQL) |
| **Restaurant Service** | `8082` | Restaurant profiles, multi-category menus, meal options, ratings | `restaurant_db` (MySQL) |
| **Order Service** | `8083` | Shopping cart session, checkout, order lifecycle, SAGA coordination | `order_db` (MySQL) |
| **Delivery Service** | `8084` | Automated driver dispatch, live GPS telemetry, Redis geospatial lookup | `delivery_db` + Redis |
| **Payment Service** | `8085` | Digital wallet debits/credits, ledger records, restaurant payouts | `payment_db` (MySQL) |
| **Notification Service**| `8086` | Event-driven transactional email dispatch via Gmail SMTP | `notification_db` (MySQL)|
| **AI Assistant Service**| `8087` | Groq Llama 3.3 LLM, dynamic function calling, Redis chat memory | Redis Cache |

---

## ✨ Core Features

### 🛒 Customer Experience
- **Authentication & Security**: Email-verified signup with secure One-Time Password (OTP) verification and JWT session tokens.
- **Dynamic Restaurant Catalog**: Instant search across culinary categories, price brackets, preparation times, and dietary preferences.
- **Interactive Menu & Cart**: Real-time cart state with quantity adjustments, dietary tags (Veg / Non-Veg), and Redis-backed session durability.
- **Live Order Tracking**: Interactive Leaflet map displaying driver dispatch, real-time GPS coordinates updates, and distance calculations.
- **In-App Digital Wallet**: Instant wallet top-up, transaction statements, and one-tap checkout.
- **Order Timeline**: End-to-end status visibility from Kitchen Preparation ➔ Driver Pickup ➔ Out for Delivery ➔ Completed.

### 🛵 Driver Delivery Portal
- **Dispatch Center**: Instant notifications for incoming delivery opportunities with pickup and drop-off coordinates.
- **Turn-by-Turn Navigation**: Real-time route rendering with embedded coordinates updates broadcast to customer tracking screens.
- **Trip Lifecycle Controls**: Status toggle (`Accepted`, `Picked Up`, `En Route`, `Delivered`).
- **Driver Analytics**: Historical trip log, completed deliveries, and daily earnings summary.

### 🏪 Restaurant Owner Management
- **Merchant Dashboard**: Real-time sales telemetry, active order queues, and revenue statistics.
- **Menu Engineering**: Complete control over menu categories, pricing, item availability toggles, and food imagery.
- **Kitchen Workflow**: Accept, reject, and advance order states through preparation stages.
- **Store Configuration**: Manage operational hours, delivery radius, contact details, and location metadata.

### 🤖 CraveRoute AI Assistant
- **High-Velocity LLM**: Powered by Groq's ultra-low latency `llama-3.3-70b-versatile` model through Spring AI.
- **Direct Tool / Function Calling**: CraveRoute AI can autonomously execute actions on the user's behalf:
  - `checkOrderStatus(orderId)`: Retrieve real-time progress of active orders.
  - `getWalletBalance()`: Check current digital wallet funds.
  - `searchDishes(query)`: Discover specific menu items across nearby restaurants.
  - `addItemToCart(restaurantId, itemId, quantity)`: Add meals directly to the active checkout session.
- **Context-Aware Dialogue**: Maintains sliding-window conversational memory stored in Redis.
- **Voice-Enabled Interface**: Integrated Web Speech API for voice queries and hands-free interaction.

---

## 🐳 Quick Start with Docker

The fastest way to run CraveRoute locally is using **Docker Compose**, which launches all 10 microservices, the frontend, databases, message broker, cache, and monitoring tools in a single command.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (v24.0+) & Docker Compose V2
- Minimum **4 GB – 8 GB** available RAM
- Free [Groq API Key](https://console.groq.com)
- Gmail account with an [App Password](https://myaccount.google.com/apppasswords) (for transactional emails)

### 1. Clone the Repository
```bash
git clone https://github.com/nishant6729/craveroute.git
cd craveroute
```

### 2. Configure Environment Variables
Copy the template file:
```bash
cp .env.example .env
```

Open `.env` and configure your credentials:
```env
# Database Credentials
DB_USERNAME=root
DB_PASSWORD=your_strong_mysql_password

# JWT Security
JWT_SECRET=craveRouteSuperSecretSigningKeyThatIsAtLeast64CharactersLong1234567890
JWT_EXPIRATION=86400000

# Transactional Email (Gmail SMTP)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-character-gmail-app-password

# CraveRoute AI (Groq LLM)
GROK_API_KEY=gsk_your_groq_api_key_here
GROK_MODEL=llama-3.3-70b-versatile
```

### 3. Spin Up the Platform
```bash
docker compose up -d --build
```

### 4. Seed Initial Restaurant & Menu Data
Populate the database with curated restaurants, menus, categories, and dishes:
```bash
docker exec -i mysql mysql -uroot -pyour_strong_mysql_password < phase2-seed.sql
```

### 5. Access the Platform
| Portal / Service | URL | Credentials / Notes |
|---|---|---|
| 🌐 **CraveRoute Web App** | **http://localhost:3000** | Customer, Driver & Owner Portals |
| 🔌 **API Gateway** | **http://localhost:8080** | Central REST Gateway |
| 🔍 **Eureka Service Registry** | **http://localhost:8761** | View registered microservices |
| 📊 **Grafana Observability** | **http://localhost:3001** | `admin` / `admin` |
| 📈 **Prometheus Metrics** | **http://localhost:9090** | Microservices scraping metrics |

---

## 💻 Local Development Setup

You can run individual services locally for development while running shared infrastructure in Docker.

### Step 1: Start Shared Infrastructure
```bash
docker compose up -d mysql redis kafka zookeeper config-server discovery-server
```

### Step 2: Start a Backend Microservice
Navigate to any service directory under `Backened/` and run it with Gradle:
```bash
cd Backened/user-service
./gradlew bootRun
```
*(Repeat for other services such as `restaurant-service`, `order-service`, `api-gateway`, etc.)*

### Step 3: Start the Frontend Dev Server
In another terminal, launch the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
The React development server will start at `http://localhost:5173`. Requests to `/api/*` are automatically proxied to the API Gateway at port `8080`.

---

## ⚙️ Environment Variables

| Variable | Description | Default / Required |
|---|---|---|
| `DB_USERNAME` | MySQL database master username | `root` |
| `DB_PASSWORD` | MySQL database root password | *Required* |
| `JWT_SECRET` | 256-bit secret key for signing auth tokens (min 64 chars) | *Required* |
| `JWT_EXPIRATION` | JWT token validity in milliseconds | `86400000` (24h) |
| `MAIL_USERNAME` | Gmail account for transactional notifications | *Required for email* |
| `MAIL_PASSWORD` | Gmail App Password (16 characters) | *Required for email* |
| `GROK_API_KEY` | Groq platform API key for Llama 3.3 model | *Required for AI* |
| `GROK_MODEL` | Groq model identifier | `llama-3.3-70b-versatile` |

---

## 📡 API Reference

All requests route through the **API Gateway** on `http://localhost:8080`.

### 🔐 Authentication (`/api/users`)
```http
POST /api/users/register          # Register user (CUSTOMER, DRIVER, RESTAURANT_OWNER)
POST /api/users/login             # Authenticate & receive JWT bearer token
POST /api/users/verify-otp        # Verify registration OTP
GET  /api/users/profile           # Retrieve current user profile
```

### 🍽️ Restaurants & Menus (`/api/restaurants`)
```http
GET  /api/restaurants             # List active restaurants
GET  /api/restaurants/{id}        # Restaurant profile & catalog
GET  /api/restaurants/search?q=   # Full-text query on name or cuisine
POST /api/restaurants             # Register new restaurant (Owner only)
POST /api/restaurants/{id}/menu   # Add menu item (Owner only)
```

### 🛒 Cart & Checkout (`/api/cart`)
```http
GET    /api/cart                  # Retrieve active session cart
POST   /api/cart/items            # Add dish to cart
DELETE /api/cart/items/{itemId}   # Remove specific dish
DELETE /api/cart                  # Empty shopping cart
```

### 📦 Orders & SAGA (`/api/orders`)
```http
POST /api/orders                  # Initiate checkout and trigger SAGA pipeline
GET  /api/orders/{id}             # Inspect specific order state and history
GET  /api/orders/my-orders        # Get order history for current customer
PATCH /api/orders/{id}/status     # Update status (Kitchen / Driver workflows)
```

### 💳 Digital Wallet (`/api/users/wallet`)
```http
GET  /api/users/wallet            # Query current wallet balance
POST /api/users/wallet/add        # Deposit test funds to wallet
GET  /api/users/wallet/history    # View audit ledger of transactions
```

### 🤖 CraveRoute AI Assistant (`/api/ai`)
```http
POST /api/ai/chat                 # Send user prompt to Groq AI agent
```

---

## 📨 Kafka Event Streams

CraveRoute communicates across microservices using strongly-typed event topics:

| Topic Name | Producer Service | Consumer Service(s) | Business Event |
|---|---|---|---|
| `order.placed` | `Order Service` | `Restaurant Service` | New order created, triggers stock confirmation |
| `restaurant.confirmed` | `Restaurant Service` | `Order Service` | Kitchen accepts order preparation |
| `payment.requested` | `Order Service` | `Payment Service` | Requests wallet deduction for order |
| `payment.completed` | `Payment Service` | `Order Service`, `Delivery Service` | Payment successful; triggers courier assignment |
| `payment.failed` | `Payment Service` | `Order Service` | Insufficient funds; triggers SAGA rollback |
| `delivery.requested` | `Payment Service` | `Delivery Service` | Courier assignment and route allocation |
| `delivery.completed` | `Delivery Service` | `Payment Service`, `Order Service` | Trip finished; triggers merchant settlement |
| `order.cancelled` | `Order Service` | `Payment Service`, `Restaurant Service` | Compensating rollback for failed transactions |
| `notification.*` | All Services | `Notification Service` | Dispatches real-time transactional email |

---

## 📊 Observability & Monitoring

CraveRoute includes production-grade observability out of the box:

- **Prometheus Metric Ingestion** (`:9090`): Automatically scrapes all microservice actuator endpoints every 15 seconds.
- **Grafana Visualization Hub** (`:3001`): Pre-provisioned dashboards covering:
  - **JVM Health**: Heap memory, Garbage Collection pauses, active thread counts.
  - **HTTP Metrics**: Request rates, 4xx/5xx error rates, response latencies (p50, p95, p99).
  - **Kafka Consumer Lag**: Offset monitoring across order, payment, and delivery topics.
  - **HikariCP Pool**: Active, idle, and waiting database connections per service.
  - **Redis Performance**: Command durations, memory consumption, key hit rates.
  - **AI Assistant Metrics**: Token consumption, chat latencies, and tool call distribution.

---

## 📁 Project Directory Structure

```
craveroute/
├── Backened/                     # Java 21 / Spring Boot Microservices
│   ├── ai-assistant-service/     # Spring AI + Groq LLM integration
│   ├── api-gateway/              # Spring Cloud Gateway routing & JWT security
│   ├── config-server/            # Centralized cloud configuration server
│   ├── delivery-service/         # Driver dispatch & Redis geospatial tracking
│   ├── discovery-server/         # Netflix Eureka service registry
│   ├── notification-service/     # Asynchronous email dispatch via Gmail SMTP
│   ├── order-service/            # Order state machine & SAGA orchestration
│   ├── payment-service/          # Wallet debits, credits & transaction ledger
│   ├── restaurant-service/       # Restaurant listings, categories & menus
│   └── user-service/             # User auth, roles, profiles & wallet core
├── frontend/                     # React 18 + Vite 6 Single Page Application
│   ├── src/
│   │   ├── api/                  # Axios HTTP clients & API endpoints
│   │   ├── components/           # Reusable UI widgets & atomic components
│   │   ├── context/              # React state providers (Auth, Cart, Theme)
│   │   ├── layouts/              # Multi-role layout wrappers
│   │   ├── pages/                # Customer, Driver & Owner page views
│   │   │   ├── customer/         # Restaurant browsing, checkout & live tracking
│   │   │   ├── driver/           # Driver dispatch board & navigation
│   │   │   └── owner/            # Kitchen dashboard & menu management
│   │   ├── services/             # WebSocket STOMP client & utility services
│   │   ├── store/                # Persistent client-side stores
│   │   └── index.css             # Tailwind CSS custom themes & design tokens
│   └── vite.config.js            # Vite bundler configuration & reverse proxy
├── grafana/
│   └── provisioning/             # Automated datasources & dashboard definitions
├── docker-compose.yml            # Complete 15-container stack orchestration
├── prometheus.yml                # Prometheus metrics scraping configuration
├── phase2-seed.sql               # Curated seed database script
└── .env.example                  # Environment configuration template
```

---

## 📸 UI & Screenshots

| View | Description |
|---|---|
| 🏠 **Customer Discovery** | Visual restaurant cards, cuisine tagging, and responsive search |
| 🍕 **Interactive Menu** | Category navigation, dish customizations, and instant cart sync |
| 🗺️ **Live Driver Tracking** | Dynamic Leaflet map displaying real-time driver GPS coordinates |
| 🤖 **CraveRoute AI** | Conversational assistant executing real-time order queries & menu actions |
| 📊 **Merchant Console** | Live order management, revenue telemetry, and catalog controls |
| 🚗 **Driver Navigation** | Delivery dispatch acceptance, trip status toggles, and route display |

---

## 👤 Author & Credits

**CraveRoute** is designed, developed, and maintained by **Nishant Gurjar**.

<br/>

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-nishant6729-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nishant6729)
[![Portfolio](https://img.shields.io/badge/Developer-Nishant%20Gurjar-174C3C?style=for-the-badge&logo=codeforces&logoColor=white)](https://github.com/nishant6729)

**Nishant Gurjar**  
*Full Stack & Distributed Systems Engineer*  
GitHub: [@nishant6729](https://github.com/nishant6729)

</div>

<br/>

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute this codebase for learning and development.

<br/>

<div align="center">

Made with ❤️ and engineered with **Java 21**, **Spring Boot 3**, **React 18**, **Kafka**, and **Groq AI**.

⭐ **Star this repository** if you found CraveRoute helpful or inspiring!

</div>
