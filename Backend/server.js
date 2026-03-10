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
import promoBannerRouter from "./routes/promoBannerRoutes.js";
import path from "path";
import { fileURLToPath } from "url";


const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())

// image access
app.use("/images", express.static(path.join(__dirname, "uploads")));


app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use("/api/admin/dashboard", adminDashboardRoutes)
app.use("/api/admin", adminOrderRoutes)
app.use("/api/coupon", couponRoutes)
app.use("/api/admin/coupon", couponRoute)
app.use("/api/coupons", couponPublicRoutes)
app.use("/api/banners",bannerRoutes)
app.use("/api/promo-banner", promoBannerRouter);

app.get('/',(req,res)=>{
    res.send("API Working")
})


// 🔥 IMPORTANT PART

if (process.env.VERCEL !== "1") {
  const port = 4000
  app.listen(port, () => {
    console.log("Server started on PORT: " + port)
  })
}

// Vercel ke liye
export default app
