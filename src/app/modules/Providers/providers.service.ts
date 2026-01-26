import { ProviderProfile } from "@prisma/client";
import prisma from "../../shared/prisma";

const createProviderProfileInDB = async (data: ProviderProfile) => {
    const result = await prisma.providerProfile.create({
        data,
    });
    return result;
};

const getAllProvidersFromDB = async () => {
    const result = await prisma.providerProfile.findMany({
        include: {
            user: true,
            meals: true,
        },
    });
    return result;
};

const getProviderByIdFromDB = async (id: string) => {
    const result = await prisma.providerProfile.findUnique({
        where: {
            id,
        },
        include: {
            user: true,
            meals: true,
        },
    });
    return result;
};

export const ProviderService = {
    createProviderProfileInDB,
    getAllProvidersFromDB,
    getProviderByIdFromDB,
};
