# OrderEats Server 🍔

A robust and scalable backend for the OrderEats food delivery platform. This server application manages users, providers, meals, orders, carts, reviews, promo codes, and more, providing a seamless experience for customers, food providers, and administrators.

## 🚀 Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Language:** TypeScript
*   **Authentication:** JWT (JSON Web Tokens)
*   **Email Service:** Nodemailer

## 🛠️ Prerequisites

Before getting started, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [PostgreSQL](https://www.postgresql.org/)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

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
    DATABASE_URL="postgresql://user:password@localhost:5432/ordereeats_db?schema=public"
    JWT_SECRET="your_jwt_secret"
    JWT_EXPIRES_IN="30d"
    JWT_REFRESH_SECRET="your_refresh_secret"
    JWT_REFRESH_EXPIRES_IN="365d"
    BCRYPT_SALT_ROUNDS=10
    EMAIL_USER="your_email@gmail.com"
    EMAIL_PASSWORD="your_app_password"
    FRONTEND_URL="http://localhost:3000"
    ```

4.  **Database Setup:**
    Run the Prisma migrations to set up your database schema:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    ```

5.  **Run the Server:**
    *   **Development Mode:**
        ```bash
        npm run dev
        ```
    *   **Production Build:**
        ```bash
        npm run build
        npm start
        ```

## 📡 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### 🔐 Authentication

| Method | Endpoint                  | Description                    | Access Control | Request Body                                   |
| :----- | :------------------------ | :----------------------------- | :------------- | :--------------------------------------------- |
| POST   | `/auth/register`          | Register a new user            | Public         | `{ name, email, password, role }`              |
| POST   | `/auth/login`             | Login user & get tokens        | Public         | `{ email, password }`                          |
| POST   | `/auth/refresh`           | Refresh access token           | Public         | `{ refreshToken }`                             |
| POST   | `/auth/verify-email`      | Verify email with token        | Public         | `{ token }`                                    |
| POST   | `/auth/resend-verification` | Resend verification email    | Public         | `{ email }`                                    |
| POST   | `/auth/forgot-password`   | Request password reset         | Public         | `{ email }`                                    |
| POST   | `/auth/reset-password`    | Reset password with token      | Public         | `{ token, newPassword }`                       |

### 👤 Users

| Method | Endpoint          | Description         | Access Control | Request Body           |
| :----- | :---------------- | :------------------ | :------------- | :--------------------- |
| GET    | `/users`          | Get all users       | Admin          | -                      |
| PATCH  | `/users/:id/role` | Update user role    | Admin          | `{ role }`             |

### 🏪 Providers

| Method | Endpoint        | Description               | Access Control     | Request Body                                        |
| :----- | :-------------- | :------------------------ | :----------------- | :-------------------------------------------------- |
| POST   | `/providers`    | Create provider profile   | Provider, Admin    | `{ name, description, location, phone, image }`     |
| GET    | `/providers`    | Get all providers         | Public             | -                                                   |
| GET    | `/providers/:id`| Get provider details      | Public             | -                                                   |

### 📂 Categories

| Method | Endpoint      | Description           | Access Control | Request Body           |
| :----- | :------------ | :-------------------- | :------------- | :--------------------- |
| POST   | `/categories` | Create new category   | Admin          | `{ name, description }`|
| GET    | `/categories` | Get all categories    | Public         | -                      |

### 🍱 Meals

| Method | Endpoint       | Description             | Access Control     | Request Body                                                  |
| :----- | :------------- | :---------------------- | :----------------- | :------------------------------------------------------------ |
| POST   | `/meals`       | Add a new meal          | Provider, Admin    | `{ name, description, price, categoryId, providerId, image }` |
| GET    | `/meals`       | Get all meals           | Public             | -                                                             |
| GET    | `/meals/:id`   | Get meal details        | Public             | -                                                             |
| PATCH  | `/meals/:id`   | Update meal details     | Provider, Admin    | `{ name, description, price, categoryId, image }`             |
| DELETE | `/meals/:id`   | Delete a meal           | Provider, Admin    | -                                                             |

### 🛒 Cart

| Method | Endpoint              | Description               | Access Control | Request Body              |
| :----- | :-------------------- | :------------------------ | :------------- | :------------------------ |
| GET    | `/cart`               | Get current user's cart   | Customer       | -                         |
| GET    | `/cart/total`         | Get cart total            | Customer       | -                         |
| POST   | `/cart/items`         | Add item to cart          | Customer       | `{ mealId, quantity }`    |
| PATCH  | `/cart/items/:itemId` | Update cart item quantity | Customer       | `{ quantity }`            |
| DELETE | `/cart/items/:itemId` | Remove item from cart     | Customer       | -                         |
| DELETE | `/cart`               | Clear entire cart         | Customer       | -                         |

### 🛍️ Orders

| Method | Endpoint               | Description             | Access Control              | Request Body                                  |
| :----- | :--------------------- | :---------------------- | :-------------------------- | :-------------------------------------------- |
| POST   | `/orders`              | Place a new order       | Customer                    | `{ items, deliveryAddress, paymentMethod }`   |
| GET    | `/orders`              | Get all orders          | Customer, Provider, Admin   | -                                             |
| GET    | `/orders/:id`          | Get specific order      | Customer, Provider, Admin   | -                                             |
| PATCH  | `/orders/:id/status`   | Update order status     | Provider, Admin             | `{ status }`                                  |

### ⭐ Reviews

| Method | Endpoint    | Description          | Access Control | Request Body                        |
| :----- | :---------- | :------------------- | :------------- | :---------------------------------- |
| POST   | `/reviews`  | Create a review      | Customer       | `{ mealId, rating, comment }`       |

### 🎟️ Promo Codes

| Method | Endpoint               | Description               | Access Control | Request Body                                                           |
| :----- | :--------------------- | :------------------------ | :------------- | :--------------------------------------------------------------------- |
| GET    | `/promo-codes/active`  | Get active promo codes    | Public         | -                                                                      |
| POST   | `/promo-codes/:code/validate` | Validate promo code | Customer       | `{ orderTotal }`                                                       |
| POST   | `/promo-codes`         | Create promo code         | Admin          | `{ code, discountType, discountValue, minOrderAmount, maxUses, expiresAt }` |
| GET    | `/promo-codes`         | Get all promo codes       | Admin          | -                                                                      |
| PATCH  | `/promo-codes/:id`     | Update promo code         | Admin          | `{ code, discountType, discountValue, minOrderAmount, maxUses, expiresAt }` |
| DELETE | `/promo-codes/:id`     | Delete promo code         | Admin          | -                                                                      |

## 🔑 Authentication & Authorization

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid access token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

### User Roles:
- **CUSTOMER** - Can place orders, manage cart, write reviews
- **PROVIDER** - Can manage their meals and view orders
- **ADMIN** - Full access to all endpoints

### Token System:
- **Access Token** - Short-lived token (30 days) for API requests
- **Refresh Token** - Long-lived token (365 days) to get new access tokens

## 📁 Project Structure

```bash
src/
├── app/
│   ├── modules/           # Feature modules
│   │   ├── Auth/          # Authentication
│   │   ├── Users/         # User management
│   │   ├── Providers/     # Provider management
│   │   ├── Categories/    # Category management
│   │   ├── Meals/         # Meal management
│   │   ├── Cart/          # Shopping cart
│   │   ├── Orders/        # Order management
│   │   ├── Reviews/       # Reviews & ratings
│   │   └── PromoCodes/    # Promo code system
│   ├── middleware/        # Auth, validation, upload
│   ├── errors/            # Error handling
│   ├── shared/            # Shared utilities
│   └── routes/            # Route aggregation
├── config/                # Configuration
├── helpers/               # Helper functions
├── prisma/                # Database schema
└── server.ts              # Entry point
```

## 📝 Response Format

All API responses follow a consistent format:

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
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

## 🧪 Testing

You can test the API using tools like:
- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code Extension)
- [Insomnia](https://insomnia.rest/)
- [cURL](https://curl.se/)

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Vercel** (Serverless)
- **Heroku**
- **Railway**
- **DigitalOcean**
- **AWS**

Make sure to set up environment variables on your deployment platform.

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Developed with ❤️ by Emtiaz Ahmed**
