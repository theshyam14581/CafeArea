const photos={indian:'photo-1631452180519-c014fe946bc7',rajasthani:'photo-1601050690597-df0568f70950',chinese:'photo-1512058564366-18510be2db19',continental:'photo-1579751626657-72bc17010498',cafe:'photo-1553909489-cd47e0ef937f',beverages:'photo-1461023058943-07fcbe16d735',desserts:'photo-1578985545062-69928b1d9587',breakfast:'photo-1533089860892-a7c6f0a88666'};
const img=(key)=>`https://images.unsplash.com/${photos[key]||photos.cafe}?auto=format&fit=crop&w=900&q=85`;
const rows=[
 ['paneer-butter-masala','Paneer Butter Masala','Indian','Creamy tomato gravy, soft paneer, a little kasuri methi. Made for scooping up with warm naan.',295,'indian',true,18,true,'House favourite'],
 ['dal-makhani','Slow-Cooked Dal Makhani','Indian','Black lentils simmered overnight with butter, cream and a gentle smoky finish.',265,'indian',true,20,true,'Slow cooked'],
 ['chole-bhature','Chole Bhature','Indian','Tangy Amritsari chickpeas with two golden, pillowy bhature and pickled onions.',240,'indian',true,22,true,'A classic'],
 ['veg-biryani','Hyderabadi Veg Biryani','Indian','Fragrant basmati, garden vegetables and whole spices, finished dum-style.',285,'indian',true,25,false,''],
 ['chicken-biryani','Chicken Dum Biryani','Indian','Tender chicken tucked into saffron basmati rice with slow-cooked masala.',345,'indian',false,28,false,''],
 ['butter-chicken','Butter Chicken','Indian','Tandoor-kissed chicken in a mellow tomato and butter gravy.',360,'indian',false,22,false,''],
 ['masala-dosa','Crispy Masala Dosa','Indian','Golden rice crepe folded around spiced potato, with sambar and coconut chutney.',195,'indian',true,16,false,''],
 ['samosa','Homestyle Samosa','Indian','Flaky pastry, gently spiced potato and peas. Served with mint chutney.',75,'Indian snacks',true,10,true,'Tea-time pick'],
 ['dal-baati','Dal Baati Churma','Rajasthani','Crackly baked baati, five-lentil dal, sweet churma and a generous spoon of ghee.',325,'Rajasthani',true,30,true,'Regional favourite'],
 ['gatte-ki-sabzi','Gatte Ki Sabzi','Rajasthani','Gram flour dumplings in a bright, tangy yogurt gravy. Comfort from the desert.',255,'Rajasthani',true,22,false,''],
 ['rajasthani-thali','Little Rajasthan Thali','Rajasthani','Dal, gatte, seasonal sabzi, two rotis, rice, churma and something sweet.',395,'Rajasthani',true,30,true,'A full meal'],
 ['pyaaz-kachori','Pyaaz Kachori','Rajasthani','Crisp, flaky kachori with a warmly spiced onion filling and tamarind chutney.',95,'Rajasthani',true,14,false,''],
 ['veg-hakka','Veg Hakka Noodles','Indo-Chinese','Wok-tossed noodles, crunchy vegetables, spring onion and a little soy.',235,'Chinese',true,18,true,'Wok favourite'],
 ['chicken-fried-rice','Chicken Fried Rice','Indo-Chinese','Fluffy rice tossed over a hot wok with egg, chicken, scallion and house seasoning.',265,'Chinese',false,18,false,''],
 ['chilli-paneer','Chilli Paneer','Indo-Chinese','Crispy paneer, peppers and onion in our bright, garlicky chilli sauce.',275,'Chinese',true,20,true,'A little fiery'],
 ['veg-manchurian','Veg Manchurian','Indo-Chinese','Crisp vegetable dumplings with scallions in a glossy, savoury sauce.',245,'Chinese',true,20,false,''],
 ['veg-momos','Steamed Veg Momos','Indo-Chinese','Hand-folded dumplings filled with cabbage and carrot, with house chilli dip.',185,'Chinese',true,16,false,''],
 ['margherita','Margherita Pizza','Continental','Slow tomato, fresh basil and mozzarella on our hand-stretched sourdough base.',325,'continental',true,22,true,'Wood-fired style'],
 ['farmhouse-pizza','Garden Farmhouse Pizza','Continental','Roasted peppers, onion, mushrooms, olives and mozzarella. Plenty to share.',395,'continental',true,25,false,''],
 ['white-pasta','Creamy White Sauce Pasta','Continental','Penne, parmesan cream, seasonal vegetables and just-cracked black pepper.',315,'continental',true,20,true,'Comfort food'],
 ['grilled-sandwich','Grilled Garden Sandwich','Continental','Sourdough, grilled vegetables, basil pesto and melty cheese.',225,'continental',true,14,false,''],
 ['veg-burger','The Good Veg Burger','Continental','Crispy house patty, smoked onion, cheddar and our cafe sauce.',245,'continental',true,18,true,'Guest favourite'],
 ['peri-fries','Peri-Peri Fries','Cafe bites','Crisp golden fries tossed with our zippy peri-peri spice and lime.',155,'Cafe bites',true,12,false,''],
 ['masala-maggi','Masala Maggi','Cafe bites','The familiar bowl: noodles, a buttery masala, garden vegetables and coriander.',125,'Cafe bites',true,12,true,'Little nostalgia'],
 ['nachos','Loaded Cafe Nachos','Cafe bites','Corn chips, beans, salsa, jalapeño and warm cheese sauce.',245,'Cafe bites',true,16,false,''],
 ['cappuccino','House Cappuccino','Coffee & tea','A double shot from our house beans, softened with silky steamed milk.',160,'Coffee & tea',true,5,true,'Our daily ritual'],
 ['cold-coffee','Classic Cold Coffee','Coffee & tea','Slow-chilled espresso blended with milk, ice and a little vanilla.',185,'Coffee & tea',true,7,true,'Cool favourite'],
 ['masala-chai','Adrak Masala Chai','Coffee & tea','Fresh ginger, warming spices and strong Assam tea, simmered the old way.',85,'Coffee & tea',true,8,false,''],
 ['mango-shake','Alphonso Mango Shake','Coffee & tea','Seasonal Alphonso mango, chilled milk and a small scoop of vanilla.',195,'Coffee & tea',true,8,false,'Seasonal'],
 ['brownie','Warm Chocolate Brownie','Something sweet','Dark chocolate brownie, a little crisp at the edge, soft in the middle.',175,'Something sweet',true,12,true,'Fresh from oven'],
 ['lava-cake','Chocolate Lava Cake','Something sweet','A warm cocoa cake with a molten chocolate centre. Best with vanilla ice cream.',225,'Something sweet',true,14,false,''],
 ['gulab-jamun','Gulab Jamun','Something sweet','Two soft khoya dumplings in cardamom syrup, finished with pistachio.',115,'Something sweet',true,10,false,''],
 ['cheesecake','Baked Vanilla Cheesecake','Something sweet','Creamy baked cheesecake on a buttery biscuit base with berry compote.',245,'Something sweet',true,10,true,'House baked'],
 ['avocado-toast','Avocado & Egg Toast','Breakfast','Seeded sourdough, smashed avocado, chilli oil and a sunny-side egg.',275,'Breakfast',false,14,false,'Morning pick'],
 ['pancakes','Buttermilk Pancakes','Breakfast','A stack of fluffy pancakes with maple, berries and salted butter.',255,'Breakfast',true,18,true,'Weekend mood'],
 ['lemon-soda','Fresh Lime Soda','Coolers', 'Fresh lime, soda and a pinch of kala namak. Choose sweet or salty.',95,'Coolers',true,5,false,''],
 ['hot-chocolate','Velvet Hot Chocolate','Coffee & tea','Real dark chocolate whisked into steamed milk, with a soft cocoa top.',175,'Coffee & tea',true,8,false,'']
];
export const menuItems=rows.map(([id,name,category,description,price,key,isVeg,prepTime,featured,tag])=>({id,name,category,description,price,image:img(key),isVeg,prepTime:`${prepTime} min`,featured,tag,available:true,spiceLevel:['Indian','Rajasthani','Chinese','Indo-Chinese'].includes(category)?'Medium':undefined,portionSize:'1 serving'}));
export const categories=[
 {name:'Indian',subtitle:'A taste of home',image:img('indian')},{name:'Rajasthani',subtitle:'Desert comforts',image:img('rajasthani')},{name:'Indo-Chinese',subtitle:'Straight from the wok',image:img('chinese')},{name:'Continental',subtitle:'A little something else',image:img('continental')},
 {name:'Cafe bites',subtitle:'For the in-between',image:img('cafe')},{name:'Coffee & tea',subtitle:'Your daily ritual',image:img('beverages')},{name:'Something sweet',subtitle:'Always room for dessert',image:img('desserts')},{name:'Breakfast',subtitle:'A brighter beginning',image:img('breakfast')},{name:'Coolers',subtitle:'A little refreshment',image:img('beverages')}
];
