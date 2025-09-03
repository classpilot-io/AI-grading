import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['query'],
        transactionOptions: {
            timeout: 30000, // 30 seconds timeout
            maxWait: 20000, // 20 seconds max wait
        }
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
