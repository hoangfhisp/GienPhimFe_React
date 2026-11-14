# System Design & Architecture Specification

## 1. System Overview

GienPhim Frontend is an enterprise-grade Single Page Application (SPA) developed to deliver high-concurrency video streaming, collaborative real-time co-watching (WatchParty), subscription billing management, and administrative content management. The architecture enforces separation of concerns through modular component design, isolated API services, centralized token lifecycle management, and bi-directional real-time communication via WebSockets.

---

## 2. Layered Architecture

The client application is organized into five distinct architectural layers:

```mermaid
graph TD
    subgraph Presentation_Layer [Presentation Layer]
        UI_Pages["Views & Pages (Home, XemPhim, WatchParty, Admin)"]
        UI_Layouts["Layout Wrappers (AdminLayout, WatchPartyLayout)"]
        UI_Components["Reusable Atoms & Molecules (FilmVideo, PlayerPanel, Comment)"]
    end

    subgraph Controller_Routing_Layer [Routing & Access Control Layer]
        AppRouter["React Router v7 (AppRoutes)"]
        RouteGuards["Security Guards (AdminGuard, AuthCheck)"]
        TitleProv["Page Metadata & Title Provider"]
    end

    subgraph State_Domain_Layer [State & Domain Hook Layer]
        CustomHooks["Hooks (auth, useHlsSkipAds, useDebounce, useScrollTo)"]
        LocalState["Component & UI State Management"]
    end

    subgraph Network_Transport_Layer [Network & Transport Layer]
        AxiosClients["Axios Instances (apiHelper, apiPublic)"]
        Interceptors["Interceptors (Token Refresh, Auth Bearer, Retry 401)"]
        SignalRClient["SignalR Hub Client (watchPartyHub)"]
    end

    subgraph External_Integration_Layer [External & Backend Services]
        BackendAPI["RESTful Backend Services (ASP.NET Core API)"]
        SignalRHub["Realtime Hub (WatchPartyHub)"]
        ThirdParty["Third-Party Services (Google OAuth, VNPay, MoMo, HLS CDN)"]
    end

    UI_Pages --> AppRouter
    AppRouter --> RouteGuards
    RouteGuards --> CustomHooks
    CustomHooks --> AxiosClients
    CustomHooks --> SignalRClient
    AxiosClients --> Interceptors
    Interceptors --> BackendAPI
    SignalRClient --> SignalRHub
    Presentation_Layer --> ThirdParty
```

### 2.1 Layer Descriptions
1. **Presentation Layer**: Implements responsive and interactive interfaces built with React 19, styled using SCSS modules, Tailwind CSS, Ant Design 5, and Bootstrap 5.
2. **Routing and Access Control Layer**: Handles declarative client routing via React Router v7. Includes route guards (`AdminGuard`) to enforce Role-Based Access Control (RBAC) prior to component mounting.
3. **State and Domain Hook Layer**: Encapsulates business logic, video stream processing (`useHlsSkipAds`), JWT parsing (`auth.jsx`), and debounce logic for fast search.
4. **Network and Transport Layer**: Manages outbound HTTP communication through customized Axios instances (`apiPrivate`, `apiPublic`) with automatic JWT refresh token rotation, alongside persistent WebSocket connections via `@microsoft/signalr`.
5. **External and Backend Services**: Interfaces with the upstream ASP.NET Core REST API, SignalR Hub server, Google Identity Services, payment gateways (VNPay, MoMo), and external media CDNs.

---

## 3. Realtime WatchParty Sequence Flow

The WatchParty module coordinates multiple client streams in real-time. When a host modifies playback state (Play, Pause, Seek, Episode Change), the event is dispatched to the SignalR Hub and broadcasted to all room participants.

```mermaid
sequenceDiagram
    autonumber
    actor Host as Room Host
    participant HostClient as Host Frontend (PlayerPanel)
    participant Hub as SignalR Hub (watchPartyHub)
    participant MemberClient as Member Frontend (PlayerPanel)
    actor Member as Room Member

    Note over Host, Member: Initial Room Connection & Joining
    HostClient->>Hub: Invoke JoinRoom(groupId)
    MemberClient->>Hub: Invoke JoinRoom(groupId)
    Hub-->>HostClient: Room Connection Established
    Hub-->>MemberClient: Room Connection Established

    Note over Host, Member: Video Synchronization Event (e.g., Play / Seek)
    Host->>HostClient: Action (Click Play / Seek to 02:45)
    HostClient->>HostClient: Mark isSyncingRef = true
    HostClient->>Hub: Invoke SendPlayerEvent(groupId, "seek", 165)
    
    Hub->>MemberClient: Broadcast ReceivePlayerEvent("seek", 165)
    MemberClient->>MemberClient: Check isSyncingRef.current
    MemberClient->>MemberClient: videoRef.currentTime = 165
    MemberClient->>Member: View synchronized stream at 02:45

    Note over Host, Member: Bi-Directional Chat Pipeline
    Member->>MemberClient: Input message "Awesome scene!"
    MemberClient->>Hub: Invoke SendMessage(groupId, userId, "Awesome scene!")
    Hub->>HostClient: Broadcast ReceiveMessage(payload)
    Hub->>MemberClient: Broadcast ReceiveMessage(payload)
    HostClient->>Host: Display new chat bubble
    MemberClient->>Member: Display new chat bubble
```

---

## 4. Authentication and Silent Token Refresh Workflow

The client uses dual-token authentication (Access Token + Refresh Token). The sequence below details the preemptive token check and the reactive 401 retry interceptor loop.

```mermaid
sequenceDiagram
    autonumber
    participant UI as Component View
    participant Interceptor as Axios Interceptor (ApiHelper)
    participant Storage as LocalStorage
    participant AuthAPI as Auth Service (/auth/refreshToken)
    participant Server as Protected API Endpoint

    UI->>Interceptor: Dispatch Request (e.g., GET /User/Wallet)
    Interceptor->>Storage: Read token and rf_token
    
    alt Token is expired prior to dispatch
        Interceptor->>AuthAPI: POST /auth/refreshToken (payload: rf_token)
        alt Refresh successful
            AuthAPI-->>Interceptor: HTTP 200 { token: new_jwt }
            Interceptor->>Storage: Update token = new_jwt
            Interceptor->>Server: Forward original request with Bearer new_jwt
            Server-->>UI: Return data response
        else Refresh token invalid / expired
            AuthAPI-->>Interceptor: HTTP 401 / Error
            Interceptor->>Storage: Clear all tokens
            Interceptor->>UI: Redirect to /login
        end
    else Token is valid
        Interceptor->>Server: Forward original request with Bearer token
        alt Server accepts
            Server-->>UI: Return data response
        else Server returns 401 Unauthorized
            Interceptor->>AuthAPI: Trigger retry loop: POST /auth/refreshToken
            AuthAPI-->>Interceptor: HTTP 200 { token: new_jwt }
            Interceptor->>Storage: Update token = new_jwt
            Interceptor->>Server: Retry original request with Bearer new_jwt
            Server-->>UI: Return data response
        end
    end
```

---

## 5. Structural Directory Layout

```
src/
|-- assets/                 # Static graphical assets, typography, and vendor styling
|-- components/             # Reusable UI component modules
|   |-- AdminGuard/         # Role-based route guard for administrative access
|   |-- Commons/            # Atomic elements (Loader, RatingStar, Pagination)
|   |-- Footer/             # Global application footer
|   |-- FormControls/       # Form input elements and schema bindings
|   |-- Header/             # Global header with dynamic search and user status
|   |-- Layouts/            # Complex compound layout structures
|   |   |-- AdminLayout/    # Admin portal wrapper with sidebar navigation
|   |   |-- Comment/        # Nested commenting and review system
|   |   |-- FilmVideo/      # HLS player with custom ad skipping
|   |   `-- WatchPartyLayout/ # Collaborative co-watching room panels
|   |-- Login-container/    # Authentication modal and entry views
|   `-- TitleProvider/      # Document head metadata orchestrator
|-- config/                 # Environment parameters and endpoint resolution
|-- hooks/                  # Custom business and utility React hooks
|-- pages/                  # Route entry points (Home, XemPhim, Admin modules)
|-- routes/                 # Central router definitions (AppRoutes.jsx)
|-- services/               # Isolated HTTP and WebSocket communication layers
|   |-- Admin/              # Management endpoints (Movie, User, Role, Plan, Bot)
|   |-- Auth/               # Core authentication and token management services
|   |-- User/               # Public and member service facades
|   `-- Watch/              # WatchParty and group chat communication services
`-- untils/                 # Network clients, interceptors, and data formatters
```
