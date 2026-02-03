# OrderEats Server 🍔

A robust and scalable backend for the OrderEats food delivery platform. This server application manages users, providers, meals, orders, carts, reviews, promo codes, loyalty points, and payment processing, providing a seamless experience for customers, food providers, and administrators.

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Language:** TypeScript
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** Stripe Integration
- **Email Service:** Nodemailer
- **Validation:** Zod Schema Validation
- **Security:** Bcrypt, Rate Limiting

## 🛠️ Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 📦 Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Emtiaz-ahmed-13/ordereeats_server.git
    cd ordereeats_server
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and configure the following variables:

    ```env
    PORT=5000
    NODE_ENV=development
    DATABASE_URL="postgresql://user:password@localhost:5432/ordereeats_db?schema=public"
    JWT_SECRET="your_jwt_secret_key_here"
    JWT_EXPIRES_IN="30d"
    JWT_REFRESH_SECRET="your_refresh_secret_key_here"
    JWT_REFRESH_EXPIRES_IN="365d"
    BCRYPT_SALT_ROUNDS=10
    EMAIL_USER="your_email@gmail.com"
    EMAIL_PASSWORD="your_app_password"
    FRONTEND_URL="http://localhost:3000"
    STRIPE_SECRET_KEY="your_stripe_secret_key"
    POINTS_REDEMPTION_RATE=10
    ```

4.  **Database Setup:**
    Run the Prisma migrations to set up your database schema:

    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

5.  **Run the Server:**
    - **Development Mode:**
      ```bash
      npm run dev
      ```
    - **Build for Production:**
      ```bash
      npm run build
      npm start
      ```

## 📡 API Endpoints Reference

**Base URL:** `http://localhost:5000/api/v1`

### 🔐 Authentication Endpoints

| Method | Endpoint                    | Description               |  Access   | Validation                  |
| :----- | :-------------------------- | :------------------------ | :-------: | :-------------------------- |
| POST   | `/auth/register`            | Register a new user       | 🟢 Public | name, email, password, role |
| POST   | `/auth/login`               | Login user & get tokens   | 🟢 Public | email, password             |
| POST   | `/auth/refresh`             | Refresh access token      | 🟢 Public | refreshToken                |
| POST   | `/auth/verify-email`        | Verify email with token   | 🟢 Public | token                       |
| POST   | `/auth/resend-verification` | Resend verification email | 🟢 Public | email                       |
| POST   | `/auth/forgot-password`     | Request password reset    | 🟢 Public | email                       |
| POST   | `/auth/reset-password`      | Reset password with token | 🟢 Public | token, newPassword          |

### 👤 Users

| Method | Endpoint          | Description      |  Access  | Validation |
| :----- | :---------------- | :--------------- | :------: | :--------- |
| GET    | `/users`          | Get all users    | 🔴 Admin | -          |
| PATCH  | `/users/:id/role` | Update user role | 🔴 Admin | role       |

### 🏪 Providers

| Method | Endpoint         | Description             |      Access       | Validation            |
| :----- | :--------------- | :---------------------- | :---------------: | :-------------------- |
| POST   | `/providers`     | Create provider profile | 🟠 Provider/Admin | name, location, phone |
| GET    | `/providers`     | Get all providers       |     🟢 Public     | -                     |
| GET    | `/providers/:id` | Get provider details    |     🟢 Public     | -                     |
| PATCH  | `/providers/:id` | Update provider info    | 🟠 Provider/Admin | (name, location, etc) |
| DELETE | `/providers/:id` | Delete provider profile |     🔴 Admin      | -                     |

### 📂 Categories

| Method | Endpoint          | Description         |  Access   | Validation  |
| :----- | :---------------- | :------------------ | :-------: | :---------- |
| POST   | `/categories`     | Create new category | 🔴 Admin  | name, image |
| GET    | `/categories`     | Get all categories  | 🟢 Public | -           |
| PATCH  | `/categories/:id` | Update category     | 🔴 Admin  | name, image |
| DELETE | `/categories/:id` | Delete category     | 🔴 Admin  | -           |

### 🍱 Meals (Complete Module)

| Method | Endpoint     | Description                |      Access       | Validation                |
| :----- | :----------- | :------------------------- | :---------------: | :------------------------ |
| POST   | `/meals`     | Add a new meal             | 🟠 Provider/Admin | name, price, categoryId ✓ |
| GET    | `/meals`     | Get all meals (filterable) |     🟢 Public     | -                         |
| GET    | `/meals/:id` | Get meal details           |     🟢 Public     | mealId (UUID)             |
| PATCH  | `/meals/:id` | Update meal details        | 🟠 Provider/Admin | (name, price, etc) ✓      |
| DELETE | `/meals/:id` | Delete a meal              | 🟠 Provider/Admin | mealId (UUID)             |

**Query Parameters for GET /meals:**

- `category` - Filter by category ID
- `provider` - Filter by provider ID
- `search` - Search in name/description
- `minPrice`, `maxPrice` - Price range
- `page`, `limit` - Pagination

### 🛒 Cart

| Method | Endpoint              | Description               |   Access    | Validation       |
| :----- | :-------------------- | :------------------------ | :---------: | :--------------- |
| GET    | `/cart`               | Get current user's cart   | 🟠 Customer | -                |
| GET    | `/cart/total`         | Get cart total            | 🟠 Customer | -                |
| POST   | `/cart/items`         | Add item to cart          | 🟠 Customer | mealId, quantity |
| PATCH  | `/cart/items/:itemId` | Update cart item quantity | 🟠 Customer | quantity         |
| DELETE | `/cart/items/:itemId` | Remove item from cart     | 🟠 Customer | itemId           |
| DELETE | `/cart`               | Clear entire cart         | 🟠 Customer | -                |

### 🛍️ Orders (Complete Module)

| Method | Endpoint             | Description         |           Access           | Validation                                             |
| :----- | :------------------- | :------------------ | :------------------------: | :----------------------------------------------------- |
| POST   | `/orders`            | Place a new order   |        🟠 Customer         | items[], deliveryAddress ✓                             |
| GET    | `/orders`            | Get all user orders | 🟠 Customer/Provider/Admin | -                                                      |
| GET    | `/orders/:id`        | Get specific order  | 🟠 Customer/Provider/Admin | orderId (UUID)                                         |
| PATCH  | `/orders/:id/status` | Update order status |     🟠 Provider/Admin      | status (PENDING/PREPARING/READY/DELIVERED/CANCELLED) ✓ |

**Order Status Flow:**

- `PENDING` → `PREPARING` → `READY` → `DELIVERED`
- Any status → `CANCELLED`

### ⭐ Reviews

| Method | Endpoint           | Description      |   Access    | Validation                    |
| :----- | :----------------- | :--------------- | :---------: | :---------------------------- |
| POST   | `/reviews`         | Create a review  | 🟠 Customer | mealId, rating (1-5), comment |
| GET    | `/reviews/:mealId` | Get meal reviews |  🟢 Public  | -                             |
| PATCH  | `/reviews/:id`     | Update review    | 🟠 Customer | rating, comment               |
| DELETE | `/reviews/:id`     | Delete review    | 🟠 Customer | -                             |

### 🎟️ Promo Codes

| Method | Endpoint                      | Description            |   Access    | Validation                          |
| :----- | :---------------------------- | :--------------------- | :---------: | :---------------------------------- |
| GET    | `/promo-codes/active`         | Get active promo codes |  🟢 Public  | -                                   |
| POST   | `/promo-codes/:code/validate` | Validate promo code    | 🟠 Customer | orderTotal                          |
| POST   | `/promo-codes`                | Create promo code      |  🔴 Admin   | code, discountValue, minOrderAmount |
| GET    | `/promo-codes`                | Get all promo codes    |  🔴 Admin   | -                                   |
| PATCH  | `/promo-codes/:id`            | Update promo code      |  🔴 Admin   | (code, discountValue, etc)          |
| DELETE | `/promo-codes/:id`            | Delete promo code      |  🔴 Admin   | -                                   |

### 💎 Loyalty Points (Complete Module)

| Method | Endpoint          | Description                |   Access    | Validation             |
| :----- | :---------------- | :------------------------- | :---------: | :--------------------- |
| GET    | `/loyalty`        | Get user loyalty info      | 🟠 Customer | -                      |
| POST   | `/loyalty/redeem` | Redeem points for discount | 🟠 Customer | points (integer > 0) ✓ |

**Loyalty Features:**

- Automatic point earning on orders (1 point per BDT spent)
- Loyalty tiers: SILVER (0-1000), GOLD (1001-5000), PLATINUM (5000+)
- Point redemption: 10 points = 1 BDT discount
- Points history tracking

### 💳 Payment (Complete Module)

| Method | Endpoint                 | Description                  |   Access    | Validation                   |
| :----- | :----------------------- | :--------------------------- | :---------: | :--------------------------- |
| POST   | `/payment/create-intent` | Create Stripe payment intent | 🟠 Customer | amount (integer), currency ✓ |
| POST   | `/payment/verify`        | Verify payment               | 🟠 Customer | paymentIntentId, orderId     |

**Payment Features:**

- Stripe integration for secure payments
- Payment intent creation
- Payment verification and order confirmation
- Support for multiple currencies

---

## 🔐 Authentication & Authorization

The API uses **JWT (JSON Web Tokens)** for authentication. Protected routes require a valid access token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### User Roles:

- **CUSTOMER** 🟠 - Can place orders, manage cart, write reviews, earn loyalty points
- **PROVIDER** 🟠 - Can manage their meals, view orders, update order status
- **ADMIN** 🔴 - Full access to all endpoints

### Token System:

- **Access Token** - Short-lived token (30 days) for API requests
- **Refresh Token** - Long-lived token (365 days) to get new access tokens
- **Automatic Refresh** - Client automatically refreshes token before expiry

---

## ✅ Request Validation

All endpoints with request bodies use **Zod Schema Validation**:

### Validation Features:

- ✅ Automatic validation before controller execution
- ✅ Consistent error response format with detailed messages
- ✅ Type-safe request/response data
- ✅ Field-level error reporting
- ✅ UUID validation for ID parameters
- ✅ Enum validation for status fields

### Error Response Example:

```json
{
  "success": false,
  "message": "Validation Error",
  "errorMessages": [
    {
      "path": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

---

## 📝 Response Format

All API responses follow a consistent format:

### Success Response:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  },
  "meta": {
    /* pagination info if applicable */
  }
}
```

### Error Response:

```json
{
  "success": false,
  "message": "Error message",
  "errorMessages": [
    {
      "path": "field_name",
      "message": "Error details"
    }
  ]
}
```

### HTTP Status Codes:

- `200 OK` - Successful GET/PATCH/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 📁 Project Structure

```bash
src/
├── app/
│   ├── modules/
│   │   ├── Auth/              # Authentication (register, login, verify)
│   │   ├── Users/             # User management
│   │   ├── Providers/         # Provider management
│   │   ├── Categories/        # Category management
│   │   ├── Meals/             # Meal management ✅ Complete
│   │   │   ├── meals.controller.ts
│   │   │   ├── meals.service.ts
│   │   │   ├── meals.routes.ts
│   │   │   └── meals.validation.ts ✅ Zod Schema
│   │   ├── Cart/              # Shopping cart
│   │   ├── Orders/            # Order management ✅ Complete
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   ├── orders.routes.ts
│   │   │   └── orders.validation.ts ✅ Zod Schema
│   │   ├── Reviews/           # Reviews & ratings
│   │   ├── Loyalty/           # Loyalty points ✅ Complete
│   │   │   ├── loyalty.controller.ts
│   │   │   ├── loyalty.service.ts
│   │   │   ├── loyalty.routes.ts
│   │   │   └── loyalty.validation.ts ✅ Zod Schema
│   │   ├── payment/           # Payment processing ✅ Complete
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── payment.routes.ts
│   │   │   └── payment.validation.ts ✅ Zod Schema
│   │   └── PromoCodes/        # Promo code system
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication
│   │   ├── validateRequest.ts # Zod validation
│   │   ├── globalErrorHandler.ts # Error handling
│   │   ├── rateLimiter.ts     # Rate limiting
│   │   └── upload.middleware.ts # File upload
│   ├── errors/
│   │   └── ApiError.ts        # Custom error class
│   ├── shared/
│   │   ├── catchAsync.ts      # Async error wrapper
│   │   ├── sendResponse.ts    # Response formatter
│   │   └── prisma.ts          # Prisma client
│   └── routes/
│       └── index.ts           # Route aggregation
├── config/
│   └── index.ts               # Configuration
├── helpers/
│   ├── jwtHelpers.ts          # JWT utility functions
│   ├── email.service.ts       # Email sending
│   └── userHelpers.ts         # User utility functions
├── types/
│   └── express.d.ts           # Express type extensions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── app.ts                     # Express app setup
├── server.ts                  # Server entry point
└── seed.ts                    # Database seeding
```

---

## 🧪 Testing the API

You can test the API using:

- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code Extension)
- [Insomnia](https://insomnia.rest/)
- [cURL](https://curl.se/)

**Example cURL request:**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

---

## 🚀 Deployment

The application is ready for deployment on:

- **Vercel** (Serverless) - See `vercel.json`
- **Railway** - Database + Backend
- **Heroku**
- **DigitalOcean App Platform**
- **AWS EC2/Lambda**

### Deployment Checklist:

- [ ] Set all environment variables
- [ ] Configure database connection
- [ ] Set up Stripe API keys
- [ ] Configure email service
- [ ] Run database migrations
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Configure CORS for frontend domain

---

## 📊 Key Features Implemented

### ✅ Core Features

- User authentication with email verification
- Multiple user roles (CUSTOMER, PROVIDER, ADMIN)
- Meal management with categories
- Shopping cart functionality
- Order placement and tracking
- Review and rating system
- Promo code validation

### ✅ Advanced Features

- **Loyalty Points System**
  - Automatic point earning on orders
  - Multiple loyalty tiers with benefits
  - Point redemption for discounts
  - Points history tracking

- **Payment Processing**
  - Stripe integration
  - Payment intent creation
  - Secure payment verification
  - Multi-currency support

- **Data Validation**
  - Zod schema validation on all endpoints
  - Automatic error reporting
  - Type-safe operations

- **Security**
  - JWT authentication
  - Password hashing with bcrypt
  - Rate limiting
  - Input validation

---

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

For issues, questions, or suggestions:

- **Backend Developer:** Emtiaz Ahmed
- **GitHub:** https://github.com/Emtiaz-ahmed-13
- **Email:** emtiazahmed13@gmail.com

---

**Last Updated:** February 4, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

**Developed with ❤️ by Emtiaz Ahmed**
