import 'dotenv/config';
import mongoose from 'mongoose';
import { menuItems, categories } from '../../src/data/menu.js';
import { MenuItem, Category } from '../src/models/index.js';
if(!process.env.MONGODB_URI){console.error('Set MONGODB_URI in .env first.');process.exit(1)}
await mongoose.connect(process.env.MONGODB_URI);
for(const c of categories)await Category.updateOne({name:c.name},{$set:{name:c.name,image:c.image,active:true}},{upsert:true});
for(const m of menuItems){
  await MenuItem.updateOne(
    {itemId:m.id},
    {
      $set:{
        name:m.name,
        category:m.category,
        image:m.image,
        description:m.description,
        price:m.price,
        classification:m.isVeg?'veg':'non-veg',
        available:m.available,
        spiceLevel:m.spiceLevel,
        prepTime:Number.parseInt(m.prepTime,10)||15,
        portionSize:m.portionSize,
        popularity:m.featured?10:0
      }
    },
    {upsert:true}
  );
}
console.log(`Synced ${menuItems.length} dishes and ${categories.length} categories with high-resolution photography.`);
await mongoose.disconnect();
