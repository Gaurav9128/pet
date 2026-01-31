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
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import couponRoute from "./routes/couponRoute.js";
// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/admin/coupon", couponRoute);

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))