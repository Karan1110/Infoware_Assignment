     function connectDB() {
    const { PrismaClient } = require('@prisma/client');
     const prisma = new PrismaClient({datasources : process.env.DATABASE_URL});
         return prisma;
};


module.exports = {
   prisma:connectDB
};