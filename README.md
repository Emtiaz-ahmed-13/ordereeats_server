# OrderEats Server

A robust and scalable backend for the OrderEats food delivery platform. This server application manages users, providers, meals, orders, and reviews, providing a seamless experience for customers, food providers, and administrators.

## 🚀 Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Language:** TypeScript
*   **Authentication:** JWT (JSON Web Tokens)

## 🛠️ Prerequisites

Before getting started, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [PostgreSQL](https://www.postgresql.org/)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 📦 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ordereeats_server.git
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
    ```

4.  **Database Setup:**
    Run the Prisma migrations to set up your database schema:
    ```bash
    npx prisma migrate dev --name init
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

Base URL: `/api/v1`

### 🔐 Authentication

| Method | Endpoint      | Description           | Access Control |
| :----- | :------------ | :-------------------- | :------------- |
| POST   | `/auth/register` | Register a new user   | Public         |
| POST   | `/auth/login`    | Login user & get token| Public         |

### 👤 Users

| Method | Endpoint          | Description         | Access Control |
| :----- | :---------------- | :------------------ | :------------- |
| GET    | `/users`          | Get all users       | Admin          |
| PATCH  | `/users/:id/role` | Update user role    | Admin          |

### 🏪 Providers

| Method | Endpoint        | Description               | Access Control     |
| :----- | :-------------- | :------------------------ | :----------------- |
| POST   | `/providers`    | Create provider profile   | Provider, Admin    |
| GET    | `/providers`    | Get all providers         | Public             |
| GET    | `/providers/:id`| Get provider details      | Public             |

### 📂 Categories

| Method | Endpoint      | Description           | Access Control |
| :----- | :------------ | :-------------------- | :------------- |
| POST   | `/categories` | Create new category   | Admin          |
| GET    | `/categories` | Get all categories    | Public         |

### 🍱 Meals

| Method | Endpoint       | Description             | Access Control     |
| :----- | :------------- | :---------------------- | :----------------- |
| POST   | `/meals`       | Add a new meal          | Provider, Admin    |
| GET    | `/meals`       | Get all meals           | Public             |
| GET    | `/meals/:id`   | Get meal details        | Public             |
| PATCH  | `/meals/:id`   | Update meal details     | Provider, Admin    |
| DELETE | `/meals/:id`   | Delete a meal           | Provider, Admin    |

### 🛍️ Orders

| Method | Endpoint           | Description             | Access Control              |
| :----- | :----------------- | :---------------------- | :-------------------------- |
| POST   | `/orders`          | Place a new order       | Customer                    |
| GET    | `/orders`          | Get all orders          | Customer, Provider, Admin   |
| GET    | `/orders/:id`      | Get specific order      | Customer, Provider, Admin   |
| PATCH  | `/orders/:id/status`| Update order status    | Provider, Admin             |

### ⭐ Reviews

| Method | Endpoint    | Description          | Access Control |
| :----- | :---------- | :------------------- | :------------- |
| POST   | `/reviews`  | Create a review      | Customer       |

## 📁 Project Structure

```bash
src/
├── app/
│   ├── modules/       # Encapsulated modules (Controller, Service, Routes)
│   ├── middleware/    # Auth and error handling middlewares
│   ├── routes/        # Main application routes
│   └── ...
├── server.ts          # Entry point
└── ...
```

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---
Developed by Emtiaz Ahmed
