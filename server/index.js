import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import "dotenv/config.js";
import routes from "./src/routes/index.js";

const app = express();

// ✅ CORS Configuration - Allow frontend to access backend
const corsOptions = {
    origin: 'http://localhost:3000', // React app URL
    credentials: true, // Allow cookies
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // ✅ Use CORS with options

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Mount routes
app.use('/api/v1', routes);

const port = process.env.PORT || 3003;
const mongodb_url = process.env.MONGODB_URL;

const server = http.createServer(app);

mongoose.connect(mongodb_url).then(() => {
    console.log('✅ Connected to MongoDB');
    
    server.listen(port, () => {
        console.log(`🚀 Backend running on http://localhost:${port}`);
        console.log(`📝 API Base: http://localhost:${port}/api/v1`);
    });
}).catch((err) => {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
});