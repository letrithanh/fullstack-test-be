import app from "./app";
import { PrismaClient } from "@prisma/client";

const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

app.listen(PORT, async () => {
    try {
        await prisma.$connect();
        console.log("Connected to MySQL");
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.error("Database connection error:", error);
    }
});
