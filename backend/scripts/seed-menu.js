import 'dotenv/config';
import mongoose from 'mongoose';
import { menuItems, categories } from '../../src/data/menu.js';
import { MenuItem, Category } from '../src/models/index.js';
if(!process.env.MONGODB_URI){console.error('Set MONGODB_URI in .env first.');process.exit(1)}
await mongoose.connect(process.env.MONGODB_URI);
for(const c of categories)await Category.updateOne({name:c.name},{$setOnInsert:{name:c.name,image:c.image,active:true}},{upsert:true});
if(await MenuItem.countDocuments()===0){
 await MenuItem.insertMany(menuItems.map(m=>({itemId:m.id,name:m.name,category:m.category,image:m.image,description:m.description,price:m.price,classification:m.isVeg?'veg':'non-veg',available:m.available,spiceLevel:m.spiceLevel,prepTime:Number.parseInt(m.prepTime,10),portionSize:m.portionSize,popularity:m.featured?10:0})));
 console.log(`Seeded ${menuItems.length} sample dishes.`)
}else console.log('Menu collection already has records; left menu unchanged.');
await mongoose.disconnect();
