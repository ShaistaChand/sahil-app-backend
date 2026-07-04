// import dns from 'node:dns/promises'; dns.setServers(['8.8.8.8', '1.1.1.1']);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------------------
       CORS MUST BE HERE
---------------------------- */

app.use(cors({
  origin: 'https://sahilapp.netlify.app', // Your exact frontend URL
  credentials: true,              // Allows cookies/tokens to pass through safely
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));


// app.use(cors({
//   origin: "*", // ["http://localhost:5173", "http://127.0.0.1:5173"],
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization", "Accept"]
// }));

/* ---------------------------
        SECURITY + BODY PARSER
---------------------------- */
/* ---------------------------
   SECURITY (CORS-COMPATIBLE)
---------------------------- */
// Configures Helmet safely so it doesn't block cross-domain cookies or logins!

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------------------
        DATABASE CONNECTION
---------------------------- */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense-tracker',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      }
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

  } catch (error) {
    console.error('\n❌ MONGODB CONNECTION FAILED');
    console.error(error);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

connectDB();

/* ---------------------------
              ROUTES
---------------------------- */
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/payments', paymentRoutes);
// app.use('/health', memberRoutes);
app.use('/api/members', memberRoutes); // FIXED: Moved member routes safely under an explicit prefix pathway!

/* ---------------------------
         HEALTH CHECK
---------------------------- */

app.get('/', (req, res) => {
  res.send('Backend is running successfully!');
});

// Primary platform health telemetry loop

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Expense Tracker API is running!',
    timestamp: new Date().toISOString()
  });
});

// Root health check fallback (no /api prefix)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Sahil App API is running',
        timestamp: new Date().toISOString()
    });
});

/* ---------------------------
    404 ROUTE HANDLER
---------------------------- */
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

/* ---------------------------
    GLOBAL ERROR HANDLER
---------------------------- */
app.use(errorHandler);

/* ---------------------------
         START SERVER
---------------------------- */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
