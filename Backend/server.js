import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import adminDashboardRoutes from "./routes/adminDashboard.js"
import adminOrderRoutes from "./routes/adminOrderRoutes.js"
import couponRoutes from "./routes/couponRoutes.js"
import couponRoute from "./routes/couponRoute.js"
import couponPublicRoutes from "./routes/couponPublicRoutes.js"
import bannerRoutes from "./routes/bannerRoutes.js"

// ================= APP CONFIG =================
const app = express()
const port = process.env.PORT || 4000

// ================= DATABASE =================
connectDB()
connectCloudinary()

// ================= CORS CONFIG =================
const allowedOrigins = [
  "https://pet-admin-two.vercel.app",  // your deployed frontend
  "http://localhost:5173"              // local frontend
]

app.use(cors({
  origin: function (origin, callback) {
    // allow Postman / mobile apps
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error("Not allowed by CORS"))
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

// ================= MIDDLEWARES =================
app.use(express.json())

// ================= API ROUTES =================
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use("/api/admin/dashboard", adminDashboardRoutes)
app.use("/api/admin", adminOrderRoutes)
app.use("/api/coupon", couponRoutes)
app.use("/api/admin/coupon", couponRoute)
app.use("/api/coupons", couponPublicRoutes)
app.use("/api/banners", bannerRoutes)

// ================= ROOT ROUTE =================
app.get('/', (req, res) => {
  res.send("API Working 🚀")
})

// ================= START SERVER =================
app.listen(port, () => {
  console.log("Server started on PORT: " + port)
})
