import { UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const updateUserStatusInDB = async (id: string, role: UserRole) => {
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });
  return result;
};

export const UserService = {
  getAllUsersFromDB,
  updateUserStatusInDB,
};
