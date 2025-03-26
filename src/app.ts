import app from "@server/server";
import dotenv from "dotenv";
import "@config/mongodb";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);