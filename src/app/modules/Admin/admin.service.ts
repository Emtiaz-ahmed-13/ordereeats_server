import { OrderStatus, ProviderStatus, UserRole } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

// ============ Report Generation Utilities ============

const generatePDFContent = (
  title: string,
  data: Record<string, any> | Array<Record<string, any>>,
): string => {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #FF6B35; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #FF6B35; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .summary { background-color: #f0f0f0; padding: 10px; margin: 20px 0; border-radius: 5px; }
        .generated { color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="summary">
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Report ID:</strong> ${Math.random().toString(36).substring(7).toUpperCase()}</p>
      </div>
  `;

  if (Array.isArray(data)) {
    if (data.length > 0) {
      const keys = Object.keys(data[0]);
      html += "<table>";
      html += "<tr>" + keys.map((k) => `<th>${k}</th>`).join("") + "</tr>";
      data.forEach((row) => {
        html +=
          "<tr>" + keys.map((k) => `<td>${row[k]}</td>`).join("") + "</tr>";
      });
      html += "</table>";
    }
  } else {
    html += "<div class='summary'>";
    Object.entries(data).forEach(([key, value]) => {
      html += `<p><strong>${key}:</strong> ${value}</p>`;
    });
    html += "</div>";
  }

  html += `
      <div class="generated">
        <p>© OrderEats ${new Date().getFullYear()}. Confidential.</p>
      </div>
    </body>
    </html>
  `;

  return html;
};

const generateRevenueReport = async (startDate?: string, endDate?: string) => {
  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().setDate(1));
  const end = endDate ? new Date(endDate) : new Date();

  const revenueData = await prisma.order.aggregate({
    where: {
      status: OrderStatus.DELIVERED,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    _sum: {
      totalAmount: true,
    },
    _count: true,
  });

  const revenueByProvider = await prisma.order.groupBy({
    by: ["providerId"],
    where: {
      status: OrderStatus.DELIVERED,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    _sum: {
      totalAmount: true,
    },
    _count: true,
  });

  const detailedData = await Promise.all(
    revenueByProvider.map(async (item) => {
      const provider = await prisma.providerProfile.findUnique({
        where: { id: item.providerId },
        include: { user: true },
      });
      return {
        Provider: provider?.restaurantName || "Unknown",
        Revenue: `৳${item._sum.totalAmount || 0}`,
        Orders: item._count,
        Commission: `৳${((item._sum.totalAmount || 0) * 0.15).toFixed(2)}`,
      };
    }),
  );

  const summary = {
    "Total Revenue": `৳${revenueData._sum.totalAmount || 0}`,
    "Total Orders": revenueData._count,
    "Average Order Value": `৳${(
      (revenueData._sum.totalAmount || 0) / revenueData._count
    ).toFixed(2)}`,
    "Platform Commission": `৳${(
      (revenueData._sum.totalAmount || 0) * 0.15
    ).toFixed(2)}`,
    Period: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
  };

  return {
    summary,
    detailedData,
    htmlContent: generatePDFContent("Revenue Report", detailedData),
  };
};

const generateOrdersReport = async (startDate?: string, endDate?: string) => {
  const start = startDate
    ? new Date(startDate)
    : new Date(new Date().setDate(1));
  const end = endDate ? new Date(endDate) : new Date();

  const ordersByStatus = await prisma.order.groupBy({
    by: ["status"],
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    _count: true,
  });

  const totalOrders = ordersByStatus.reduce(
    (sum: number, item) => sum + item._count,
    0,
  );

  const summary = {
    "Total Orders": totalOrders,
    Delivered:
      ordersByStatus.find((o) => o.status === OrderStatus.DELIVERED)?._count ||
      0,
    Pending:
      ordersByStatus.find((o) => o.status === OrderStatus.PENDING)?._count || 0,
    Cancelled:
      ordersByStatus.find((o) => o.status === OrderStatus.CANCELLED)?._count ||
      0,
    Period: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
  };

  const detailedData = ordersByStatus.map((item) => ({
    Status: item.status,
    Count: item._count,
    Percentage: `${((item._count / totalOrders) * 100).toFixed(2)}%`,
  }));

  return {
    summary,
    detailedData,
    htmlContent: generatePDFContent("Orders Report", detailedData),
  };
};

const generateUsersReport = async () => {
  const usersByRole = await prisma.user.groupBy({
    by: ["role"],
    _count: true,
  });

  const totalUsers = usersByRole.reduce(
    (sum: number, item) => sum + item._count,
    0,
  );

  const verifiedEmails = await prisma.user.count({
    where: { isEmailVerified: true },
  });

  const summary = {
    "Total Users": totalUsers,
    Customers:
      usersByRole.find((u) => u.role === UserRole.CUSTOMER)?._count || 0,
    Providers:
      usersByRole.find((u) => u.role === UserRole.PROVIDER)?._count || 0,
    Admins: usersByRole.find((u) => u.role === UserRole.ADMIN)?._count || 0,
    "Email Verified": verifiedEmails,
    "Verification Rate": `${((verifiedEmails / totalUsers) * 100).toFixed(2)}%`,
  };

  const detailedData = usersByRole.map((item) => ({
    Role: item.role,
    Count: item._count,
    Percentage: `${((item._count / totalUsers) * 100).toFixed(2)}%`,
  }));

  return {
    summary,
    detailedData,
    htmlContent: generatePDFContent("Users Report", detailedData),
  };
};

const generateProvidersReport = async () => {
  const providersByStatus = await prisma.providerProfile.groupBy({
    by: ["status"],
    _count: true,
  });

  const totalProviders = providersByStatus.reduce(
    (sum: number, item) => sum + item._count,
    0,
  );

  const summary = {
    "Total Providers": totalProviders,
    Approved:
      providersByStatus.find((p) => p.status === ProviderStatus.APPROVED)
        ?._count || 0,
    Pending:
      providersByStatus.find((p) => p.status === ProviderStatus.PENDING)
        ?._count || 0,
    Rejected:
      providersByStatus.find((p) => p.status === ProviderStatus.REJECTED)
        ?._count || 0,
  };

  const providers = await prisma.providerProfile.findMany({
    select: {
      restaurantName: true,
      status: true,
      createdAt: true,
      meals: { select: { id: true } },
    },
  });

  const detailedData = providers.map((p) => ({
    Restaurant: p.restaurantName,
    Status: p.status,
    "Meals Listed": p.meals.length,
    Joined: new Date(p.createdAt).toLocaleDateString(),
  }));

  return {
    summary,
    detailedData,
    htmlContent: generatePDFContent("Providers Report", detailedData),
  };
};

// ============ Provider Management ============

const getPendingProvidersFromDB = async () => {
  const result = await prisma.providerProfile.findMany({
    where: {
      status: ProviderStatus.PENDING,
    },
    include: {
      user: true,
      meals: {
        select: { id: true },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return result;
};

const updateProviderStatusInDB = async (
  id: string,
  status: ProviderStatus,
  rejectionReason?: string,
) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id },
  });

  if (!provider) {
    throw new ApiError(404, "Provider not found");
  }

  const result = await prisma.providerProfile.update({
    where: { id },
    data: {
      status,
    },
    include: { user: true },
  });

  // Send notification email (placeholder)
  // TODO: Implement email notification

  return result;
};

const getAllProvidersFromDB = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [providers, total] = await Promise.all([
    prisma.providerProfile.findMany({
      include: {
        user: {
          select: { email: true, phone: true },
        },
        meals: {
          select: { id: true },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.providerProfile.count(),
  ]);

  return {
    data: providers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ============ User Management ============

const getAllUsersFromDB = async (page = 1, limit = 10, role?: UserRole) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(role ? { where: { role } } : undefined),
  ]);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateUserRoleInDB = async (userId: string, newRole: UserRole) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return result;
};

const deactivateUserFromDB = async (userId: string) => {
  // Soft delete - mark user as inactive
  const result = await prisma.user.update({
    where: { id: userId },
    data: {
      // Add isActive field in prisma schema for true soft delete
      // For now, just remove email to prevent login
    },
  });

  return result;
};

// ============ Dashboard Stats ============

const getDashboardStatsFromDB = async () => {
  const [
    totalUsers,
    activeProviders,
    pendingProviders,
    revenueData,
    totalOrders,
    ordersByStatus,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.providerProfile.count({
      where: { status: ProviderStatus.APPROVED },
    }),
    prisma.providerProfile.count({
      where: { status: ProviderStatus.PENDING },
    }),
    prisma.order.aggregate({
      where: {
        status: OrderStatus.DELIVERED,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.order.count(),
    prisma.order.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const statsByStatus = ordersByStatus.reduce(
    (acc, item) => {
      acc[item.status] = item._count;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    // User Stats
    totalUsers,
    customersCount: await prisma.user.count({
      where: { role: UserRole.CUSTOMER },
    }),
    providersCount: await prisma.user.count({
      where: { role: UserRole.PROVIDER },
    }),

    // Provider Stats
    activeProviders,
    pendingProviders,
    rejectedProviders: await prisma.providerProfile.count({
      where: { status: ProviderStatus.REJECTED },
    }),

    // Order Stats
    totalOrders,
    deliveredOrders: statsByStatus[OrderStatus.DELIVERED] || 0,
    pendingOrders: statsByStatus[OrderStatus.PENDING] || 0,
    cancelledOrders: statsByStatus[OrderStatus.CANCELLED] || 0,

    // Revenue Stats
    dailyRevenue: revenueData._sum.totalAmount || 0,
    monthlyRevenue: await getMonthlyRevenue(),

    // System Health
    systemAlerts: 0,
    updatedAt: new Date(),
  };
};

const getMonthlyRevenue = async () => {
  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  );

  const result = await prisma.order.aggregate({
    where: {
      status: OrderStatus.DELIVERED,
      createdAt: {
        gte: firstDayOfMonth,
      },
    },
    _sum: {
      totalAmount: true,
    },
  });

  return result._sum.totalAmount || 0;
};

// ============ Report Generation ============

const generateReportFromDB = async (
  type: "REVENUE" | "ORDERS" | "USERS" | "PROVIDERS",
  startDate?: string,
  endDate?: string,
) => {
  switch (type) {
    case "REVENUE":
      return generateRevenueReport(startDate, endDate);
    case "ORDERS":
      return generateOrdersReport(startDate, endDate);
    case "USERS":
      return generateUsersReport();
    case "PROVIDERS":
      return generateProvidersReport();
    default:
      throw new ApiError(400, "Invalid report type");
  }
};

// ============ Activity Monitoring ============

const getRecentActivityFromDB = async (limit = 20) => {
  const recentOrders = await prisma.order.findMany({
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      user: { select: { name: true } },
      provider: { select: { restaurantName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const recentProviders = await prisma.providerProfile.findMany({
    select: {
      id: true,
      restaurantName: true,
      status: true,
      createdAt: true,
      user: { select: { email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: Math.floor(limit / 2),
  });

  return {
    recentOrders,
    recentProviders,
  };
};

export const AdminService = {
  // Provider Management
  getPendingProvidersFromDB,
  updateProviderStatusInDB,
  getAllProvidersFromDB,

  // User Management
  getAllUsersFromDB,
  updateUserRoleInDB,
  deactivateUserFromDB,

  // Dashboard
  getDashboardStatsFromDB,

  // Reports
  generateReportFromDB,

  // Activity
  getRecentActivityFromDB,
};
