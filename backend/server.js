import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import path from 'node:path';
import authRoutes from './src/routes/auth.js';
import menuRoutes from './src/routes/menu.js';
import orderRoutes from './src/routes/orders.js';
import billingRoutes from './src/routes/billing.js';
import whatsappRoutes from './src/routes/whatsapp.js';
import { protect } from './src/middleware/auth.js';
import { Order, CafeSettings } from './src/models/index.js';

const app=express();
app.use(helmet());app.use(cors({origin:process.env.CLIENT_ORIGIN||'http://localhost:5173'}));app.use(express.json({limit:'30kb'}));
app.use('/api',rateLimit({windowMs:15*60*1000,limit:250,standardHeaders:true,legacyHeaders:false}));
app.get('/api/health',(_,res)=>res.json({ok:true,service:'The Good Cup API'}));
app.use('/api/auth',authRoutes);app.use('/api/menu',menuRoutes);app.use('/api/orders',orderRoutes);app.use('/api/billing',billingRoutes);app.use('/api/whatsapp',whatsappRoutes);
app.get('/api/customers',protect,async(_,res)=>{const rows=await Order.aggregate([{$group:{_id:'$customer.phone',name:{$last:'$customer.name'},phone:{$last:'$customer.phone'},orders:{$sum:1},spend:{$sum:'$totals.total'}}},{$sort:{spend:-1}}]);res.json(rows)});
app.get('/api/reports/summary',protect,async(req,res)=>{const from=new Date(req.query.from||new Date(Date.now()-30*864e5));const orders=await Order.find({createdAt:{$gte:from}}).lean();res.json({orders:orders.length,revenue:orders.reduce((s,o)=>s+o.totals.total,0),byStatus:orders.reduce((a,o)=>(a[o.status]=(a[o.status]||0)+1,a),{})})});
app.get('/api/settings',protect,async(_,res)=>res.json(await CafeSettings.findOne().lean()||{}));
app.patch('/api/settings',protect,async(req,res)=>{const safe={name:req.body.name,address:req.body.address,phone:req.body.phone,whatsapp:req.body.whatsapp,hours:req.body.hours,taxRate:req.body.taxRate,deliveryCharge:req.body.deliveryCharge,paymentMethods:req.body.paymentMethods};res.json(await CafeSettings.findOneAndUpdate({},safe,{upsert:true,new:true,runValidators:true}))});
app.use('/api',(_,res)=>res.status(404).json({message:'API route not found'}));
if(process.env.NODE_ENV==='production'){
 const webRoot=path.resolve('dist');
 app.use(express.static(webRoot));
 app.get('*',(_,res)=>res.sendFile(path.join(webRoot,'index.html')));
}
app.use((err,_,res,next)=>{console.error(err);res.status(err.status||500).json({message:err.message||'Something went wrong'})});
const port=process.env.PORT||5000;
mongoose.connect(process.env.MONGODB_URI).then(()=>app.listen(port,()=>console.log(`Cafe API listening on ${port}`))).catch(e=>{console.error('MongoDB connection failed:',e.message);process.exit(1)});
