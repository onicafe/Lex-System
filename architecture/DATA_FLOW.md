# Lex System Data Flow Architecture (SOP)

**Version:** 0.0.1
**Classification:** Internal Architecture / B.L.A.S.T Protocol Document

## 1. The 3-Layer A.N.T System

Lex System enforces strict separation of concerns through the A.N.T paradigm to ensure modularity and ease of maintenance across thousands of multi-tenant deployments.

### Layer 1: Architecture (`/architecture`)
*   **Role:** The governing laws of the system.
*   **Contents:** Markdown SOPs (like this document), schemas, business logic definitions, state machine graphs, and failure definitions.
*   **Rule:** If system logic changes, the Markdown files in this layer are updated *first*. Code follows documentation, never the reverse.

### Layer 2: Navigation (The Orchestrator)
*   **Role:** The brain. This layer handles routing, authorization checking, and dispatching data.
*   **Contents:** API Controllers, GraphQL Resolvers, Event Bus Subscribers.
*   **Rule:** This layer never computes heavy logic itself. It merely verifies "Who is asking?", "Are they allowed?", and then routes the payload to Layer 3. 

### Layer 3: Tools (`/tools` or Microservices)
*   **Role:** The muscle. Highly deterministic, isolated, and atomic functions.
*   **Contents:** Utility scripts, database ORM queries, prompt-generators, external API connectors (Meta, Pje).
*   **Rule:** A tool should accept a deterministic input schema, perform its single task, and return a standardized `LexStandardAPIEnvelope`. A tool should not know about "HTTP Requests" or "Sessions"; it only knows inputs and outputs.

## 2. Core Data Flow Lifecycle

### 2.1 The Standard API Request Request Flow
1.  **Ingress:** Client (Web App, Client Portal, Omni-Agent) dispatches a JSON payload over HTTPS.
2.  **Navigation Layer (Gateway):** 
    *   Injects the global request contextualizer (extracts JWT Token).
    *   Verifies identity against Redis.
    *   Injects `tenant_id` context into the memory scope of the request.
3.  **Navigation Layer (Router):** 
    *   Validates payload syntax against strictly defined JSON Schemas (e.g., `Zod` or `Joi`). Rejects malformed requests instantly (`400 Bad Request`).
4.  **Tool Layer (Execution):**
    *   The sanitized payload and `tenant_id` are passed to a Tool function (e.g., `CreatePetitionTemplate()`).
    *   The Tool handles DB operations passing the `tenant_id` to the ORM constraint.
5.  **Analytics Hook (Asynchronous):**
    *   Upon success, an event (e.g., `PETITION_GENERATED`) is asynchronously emitted to the Event Bus (Message Queue) defined by the Analytics Schema.
6.  **Egress:** 
    *   Standard `LexStandardAPIEnvelope` is returned.

### 2.2 External Automation Flow (Workers)
1.  **Trigger:** An external webhook (e.g., Meta WhatsApp API receives a client text) hits the designated Webhook Receiver module.
2.  **Validation:** Request signature verified to ensure origin authenticity.
3.  **Queueing:** Synchronous endpoint responds `200 OK` instantly, while pushing the payload to an Event Queue (e.g., RabbitMQ, SQS, or Redis Streams).
4.  **Background Worker (Tool Layer):**
    *   Worker pulls the task, parses NLP intent via an LLM.
    *   Worker queries the `case_tracker` internal read-only summary API.
    *   Worker dispatches reply using Meta API.

## 3. Transient Data Governance (`/.tmp/`)

*   **Rule:** Heavy processing (e.g., generating 100-page PDF petitions, merging Excel financials) creates temporary artifacts.
*   **Location:** Always written to isolated storage volumes (`/.tmp/`).
*   **Lifecycle:** Temporary folders are purged aggressively. Every artifact must have an absolute TTL (Time To Live) not exceeding 24 hours. No PII should ever persist indefinitely outside the main PostgreSQL vault.
