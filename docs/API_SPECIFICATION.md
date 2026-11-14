# RESTful API Specification & Data Transfer Objects

## 1. Overview

This document provides a technical index of RESTful endpoints consumed by the GienPhim frontend application. Endpoints are organized by operational domain, detailing HTTP methods, authentication requirements, query parameters, request bodies, and expected response payloads.

---

## 2. Authentication & Authorization Endpoints

| HTTP Method | Route Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/User/RegisterUser` | Public | Registers a new user account using username, email, and password. |
| `POST` | `/Auth/LoginUserToken` | Public | Authenticates credentials and returns Access Token with Refresh Token. |
| `POST` | `/Auth/LoginGoogleToken` | Public | Authenticates Google OAuth 2.0 ID Token and provisions session tokens. |
| `POST` | `/auth/refreshToken` | Public | Rotates expired Access Token using valid Refresh Token. |
| `POST` | `/Auth/ForgotPassword` | Public | Dispatches password recovery verification token to user email. |
| `POST` | `/Auth/ResetPassword` | Public | Sets new account password utilizing verified recovery token. |
| `POST` | `/User/change-password` | Authenticated | Updates account password (requires current password validation). |

### 2.1 Login Response DTO Schema
```json
{
  "status": true,
  "msg": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "expiresAt": "2026-11-14T20:00:00Z"
  }
}
```

---

## 3. Film Catalog & Streaming Endpoints

| HTTP Method | Route Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/Phim/ListPhim` | Public | Paginated list of catalog movies (`params: { page, limit }`). |
| `GET` | `/Phim/DetailPhim/{id}` | Public | Detailed film metadata including genres, cast, and directors. |
| `GET` | `/Phim/ListTopPhim` | Public | Top ranked movies by view count. |
| `GET` | `/Phim/NewPhim` | Public | Latest movie releases ordered by publication date. |
| `GET` | `/TapPhim/GetByPhimId/{phimId}` | Public | Episode playlist containing streaming URLs (`linkChinh`, `linkPhu`). |
| `POST` | `/Phim/AddLuotXem` | Public | Increments total view count for specified movie. |
| `POST` | `/Phim/XuLyLikeDislike` | Authenticated | Records Like / Dislike interaction for active user. |
| `GET` | `/Phim/CheckLikeDislike` | Authenticated | Queries user interaction status on specific title. |

### 3.1 Episode (TapPhim) DTO Schema
```json
{
  "tapId": 1024,
  "phimId": 45,
  "tenTap": "Tap 01",
  "soTap": 1,
  "slugTap": "tap-01",
  "linkChinh": "https://cdn.gienphim.com/streams/tap01/index.m3u8",
  "linkPhu": "https://player.provider.com/embed?url=https://cdn.fallback.com/stream.m3u8",
  "thoiLuong": "45m",
  "ngayTao": "2026-10-01T08:00:00Z"
}
```

---

## 4. Search & Discovery Endpoints

| HTTP Method | Route Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/Phim/SearchPhim` | Public | Full-text title keyword search (`params: { keyword, page, limit }`). |
| `GET` | `/TheLoai/GetAll` | Public | Retrieves all active film genres. |
| `GET` | `/QuocGia/GetAll` | Public | Retrieves all registered production countries. |
| `GET` | `/Search/FilterPhims` | Public | Multi-attribute search filter (genre, country, language, release year). |

---

## 5. WatchParty & Collaborative Room Endpoints

| HTTP Method | Route Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/ChatGroup/Create` | Authenticated | Initializes a new WatchParty room bound to a movie ID. |
| `GET` | `/ChatGroup/Detail/{groupId}` | Authenticated | Queries room operational state and scheduled end time. |
| `GET` | `/ChatGroup/ByFilm/{phimId}` | Authenticated | Lists publicly discoverable active rooms for a given movie. |
| `GET` | `/GroupMember/ByGroup/{groupId}` | Authenticated | Retrieves active room participants with roles (Host / Member). |
| `POST` | `/JoinRequest/Create` | Authenticated | Submits a join request to private WatchParty room. |
| `GET` | `/JoinRequest/ByGroup/{groupId}` | Authenticated | Fetches pending room join requests for host approval. |
| `POST` | `/JoinRequest/Accept/{requestId}` | Authenticated (Host) | Approves member entry request into room. |
| `POST` | `/JoinRequest/Reject/{requestId}` | Authenticated (Host) | Rejects member entry request. |
| `GET` | `/ChatMessage/ByGroup/` | Authenticated | Paginated history of room chat messages. |

---

## 6. Commercialization, Subscriptions & Wallet Endpoints

| HTTP Method | Route Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/MembershipPlan/GetAll` | Public | Lists available membership packages. |
| `GET` | `/PlanOption/ByPlanAndDay` | Public | Fetches duration and price variations for membership tier. |
| `POST` | `/Subscription/Purchase` | Authenticated | Deducts wallet balance and activates membership duration. |
| `GET` | `/User/Wallet/{userId}` | Authenticated | Retrieves current digital balance and bonus credits. |
| `POST` | `/Payment/CreatePaymentVnPay`| Authenticated | Generates signed redirect URL for VNPay checkout. |
| `POST` | `/Payment/CreatePaymentMomo` | Authenticated | Initiates MoMo payment order and QR code payload. |
| `GET` | `/Transaction/History/{userId}`| Authenticated | Paginated financial transaction history. |

---

## 7. Administrative Management & Automation Endpoints

| HTTP Method | Route Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/Admin/Metrics/Overview` | Administrator | System-wide statistics for views, users, and gross revenue. |
| `POST` | `/Admin/Movie/Create` | Administrator | Registers new movie record (`multipart/form-data`). |
| `PUT` | `/Admin/Movie/Update` | Administrator | Modifies existing movie record and asset associations. |
| `DELETE`| `/Admin/Movie/Delete/{id}` | Administrator | Performs soft or hard deletion of movie entity. |
| `POST` | `/Admin/Movie/ImportFromAPI` | Administrator | Triggers single movie ingest via third-party provider slug. |
| `GET` | `/Admin/User/List` | Administrator | Lists platform users with account state and active roles. |
| `POST` | `/Admin/User/Lock` | Administrator | Locks user account (`UserLockDto`). |
| `POST` | `/Admin/User/Unlock/{userId}` | Administrator | Restores locked user account privileges. |
| `GET` | `/Admin/BotConfig` | Administrator | Queries automated crawler cadence and quota configuration. |
| `POST` | `/Admin/BotConfig/Update` | Administrator | Saves crawler configuration changes. |
| `GET` | `/Admin/BotSyncLogs` | Administrator | Paginated execution logs of automated movie ingestion tasks. |
