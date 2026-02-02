import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

prisma
  .$connect()
  .then(() => console.log("Connected to database"))
  .catch((err: any) => console.error("Failed to connect:", err));

export default prisma;
