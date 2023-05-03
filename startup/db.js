     function connectDB() {
    const { PrismaClient } = require('@prisma/client');
     const prisma = new PrismaClient();
         return prisma;
};


module.exports = {
   prisma:connectDB
};