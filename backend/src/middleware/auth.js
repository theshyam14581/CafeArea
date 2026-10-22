import jwt from 'jsonwebtoken';
export function protect(req,res,next){const header=req.get('authorization')||'';const token=header.startsWith('Bearer ')?header.slice(7):'';try{if(!token)throw new Error();req.owner=jwt.verify(token,process.env.JWT_SECRET);next()}catch{return res.status(401).json({message:'Please sign in to continue'})}}
