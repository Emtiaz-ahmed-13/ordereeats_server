# 🍔 OrderEats Server – Food Delivery Ecosystem

**OrderEats Server** is a robust, scalable backend architecture designed for a modern food delivery platform. It seamlessly connects customers, food providers, and administrators with a focus on real-time performance and data integrity.

---

## 📖 Project Overview

The system manages the entire lifecycle of food delivery—from user authentication and menu management to secure payments and real-time order tracking. This platform creates a digital bridge between local food providers and hungry customers, ensuring a seamless experience for all stakeholders.

### 🎯 Project Objectives

| Objective                  | Description                                                                     |
| :------------------------- | :------------------------------------------------------------------------------ |
| **Digital Bridge**         | Connecting local food providers with hungry customers efficiently               |
| **Streamlined Ordering**   | A frictionless cart and checkout experience                                     |
| **Provider Empowerment**   | Tools for restaurants to manage meals, prices, and order statuses               |
| **Administrative Control** | Comprehensive dashboard for managing users, promo codes, and platform analytics |

---

## 🛠️ Technology Stack

| Layer              | Technology                            | Purpose                                         |
| :----------------- | :------------------------------------ | :---------------------------------------------- |
| **Runtime**        | Node.js                               | High-performance JavaScript runtime             |
| **Framework**      | Express.js (Modular Pattern)          | Lightweight, flexible web framework             |
| **Language**       | TypeScript                            | Type-safe development with enhanced IDE support |
| **Database**       | PostgreSQL                            | Robust relational database with ACID compliance |
| **ORM**            | Prisma                                | Type-safe database client with auto-completion  |
| **Authentication** | JWT (Access & Refresh Token Strategy) | Secure stateless authentication                 |
| **Email Service**  | Nodemailer                            | Transactional email delivery                    |

---

## 🏗️ System Architecture

The server follows a **Modular MVC Architecture** to ensure maintainability and high scalability:

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│          (Mobile App, Web App, Admin Panel)             │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│                  API Gateway (Express)                  │
│              Middleware Layer (Auth, CORS)              │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│                   Business Logic Layer                  │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│    │  Auth    │  │  Orders  │  │  Meals   │           │
│    │ Module   │  │  Module  │  │  Module  │  ...      │
│    └──────────┘  └──────────┘  └──────────┘           │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              Data Access Layer (Prisma ORM)             │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│                PostgreSQL Database                      │
│         (Users, Orders, Meals, Carts, etc.)             │
└─────────────────────────────────────────────────────────┘
```

### Architecture Components:

- **Modules**: Each feature (Auth, Order, Meal) is isolated with its own routes, controllers, and services
- **Prisma Layer**: Ensures type-safe database queries and automated migrations
- **Middlewares**: Handles global error management, authentication guards, and request validation

---

## 🚀 Core Features & Requirements

### 🔐 Functional Requirements

| Feature                              | Description                                                          | Implementation                                             |
| :----------------------------------- | :------------------------------------------------------------------- | :--------------------------------------------------------- |
| **Role-Based Access Control (RBAC)** | Dedicated permissions for Customer, Provider, and Admin              | JWT-based middleware with role verification                |
| **Meal Management**                  | Full CRUD operations for providers to manage their digital menu      | RESTful API with image upload support                      |
| **Advanced Cart System**             | Persistent shopping cart with real-time total calculations           | User-specific cart with item quantity management           |
| **Secure Checkout**                  | Integrated order placement with delivery tracking                    | Transaction-safe order creation with status updates        |
| **Promo System**                     | Dynamic discount management with validity checks and usage limits    | Time-based validation with usage tracking                  |
| **Email Notifications**              | Automated emails for verification, password reset, and order updates | Nodemailer integration with HTML templates                 |
| **Authentication Flow**              | Complete auth system with email verification                         | Access/Refresh token strategy with secure password hashing |

---

## 📋 Role Capabilities

### 👤 Customer Role

- ✅ Browse meals by category and provider
- ✅ Manage shopping cart (add, update, remove items)
- ✅ Apply promo codes for discounts
- ✅ Place orders with delivery address
- ✅ Track order status in real-time
- ✅ Write reviews and ratings for meals
- ✅ View order history

### 🏪 Provider Role

- ✅ Create and manage provider profile
- ✅ Manage meal listings (CRUD operations)
- ✅ Upload meal images
- ✅ Update meal availability and pricing
- ✅ View incoming orders
- ✅ Change order status (Pending → Confirmed → Delivered)
- ✅ View sales analytics

### 🛡️ Admin Role

- ✅ Full system oversight
- ✅ User role management
- ✅ Create and manage categories
- ✅ Create and manage promo codes
- ✅ Monitor all orders across the platform
- ✅ View platform analytics
- ✅ Manage provider approvals
- ✅ Customer support capabilities

---

## 🗄️ Database Schema

### Core Entities

```mermaid
erDiagram
    User ||--o{ Order : places
    User ||--o{ Review : writes
    User ||--o| Cart : has
    User ||--o| Provider : creates
    Provider ||--o{ Meal : offers
    Meal }|--|| Category : belongs_to
    Meal ||--o{ OrderItem : contains
    Meal ||--o{ CartItem : added_to
    Meal ||--o{ Review : receives
    Order ||--|{ OrderItem : contains
    Cart ||--|{ CartItem : contains
    PromoCode }o--o{ Order : applied_to

    User {
        string id PK
        string name
        string email UK
        string password
        enum role
        boolean isEmailVerified
        datetime createdAt
    }

    Provider {
        string id PK
        string name
        string description
        string location
        string phone
        string image
        string userId FK
    }

    Category {
        string id PK
        string name UK
        string description
    }

    Meal {
        string id PK
        string name
        string description
        decimal price
        string image
        boolean available
        string categoryId FK
        string providerId FK
    }

    Cart {
        string id PK
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    CartItem {
        string id PK
        int quantity
        string cartId FK
        string mealId FK
    }

    Order {
        string id PK
        decimal totalAmount
        enum status
        string deliveryAddress
        string userId FK
        string promoCodeId FK
        datetime createdAt
    }

    OrderItem {
        string id PK
        int quantity
        decimal price
        string orderId FK
        string mealId FK
    }

    Review {
        string id PK
        int rating
        string comment
        string userId FK
        string mealId FK
        datetime createdAt
    }

    PromoCode {
        string id PK
        string code UK
        enum discountType
        decimal discountValue
        decimal minOrderAmount
        int maxUses
        int currentUses
        datetime expiresAt
        boolean isActive
    }
```

---

## 🔒 Security Features

### Authentication & Authorization

- **JWT Strategy**: Dual token system (Access + Refresh)
- **Password Security**: Bcrypt hashing with configurable salt rounds
- **Email Verification**: Required before full account access
- **Password Reset**: Secure token-based reset flow
- **Role-Based Middleware**: Route protection based on user roles

### Data Protection

- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data isolated in `.env`
- **Input Validation**: Request body validation middleware
- **Error Handling**: Sanitized error messages (no stack traces in production)

---

## 📊 API Response Standards

### Success Response Format

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response payload
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Operation failed",
  "errorMessages": [
    {
      "path": "field_name",
      "message": "Detailed error description"
    }
  ],
  "stack": "Error stack trace (development only)"
}
```

### HTTP Status Codes

| Code    | Meaning               | Usage                                   |
| :------ | :-------------------- | :-------------------------------------- |
| **200** | OK                    | Successful GET, PATCH, DELETE           |
| **201** | Created               | Successful POST (resource created)      |
| **400** | Bad Request           | Invalid input data                      |
| **401** | Unauthorized          | Missing or invalid authentication       |
| **403** | Forbidden             | Valid auth but insufficient permissions |
| **404** | Not Found             | Resource doesn't exist                  |
| **409** | Conflict              | Duplicate resource (e.g., email exists) |
| **500** | Internal Server Error | Unexpected server error                 |

---

## 🔄 Business Workflows

### Customer Order Flow

```mermaid
sequenceDiagram
    participant C as Customer
    participant API as API Server
    participant DB as Database
    participant P as Provider

    C->>API: Browse Meals
    API->>DB: Query Meals
    DB-->>API: Return Meals
    API-->>C: Display Meals

    C->>API: Add to Cart
    API->>DB: Update Cart
    DB-->>API: Cart Updated
    API-->>C: Cart Confirmation

    C->>API: Apply Promo Code
    API->>DB: Validate Code
    DB-->>API: Discount Calculated
    API-->>C: Updated Total

    C->>API: Place Order
    API->>DB: Create Order
    API->>DB: Clear Cart
    API->>P: Notify Provider
    DB-->>API: Order Created
    API-->>C: Order Confirmation

    P->>API: Update Status
    API->>DB: Update Order
    API->>C: Status Notification
```

### Provider Meal Management Flow

```mermaid
graph TD
    A[Provider Login] --> B{Create Meal}
    B --> C[Upload Image]
    C --> D[Set Price & Details]
    D --> E[Select Category]
    E --> F[Save to Database]
    F --> G{Meal Available?}
    G -->|Yes| H[Visible to Customers]
    G -->|No| I[Hidden from Catalog]
    H --> J[Receive Orders]
    J --> K[Update Order Status]
    K --> L[Complete Order]
```

---

## 🚦 Development Guidelines

### Code Structure Principles

1. **Modular Design**: Each feature is a self-contained module
2. **Separation of Concerns**: Routes → Controllers → Services → Database
3. **DRY Principle**: Shared utilities in `/shared` and `/helpers`
4. **Type Safety**: Leverage TypeScript for compile-time checks
5. **Error Handling**: Centralized error middleware with custom error classes

### Naming Conventions

```typescript
// Files: kebab-case
auth.routes.ts;
user.controller.ts;

// Classes/Interfaces: PascalCase
class ApiError extends Error {}
interface IUserService {}

// Functions/Variables: camelCase
const getUserById = () => {};
let isAuthenticated = false;

// Constants: UPPER_SNAKE_CASE
const JWT_SECRET = process.env.JWT_SECRET;
```

---

## 🧪 Testing Strategy

### Unit Testing (Planned)

- Service layer functions
- Utility helpers
- Validation logic

### Integration Testing (Planned)

- API endpoints
- Database operations
- Authentication flow

### Testing Tools

- **Jest**: Testing framework
- **Supertest**: HTTP assertions
- **Prisma Test Environment**: Database mocking

---

## 🌐 Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────┐
│         Load Balancer (Nginx)           │
└────────────┬────────────────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌─────────┐      ┌─────────┐
│ Server  │      │ Server  │
│ Instance│      │ Instance│
│   #1    │      │   #2    │
└────┬────┘      └────┬────┘
     │                │
     └────────┬───────┘
              ▼
      ┌──────────────┐
      │  PostgreSQL  │
      │   Database   │
      └──────────────┘
```

### Deployment Platforms

- **Vercel**: Serverless deployment with auto-scaling
- **Railway**: Container-based deployment
- **Heroku**: Platform-as-a-Service (PaaS)
- **DigitalOcean**: VPS deployment
- **AWS EC2**: Full infrastructure control

---

## 📈 Performance Optimizations

### Database Optimizations

- **Indexed Fields**: Email, user IDs, order dates
- **Query Optimization**: Prisma includes for related data
- **Connection Pooling**: Managed by Prisma

### API Optimizations

- **Pagination**: Limit results for large datasets
- **Caching Strategy**: Redis for frequently accessed data (future)
- **Compression**: Gzip middleware for responses
- **Rate Limiting**: Prevent API abuse (future)

---

## 🔮 Future Enhancements

### Planned Features

- [ ] Real-time order tracking with WebSockets
- [ ] In-app chat between customers and providers
- [ ] Advanced search with filters and sorting
- [ ] Loyalty points and rewards system
- [ ] Multi-language support (i18n)
- [ ] Analytics dashboard for providers
- [ ] Push notifications (FCM integration)
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Delivery driver management module
- [ ] Advanced reporting and insights

---

## 🎓 Module Deep Dive

### Authentication Module (`src/app/modules/Auth`)

**Purpose**: Handles user registration, login, email verification, and password management

**Key Files**:

- `auth.routes.ts` - Route definitions
- `auth.controllers.ts` - Request handlers
- `auth.services.ts` - Business logic
- `auth.validation.ts` - Request validation schemas

**Key Endpoints**:

```
POST   /auth/register           - Register new user
POST   /auth/login              - User login
POST   /auth/refresh-token      - Refresh access token
POST   /auth/verify-email       - Verify email
POST   /auth/resend-verification - Resend verification email
POST   /auth/forget-password    - Send password reset link
POST   /auth/reset-password     - Reset password with token
POST   /auth/logout             - Logout user
```

**Database Relations**:

- Creates `User` record
- Generates JWT tokens
- Stores refresh tokens

---

### Users Module (`src/app/modules/Users`)

**Purpose**: Manage user profiles, preferences, and account settings

**Key Endpoints**:

```
GET    /users/me               - Get current user profile
PATCH  /users/:id              - Update user profile
GET    /users/:id              - Get user by ID
DELETE /users/:id              - Deactivate user account
POST   /users/:id/change-password - Change password
```

**Validation Rules**:

- Email must be unique
- Password minimum 6 characters
- Phone number format validation
- Name length 2-100 characters

---

### Providers Module (`src/app/modules/Providers`)

**Purpose**: Manage provider profiles and onboarding

**Key Endpoints**:

```
POST   /providers               - Create provider profile
GET    /providers               - List all providers
GET    /providers/:id           - Get provider details
PATCH  /providers/:id           - Update provider info
GET    /providers/:id/dashboard - Provider dashboard stats
GET    /providers/:id/earnings  - View provider earnings
```

**Provider Statuses**:

- `PENDING` - Awaiting admin approval
- `APPROVED` - Active and accepting orders
- `REJECTED` - Rejected by admin
- `SUSPENDED` - Temporarily disabled

**Required Documents**:

- Business registration certificate
- Tax ID
- Bank account details
- Identity proof

---

### Meals Module (`src/app/modules/Meals`)

**Purpose**: Complete meal management system for providers

**Key Endpoints**:

```
POST   /meals                  - Create meal
GET    /meals                  - List meals (with filters)
GET    /meals/:id              - Get meal details
PATCH  /meals/:id              - Update meal info
DELETE /meals/:id              - Delete meal
POST   /meals/:id/image        - Upload meal image
GET    /meals/category/:catId  - Meals by category
GET    /meals/provider/:providerId - Provider's meals
```

**Meal Attributes**:

- Name, description, price
- Category, availability status
- Preparation time, cuisine type
- Nutritional info, allergens
- Image URL, rating, review count

**Filtering & Sorting**:

```
GET /meals?category=fast-food&minPrice=100&maxPrice=500&sort=rating
GET /meals?search=burger&provider=123&available=true
```

---

### Cart Module (`src/app/modules/Cart`)

**Purpose**: Shopping cart management with real-time calculations

**Key Endpoints**:

```
GET    /cart                   - Get current user's cart
POST   /cart/items             - Add item to cart
PATCH  /cart/items/:id         - Update item quantity
DELETE /cart/items/:id         - Remove item from cart
DELETE /cart                   - Clear entire cart
GET    /cart/total             - Get cart total with taxes
```

**Cart Logic**:

- Persistent storage (survives logout)
- Real-time total calculation
- Automatic tax calculation (15% default)
- Promo code integration
- Item availability validation

**Cart Response Example**:

```json
{
  "id": "cart-123",
  "items": [
    {
      "id": "item-1",
      "mealId": "meal-123",
      "quantity": 2,
      "price": 300,
      "subtotal": 600,
      "meal": { "name": "Biryani", "image": "url" }
    }
  ],
  "subtotal": 1500,
  "tax": 225,
  "discount": 150,
  "total": 1575,
  "promoCode": "SAVE20"
}
```

---

### Orders Module (`src/app/modules/Orders`)

**Purpose**: Complete order lifecycle management

**Key Endpoints**:

```
POST   /orders                 - Place new order
GET    /orders                 - Get user's orders
GET    /orders/:id             - Get order details
PATCH  /orders/:id/status      - Update order status
GET    /orders/:id/tracking    - Real-time order tracking
POST   /orders/:id/cancel      - Cancel order (with refund)
```

**Order Statuses**:

- `PENDING` - Awaiting provider confirmation
- `PREPARING` - Provider preparing food
- `READY` - Ready for pickup/delivery
- `DELIVERED` - Order completed
- `CANCELLED` - Order cancelled

**Order Creation Process**:

1. Validate cart items availability
2. Calculate final amount with taxes/discounts
3. Reserve inventory
4. Create order transaction
5. Clear user cart
6. Notify provider
7. Send confirmation email

**Response Example**:

```json
{
  "id": "order-123",
  "userId": "user-123",
  "items": [
    {
      "mealId": "meal-123",
      "quantity": 2,
      "price": 300,
      "subtotal": 600
    }
  ],
  "subtotal": 1500,
  "tax": 225,
  "deliveryFee": 50,
  "discount": 150,
  "total": 1625,
  "status": "PREPARING",
  "deliveryAddress": "123 Main St",
  "estimatedDeliveryTime": "2026-02-04T15:30:00Z",
  "createdAt": "2026-02-04T14:45:00Z",
  "provider": { "id": "provider-123", "restaurantName": "Biryani House" }
}
```

---

### Categories Module (`src/app/modules/Categories`)

**Purpose**: Manage food categories and cuisines

**Key Endpoints**:

```
POST   /categories             - Create category (Admin only)
GET    /categories             - List all categories
GET    /categories/:id         - Get category details
PATCH  /categories/:id         - Update category
DELETE /categories/:id         - Delete category
GET    /categories/:id/meals   - Get meals in category
```

**Category Attributes**:

- Name, description
- Icon/image URL
- Order (display sequence)
- Is featured, is active

---

### Reviews Module (`src/app/modules/Reviews`)

**Purpose**: Customer feedback and ratings system

**Key Endpoints**:

```
POST   /reviews                - Submit review
GET    /reviews/meal/:id       - Get reviews for meal
GET    /reviews/user/:id       - Get user's reviews
PATCH  /reviews/:id            - Edit review
DELETE /reviews/:id            - Delete review
GET    /reviews/stats/meal/:id - Review statistics
```

**Review Data**:

- Rating (1-5 stars)
- Comment/feedback text
- Images (optional)
- Helpful count
- Review date

**Review Statistics**:

- Average rating
- Total reviews
- Rating distribution
- Helpful/unhelpful count

---

### Promo Codes Module (`src/app/modules/PromoCodes`)

**Purpose**: Promotional discount management

**Key Endpoints**:

```
POST   /promo-codes            - Create promo code (Admin)
GET    /promo-codes            - List active promos
POST   /promo-codes/:code/validate - Validate promo code
GET    /promo-codes/:id        - Get promo details
PATCH  /promo-codes/:id        - Update promo (Admin)
DELETE /promo-codes/:id        - Delete promo (Admin)
```

**Promo Types**:

- `FIXED_AMOUNT` - e.g., ৳100 off
- `PERCENTAGE` - e.g., 20% off
- `FREE_DELIVERY` - Free delivery fee

**Promo Attributes**:

- Code, discount value/percentage
- Minimum order amount
- Maximum usage count
- Per-user usage limit
- Expiry date
- Applicable categories/providers

**Validation Logic**:

```typescript
- Check if code exists and is active
- Verify expiry date hasn't passed
- Check usage limit not exceeded
- Validate minimum order amount
- Check user hasn't used this code before
- Verify applicable to items in cart
```

---

### Loyalty Module (`src/app/modules/Loyalty`)

**Purpose**: Customer loyalty and rewards points system

**Key Endpoints**:

```
GET    /loyalty/balance        - Get user's loyalty points
POST   /loyalty/redeem         - Redeem points as discount
GET    /loyalty/history        - Points transaction history
GET    /loyalty/tiers          - Available loyalty tiers
```

**Points System**:

- 1 point = ৳1 spent
- Can redeem 100 points = ৳90 discount
- Bonus points on referrals
- Tier-based benefits

---

### Payment Module (`src/app/modules/Payment`)

**Purpose**: Payment processing and transaction management

**Key Endpoints**:

```
POST   /payments/intent        - Create payment intent
GET    /payments/:id           - Get payment details
PATCH  /payments/:id/status    - Update payment status
POST   /payments/:id/refund    - Process refund
GET    /payments/order/:id     - Get order payments
```

**Payment Methods**:

- Credit/Debit Card
- Mobile banking (bKash, Nagad)
- Cash on delivery
- Digital wallet

**Payment Statuses**:

- `PENDING` - Awaiting processing
- `SUCCESS` - Payment successful
- `FAILED` - Payment failed
- `REFUNDED` - Money refunded to customer

---

### Admin Module (`src/app/modules/Admin`)

**Purpose**: Comprehensive platform management and analytics

**Key Endpoints**:

```
# Provider Management
GET    /admin/providers/pending              - Pending approvals
GET    /admin/providers                      - All providers
PATCH  /admin/providers/:id/status           - Approve/reject provider

# User Management
GET    /admin/users                          - List all users
PATCH  /admin/users/:id/role                 - Change user role
PATCH  /admin/users/:id/deactivate           - Deactivate user

# Dashboard
GET    /admin/dashboard/stats                - Dashboard statistics
GET    /admin/dashboard/activity             - Recent activity
GET    /admin/dashboard/analytics            - Detailed analytics

# Reports
GET    /admin/reports/generate?type=REVENUE  - Generate reports
GET    /admin/reports/revenue                - Revenue report
GET    /admin/reports/orders                 - Orders report
GET    /admin/reports/users                  - Users report
GET    /admin/reports/providers              - Providers report
```

**Dashboard Stats Included**:

- Total users, providers, orders
- Active providers, pending approvals
- Daily/monthly revenue
- Order status breakdown
- System health metrics
- Recent activity feed

**Admin Report Data**:

```json
{
  "summary": {
    "totalRevenue": "৳50,000",
    "totalOrders": 250,
    "averageOrderValue": "৳200",
    "platformCommission": "৳7,500",
    "period": "2026-02-01 - 2026-02-04"
  },
  "detailedData": [
    {
      "provider": "Biryani House",
      "revenue": "৳15,000",
      "orders": 75,
      "commission": "৳2,250"
    }
  ],
  "htmlContent": "..."
}
```

---

## 🛡️ Advanced Security Implementation

### JWT Token Structure

**Access Token** (15 minutes validity):

```json
{
  "sub": "user-123",
  "role": "CUSTOMER",
  "email": "user@example.com",
  "iat": 1704067200,
  "exp": 1704068100
}
```

**Refresh Token** (7 days validity):

- Stored in HTTP-only cookies
- Rotated on each refresh
- Invalidated on logout

### Password Security

```typescript
// Bcrypt hashing configuration
const saltRounds = 10; // Configurable
// Time: ~100ms per hash (production-grade)
```

### CORS Configuration

```typescript
allowedOrigins: [
  "http://localhost:3000", // Development
  "https://ordereeats.vercel.app", // Production
];
```

### Rate Limiting (Planned)

```typescript
- Login attempts: 5 per 15 minutes
- API calls: 100 per minute per IP
- File uploads: 10MB max size
```

---

## 📡 Error Codes Reference

### 1000-1999: Authentication Errors

| Code | Message             | Action                      |
| :--- | :------------------ | :-------------------------- |
| 1001 | Invalid credentials | Verify email/password       |
| 1002 | Email not verified  | Complete email verification |
| 1003 | Account suspended   | Contact admin               |
| 1004 | Token expired       | Refresh token               |

### 2000-2999: Validation Errors

| Code | Message              | Action                       |
| :--- | :------------------- | :--------------------------- |
| 2001 | Email already exists | Use different email          |
| 2002 | Invalid email format | Enter valid email            |
| 2003 | Phone number invalid | Enter valid phone            |
| 2004 | Insufficient data    | Complete all required fields |

### 3000-3999: Business Logic Errors

| Code | Message                   | Action                |
| :--- | :------------------------ | :-------------------- |
| 3001 | Meal not available        | Choose different meal |
| 3002 | Promo code expired        | Use active promo code |
| 3003 | Order cannot be cancelled | Contact support       |
| 3004 | Insufficient cart items   | Add items to cart     |

### 4000-4999: Server Errors

| Code | Message               | Action               |
| :--- | :-------------------- | :------------------- |
| 4001 | Database error        | Retry later          |
| 4002 | Email service error   | Retry later          |
| 4003 | Payment gateway error | Try different method |

---

## 🔧 Configuration Files

### Environment Variables (`.env`)

```env
# Server Configuration
PORT=5001
NODE_ENV=development
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ordereeats

# JWT Secrets
JWT_SECRET=your-secret-key-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@ordereeats.com

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Admin Settings
COMMISSION_RATE=0.15
DELIVERY_FEE=50
MIN_ORDER_AMOUNT=200
```

### Database Configuration (`prisma.config.ts`)

```typescript
// Adapter: PostgreSQL with connection pooling
// Auto-migration on deploy
// Schema versioning enabled
```

---

## 📞 Support & Contact

**Developer**: Emtiaz Ahmed  
**Project Repository**: [GitHub - OrderEats Server](https://github.com/Emtiaz-ahmed-13/ordereeats_server)  
**Email**: emtiazahmed13@example.com  
**Issues & Features**: [GitHub Issues](https://github.com/Emtiaz-ahmed-13/ordereeats_server/issues)

---

## 📄 License

This project is licensed under the **MIT License**.

---

**Last Updated**: February 4, 2026  
**Version**: 1.0.0  
**Documentation Status**: Complete with detailed module descriptions
