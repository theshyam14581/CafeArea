import {Router} from 'express';
import {Order} from '../models/index.js';
import {protect} from '../middleware/auth.js';
const r=Router();
r.get('/',protect,async(req,res)=>{const q={invoiceNumber:{$exists:true}};if(req.query.from||req.query.to)q.createdAt={...(req.query.from?{$gte:new Date(req.query.from)}:{}),...(req.query.to?{$lte:new Date(req.query.to)}:{})};res.json(await Order.find(q).select('orderNumber invoiceNumber customer items totals payment paymentStatus status createdAt').sort({createdAt:-1}).limit(500).lean())});
r.get('/:id',protect,async(req,res)=>{const order=await Order.findById(req.params.id).select('orderNumber invoiceNumber customer items totals payment paymentStatus status createdAt').lean();if(!order)return res.status(404).json({message:'Invoice not found'});res.json(order)});
export default r;
