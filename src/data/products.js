const u = (id) => `https://images.unsplash.com/${id}?w=400&h=400&fit=crop`;

const CATEGORY_IMAGES = {
  "Mobiles": [
    "photo-1511707171634-5f897ff02aa9",
    "photo-1598327105666-5b89351aff97",
    "photo-1580910051074-3eb694886505",
    "photo-1601784551446-20c9e07cdbdb",
    "photo-1592750475338-74b7b21085ab",
    "photo-1510557880182-3d4d3cba35a5",
    "photo-1598965402089-897ce52e8355",
    "photo-1605236453806-6ff36851218e",
    "photo-1610945265064-0e34e5519bbf",
    "photo-1607936854279-55e8a4c64888"
  ],
  "Electronics": [
    "photo-1505740420928-5e560c06d30e",
    "photo-1523275335684-37898b6baf30",
    "photo-1587829741301-dc798b83add3",
    "photo-1589003077984-894e133dabab",
    "photo-1611510338559-2f463335092c",
    "photo-1590658268037-6bf12165a8df",
    "photo-1546868871-7041f2a55e12",
    "photo-1498050108023-c5249f4df085",
    "photo-1572569511254-d8f925fe2cbb",
    "photo-1527864550417-7fd91fc51a46"
  ],
  "Fashion": [
    "photo-1523398002811-999ca8dec234",
    "photo-1594633312681-425c7b97ccd1",
    "photo-1542272604-787c3835535d",
    "photo-1596755094514-f87e34085b2c",
    "photo-1572804013309-59a88b7e92f1",
    "photo-1521572163474-6864f9cf17ab",
    "photo-1584370848010-d7fe6bc767ec",
    "photo-1525507119028-ed4c629a60a3",
    "photo-1539109136881-3be0616acf4b",
    "photo-1593030761757-71fae45fa0e7"
  ],
  "Footwear": [
    "photo-1542291026-7eec264c27ff",
    "photo-1560343090-f0409e92791a",
    "photo-1543163521-1bf539c55dd2",
    "photo-1608256246200-53e635b5b65f",
    "photo-1549298916-b41d501d3772",
    "photo-1525966222134-fcfa99b8ae77",
    "photo-1595950653106-6c9ebd614d3a",
    "photo-1543508282-6319a3e2621f",
    "photo-1614252369475-531eba835eb1",
    "photo-1560769629-975ec94e6a86",
    "photo-1603808033192-082d6919d3e1"
  ],
  "Home & Kitchen": [
    "photo-1495474472287-4d71bcdd2085",
    "photo-1590794056226-79ef3a8147e1",
    "photo-1570222094114-d054a817e56b",
    "photo-1585515320310-259814833e62",
    "photo-1556911220-bff31c812dba",
    "photo-1554118811-1e0d58224f24",
    "photo-1514228742587-6b1558fcca3d",
    "photo-1571939228382-b2f2b585ce15",
    "photo-1544787219-7f47ccb76574",
    "photo-1556909212-d5b604d0c90d"
  ],
  "Appliances": [
    "photo-1571175443880-49e1d25b2bc5",
    "photo-1626806787461-102c1bfaaea1",
    "photo-1574269909862-7e1d70bb8078",
    "photo-1585155770447-2f66e2a397b5",
    "photo-1558317374-067fb5f30001",
    "photo-1576089172869-4f5f6f315620",
    "photo-1556910103-1c02745aae4d",
    "photo-1585515320310-259814833e62",
    "photo-1585155770447-2f66e2a397b5"
  ],
  "Beauty & Grooming": [
    "photo-1541643600914-78b084683601",
    "photo-1596462502278-27bfdc403348",
    "photo-1522338242992-e1a54906a8da",
    "photo-1621605815971-fbc98d665033",
    "photo-1522335789203-aabd1fc54bc9",
    "photo-1598440947619-2c35fc9aa908",
    "photo-1583511655857-d19b40a7a54e",
    "photo-1571781926291-c477ebfd024b",
    "photo-1526947425960-945c6e72858f",
    "photo-1608248543803-ba4f8c70ae0b"
  ],
  "Sports & Fitness": [
    "photo-1601925260368-ae2f83cf8b7f",
    "photo-1584735175315-9d5df23860e6",
    "photo-1591115765373-5207764f72e7",
    "photo-1571068316344-75bc76f77890",
    "photo-1585776245991-cf89dd7fc73a",
    "photo-1517836357463-d25dfeac3438",
    "photo-1544367567-0f2fcb009e0b",
    "photo-1517963879433-6ad2b056d712",
    "photo-1593079831268-3381b0db4a77",
    "photo-1549719386-74dfcbf7dbed"
  ],
  "Toys & Books": [
    "photo-1515488042361-ee00e0ddd4e4",
    "photo-1594787318286-3d835c1d207f",
    "photo-1611996575749-79a3a250f948",
    "photo-1512820790803-83ca734da794",
    "photo-1610890716171-6b1bb98ffd09",
    "photo-1596461404969-9ae70f2830c1",
    "photo-1587654780291-39c9404d746b",
    "photo-1544947950-fa07a98d237f",
    "photo-1544716278-ca5e3f4abd8c"
  ]
};

const catalog = [
  // Mobiles
  { name: "Redmi 13 5G (128GB)", price: 10999, mrp: 14999, image: "photo-1511707171634-5f897ff02aa9", description: "6.79\" display, 50MP AI dual camera, 5000mAh battery with 33W fast charging.", category: "Mobiles", popularity: 93, dateAdded: "2026-02-14" },
  { name: "Samsung Galaxy S25 (256GB)", price: 64999, mrp: 72999, image: "photo-1598327105666-5b89351aff97", description: "Flagship Snapdragon 8 Elite chip, 50MP triple camera, 120Hz AMOLED display.", category: "Mobiles", popularity: 95, dateAdded: "2026-03-05" },
  { name: "OnePlus Nord 5 (256GB)", price: 27999, mrp: 32999, image: "photo-1580910051074-3eb694886505", description: "Sony IMX890 camera, 5500mAh battery, 100W SUPERVOOC charging.", category: "Mobiles", popularity: 89, dateAdded: "2026-05-22" },
  { name: "iPhone 15 (128GB)", price: 69900, mrp: 79900, image: "photo-1601784551446-20c9e07cdbdb", description: "A16 Bionic chip, 48MP main camera, Dynamic Island, USB-C.", category: "Mobiles", popularity: 96, dateAdded: "2025-09-20" },
  { name: "Realme P1 5G (128GB)", price: 14999, mrp: 18999, image: "photo-1592750475338-74b7b21085ab", description: "120Hz AMOLED, 5000mAh battery, Dimensity 7300 processor.", category: "Mobiles", popularity: 78, dateAdded: "2026-06-18" },
  { name: "vivo V50 5G (128GB)", price: 26999, mrp: 31999, image: "photo-1598965402089-897ce52e8355", description: "50MP Zeiss camera, 120Hz curved AMOLED, 5500mAh battery with 90W charging.", category: "Mobiles", popularity: 74, dateAdded: "2026-07-25" },
  { name: "Motorola Edge 50 (128GB)", price: 23999, mrp: 28999, image: "photo-1605236453806-6ff36851218e", description: "50MP triple camera, pOLED 144Hz display, IP68 rating.", category: "Mobiles", popularity: 70, dateAdded: "2026-07-02" },
  { name: "Google Pixel 9 (128GB)", price: 62999, mrp: 69999, image: "photo-1610945265064-0e34e5519bbf", description: "Tensor G4 chip, 50MP camera with AI editing, 7 years of updates.", category: "Mobiles", popularity: 87, dateAdded: "2026-06-28" },
  { name: "Nothing Phone (3)", price: 34999, mrp: 39999, image: "photo-1510557880182-3d4d3cba35a5", description: "Glyph interface, 50MP dual camera, Snapdragon 8s Gen 3.", category: "Mobiles", popularity: 81, dateAdded: "2026-06-20" },
  { name: "iPhone 15 Plus (128GB)", price: 79900, mrp: 89900, image: "photo-1607936854279-55e8a4c64888", description: "6.7\" Super Retina XDR, A16 Bionic, 48MP camera, USB-C.", category: "Mobiles", popularity: 90, dateAdded: "2026-06-10" },
  { name: "Infinix Note 40 (128GB)", price: 11999, mrp: 15999, image: "photo-1592750475338-74b7b21085ab", description: "6.78\" AMOLED, 108MP camera, 5000mAh battery with 70W fast charging.", category: "Mobiles", popularity: 64, dateAdded: "2026-05-30" },
  { name: "Samsung Galaxy A55 (128GB)", price: 27999, mrp: 32999, image: "photo-1598327105666-5b89351aff97", description: "Exynos 1480 chip, 50MP OIS camera, Super AMOLED 120Hz.", category: "Mobiles", popularity: 76, dateAdded: "2026-05-18" },

  // Electronics
  { name: "Wireless Headphones", price: 2999, mrp: 4999, image: "photo-1505740420928-5e560c06d30e", description: "Premium noise-cancelling wireless headphones with 30-hour battery life.", category: "Electronics", popularity: 92, dateAdded: "2026-01-15" },
  { name: "Smart Watch Pro", price: 4999, mrp: 7999, image: "photo-1523275335684-37898b6baf30", description: "Fitness tracking, heart-rate monitor, notifications, and 7-day battery life.", category: "Electronics", popularity: 88, dateAdded: "2026-04-02" },
  { name: "Mechanical Keyboard", price: 3499, mrp: 5499, image: "photo-1587829741301-dc798b83add3", description: "RGB mechanical keyboard with hot-swappable switches and aluminium body.", category: "Electronics", popularity: 85, dateAdded: "2026-06-30" },
  { name: "Bluetooth Speaker", price: 1999, mrp: 3499, image: "photo-1589003077984-894e133dabab", description: "360° sound, deep bass, 12-hour playtime, IPX7 waterproof.", category: "Electronics", popularity: 76, dateAdded: "2026-07-08" },
  { name: "Power Bank 20000mAh", price: 1499, mrp: 2499, image: "photo-1611510338559-2f463335092c", description: "20000mAh with 22.5W fast charging, dual output, LED display.", category: "Electronics", popularity: 72, dateAdded: "2025-11-25" },
  { name: "Wireless Earbuds Pro", price: 1999, mrp: 3499, image: "photo-1590658268037-6bf12165a8df", description: "ANC earbuds with wireless charging case and 36-hour total playtime.", category: "Electronics", popularity: 85, dateAdded: "2026-07-22" },
  { name: "Gaming Mouse RGB", price: 1299, mrp: 2299, image: "photo-1527864550417-7fd91fc51a46", description: "16000 DPI optical sensor, 9 programmable buttons, RGB lighting.", category: "Electronics", popularity: 74, dateAdded: "2026-07-15" },
  { name: "USB-C Fast Charger", price: 999, mrp: 1799, image: "photo-1587829741301-dc798b83add3", description: "65W GaN wall charger with dual USB-C and USB-A ports.", category: "Electronics", popularity: 68, dateAdded: "2026-07-01" },
  { name: "Bluetooth Earbuds", price: 1499, mrp: 2999, image: "photo-1572569511254-d8f925fe2cbb", description: "True wireless earbuds with touch controls and deep bass.", category: "Electronics", popularity: 79, dateAdded: "2026-06-25" },
  { name: "Laptop Stand Aluminum", price: 1299, mrp: 1999, image: "photo-1498050108023-c5249f4df085", description: "Ergonomic aluminium stand with 7 height levels and heat dissipation.", category: "Electronics", popularity: 61, dateAdded: "2026-06-12" },
  { name: "Smart Speaker Mini", price: 1799, mrp: 2999, image: "photo-1589003077984-894e133dabab", description: "Voice-controlled smart speaker with 5W driver and 12-hour battery.", category: "Electronics", popularity: 72, dateAdded: "2026-06-05" },
  { name: "Fitness Band", price: 1799, mrp: 2999, image: "photo-1546868871-7041f2a55e12", description: "AMOLED display, SpO2 tracking, 14-day battery, 5ATM water resistant.", category: "Electronics", popularity: 77, dateAdded: "2026-05-27" },

  // Fashion
  { name: "Men's Cotton T-Shirt", price: 499, mrp: 999, image: "photo-1523398002811-999ca8dec234", description: "100% combed cotton, regular fit, breathable crew-neck tee.", category: "Fashion", popularity: 82, dateAdded: "2026-03-18" },
  { name: "Women's Embroidered Kurta", price: 1299, mrp: 2499, image: "photo-1594633312681-425c7b97ccd1", description: "Elegant cotton kurta with hand embroidery, straight fit.", category: "Fashion", popularity: 80, dateAdded: "2026-05-10" },
  { name: "Slim-Fit Denim Jeans", price: 1499, mrp: 2999, image: "photo-1542272604-787c3835535d", description: "Premium stretch denim with a classic slim fit, all-day comfort.", category: "Fashion", popularity: 84, dateAdded: "2026-02-08" },
  { name: "Formal Shirt", price: 899, mrp: 1799, image: "photo-1596755094514-f87e34085b2c", description: "Wrinkle-free formal shirt in classic white, ideal for office wear.", category: "Fashion", popularity: 71, dateAdded: "2025-12-30" },
  { name: "Summer Floral Dress", price: 1799, mrp: 3499, image: "photo-1572804013309-59a88b7e92f1", description: "Lightweight flowy dress with floral print and adjustable straps.", category: "Fashion", popularity: 79, dateAdded: "2026-04-25" },
  { name: "Men's Polo T-Shirt", price: 699, mrp: 1399, image: "photo-1521572163474-6864f9cf17ab", description: "Soft pique polo with ribbed collar and moisture-wicking fabric.", category: "Fashion", popularity: 78, dateAdded: "2026-07-18" },
  { name: "Women's Cotton Kurti", price: 899, mrp: 1799, image: "photo-1539109136881-3be0616acf4b", description: "Printed cotton kurti with three-quarter sleeves and side slits.", category: "Fashion", popularity: 77, dateAdded: "2026-07-10" },
  { name: "Bomber Jacket", price: 2499, mrp: 4499, image: "photo-1525507119028-ed4c629a60a3", description: "Water-resistant bomber jacket with quilted lining and zip pockets.", category: "Fashion", popularity: 73, dateAdded: "2026-06-27" },
  { name: "Linen Casual Shirt", price: 1099, mrp: 1999, image: "photo-1584370848010-d7fe6bc767ec", description: "Breathable pure linen shirt, perfect for warm weather.", category: "Fashion", popularity: 69, dateAdded: "2026-06-19" },
  { name: "Women's Palazzo Pants", price: 1199, mrp: 2199, image: "photo-1594633312681-425c7b97ccd1", description: "Flowy palazzo pants with elastic waist and comfortable drape.", category: "Fashion", popularity: 68, dateAdded: "2026-06-08" },
  { name: "Men's Formal Suit", price: 8999, mrp: 12999, image: "photo-1593030761757-71fae45fa0e7", description: "Two-piece tailored suit in premium blended fabric, regular fit.", category: "Fashion", popularity: 72, dateAdded: "2026-05-28" },
  { name: "Cotton Hoodie", price: 1299, mrp: 2499, image: "photo-1584370848010-d7fe6bc767ec", description: "Cozy pullover hoodie with kangaroo pocket and drawstring hood.", category: "Fashion", popularity: 71, dateAdded: "2026-05-15" },

  // Footwear
  { name: "Running Shoes", price: 2499, mrp: 3999, image: "photo-1542291026-7eec264c27ff", description: "Lightweight running shoes with responsive cushioning and breathable mesh.", category: "Footwear", popularity: 75, dateAdded: "2026-03-10" },
  { name: "Casual Sneakers", price: 1799, mrp: 2999, image: "photo-1560343090-f0409e92791a", description: "Classic white sneakers with cushioned sole, go with everything.", category: "Footwear", popularity: 86, dateAdded: "2026-06-12" },
  { name: "Leather Formal Shoes", price: 2999, mrp: 4999, image: "photo-1543163521-1bf539c55dd2", description: "Genuine leather formal shoes with cushioned insole, office ready.", category: "Footwear", popularity: 69, dateAdded: "2025-10-14" },
  { name: "Ankle Boots", price: 2499, mrp: 3999, image: "photo-1608256246200-53e635b5b65f", description: "Durable leather ankle boots with non-slip sole, year-round style.", category: "Footwear", popularity: 67, dateAdded: "2026-01-28" },
  { name: "Flip Sandals", price: 399, mrp: 799, image: "photo-1549298916-b41d501d3772", description: "Comfortable everyday flip-flops with soft cushioned straps.", category: "Footwear", popularity: 61, dateAdded: "2026-07-01" },
  { name: "Basketball Sneakers", price: 2999, mrp: 4999, image: "photo-1543508282-6319a3e2621f", description: "High-top basketball shoes with ankle support and grip outsole.", category: "Footwear", popularity: 82, dateAdded: "2026-07-20" },
  { name: "Women's Heeled Sandals", price: 1499, mrp: 2799, image: "photo-1560769629-975ec94e6a86", description: "Elegant block-heel sandals with cushioned footbed.", category: "Footwear", popularity: 70, dateAdded: "2026-07-12" },
  { name: "Sports Slippers", price: 599, mrp: 1199, image: "photo-1603808033192-082d6919d3e1", description: "Lightweight sports slippers with anti-slip sole and arch support.", category: "Footwear", popularity: 62, dateAdded: "2026-07-04" },
  { name: "Hiking Boots", price: 3999, mrp: 5999, image: "photo-1614252369475-531eba835eb1", description: "Waterproof hiking boots with rugged traction and ankle support.", category: "Footwear", popularity: 71, dateAdded: "2026-06-22" },
  { name: "Canvas Shoes", price: 999, mrp: 1799, image: "photo-1525966222134-fcfa99b8ae77", description: "Trendy canvas sneakers with rubber toe cap and laces.", category: "Footwear", popularity: 76, dateAdded: "2026-06-14" },
  { name: "School Shoes", price: 899, mrp: 1599, image: "photo-1595950653106-6c9ebd614d3a", description: "Sturdy all-black school shoes with cushioned collar and grip sole.", category: "Footwear", popularity: 58, dateAdded: "2026-06-02" },
  { name: "Running Shoes Pro", price: 3999, mrp: 6499, image: "photo-1542291026-7eec264c27ff", description: "Carbon-plated road running shoes for race-day performance.", category: "Footwear", popularity: 80, dateAdded: "2026-05-20" },

  // Home & Kitchen
  { name: "Coffee Maker", price: 1999, mrp: 3499, image: "photo-1495474472287-4d71bcdd2085", description: "Programmable coffee maker with thermal carafe and auto brew timer.", category: "Home & Kitchen", popularity: 64, dateAdded: "2025-12-05" },
  { name: "Air Fryer 4L", price: 3999, mrp: 7999, image: "photo-1590794056226-79ef3a8147e1", description: "Oil-free frying with 8 preset modes, digital touch control.", category: "Home & Kitchen", popularity: 83, dateAdded: "2026-05-05" },
  { name: "Mixer Blender 750W", price: 2499, mrp: 3999, image: "photo-1570222094114-d054a817e56b", description: "4 stainless steel jars, 750W motor, 3-speed with pulse.", category: "Home & Kitchen", popularity: 70, dateAdded: "2026-02-19" },
  { name: "Dinner Set (24 pcs)", price: 1999, mrp: 3499, image: "photo-1585515320310-259814833e62", description: "Bone china dinner set for 6 people, dishwasher and microwave safe.", category: "Home & Kitchen", popularity: 58, dateAdded: "2025-11-10" },
  { name: "Non-stick Cookware Set", price: 2999, mrp: 4999, image: "photo-1556911220-bff31c812dba", description: "5-piece granite non-stick cookware with heat-resistant handles.", category: "Home & Kitchen", popularity: 66, dateAdded: "2026-03-27" },
  { name: "Electric Kettle 1.8L", price: 999, mrp: 1999, image: "photo-1514228742587-6b1558fcca3d", description: "Stainless steel kettle with auto shut-off and boil-dry protection.", category: "Home & Kitchen", popularity: 67, dateAdded: "2026-07-24" },
  { name: "Stainless Steel Cookware Set", price: 3499, mrp: 5999, image: "photo-1571939228382-b2f2b585ce15", description: "Tri-ply stainless cookware with stay-cool handles, 7 pieces.", category: "Home & Kitchen", popularity: 65, dateAdded: "2026-07-16" },
  { name: "Ceramic Dinner Set", price: 2499, mrp: 4299, image: "photo-1554118811-1e0d58224f24", description: "12-piece ceramic dinner set with elegant hand-glazed finish.", category: "Home & Kitchen", popularity: 63, dateAdded: "2026-07-06" },
  { name: "Non-stick Tawa Pan", price: 799, mrp: 1499, image: "photo-1556911220-bff31c812dba", description: "Heavy-gauge non-stick tawa for rotis, dosas and pancakes.", category: "Home & Kitchen", popularity: 66, dateAdded: "2026-06-24" },
  { name: "Tea Maker", price: 1499, mrp: 2699, image: "photo-1544787219-7f47ccb76574", description: "Glass tea maker with infuser and keep-warm function.", category: "Home & Kitchen", popularity: 61, dateAdded: "2026-06-16" },
  { name: "Chopping Board Set", price: 699, mrp: 1299, image: "photo-1556909212-d5b604d0c90d", description: "Set of 3 bamboo chopping boards with juice groove and grip.", category: "Home & Kitchen", popularity: 59, dateAdded: "2026-06-07" },
  { name: "Water Purifier", price: 7999, mrp: 11999, image: "photo-1570222094114-d054a817e56b", description: "6-stage RO+UV water purifier with 10L storage tank.", category: "Home & Kitchen", popularity: 64, dateAdded: "2026-05-25" },

  // Appliances
  { name: "Refrigerator 240L", price: 18999, mrp: 24999, image: "photo-1571175443880-49e1d25b2bc5", description: "Single-door 240L with inverter compressor, anti-bacterial coating.", category: "Appliances", popularity: 74, dateAdded: "2026-04-12" },
  { name: "Washing Machine 7kg", price: 15999, mrp: 21999, image: "photo-1626806787461-102c1bfaaea1", description: "Fully automatic front-load with 12 wash programs and inverter motor.", category: "Appliances", popularity: 73, dateAdded: "2026-06-05" },
  { name: "Microwave Oven 23L", price: 8999, mrp: 12999, image: "photo-1574269909862-7e1d70bb8078", description: "Convection microwave with grill, 8 auto-cook menus, LED display.", category: "Appliances", popularity: 68, dateAdded: "2026-01-20" },
  { name: "Induction Cooktop", price: 2499, mrp: 3999, image: "photo-1585155770447-2f66e2a397b5", description: "1900W induction cooktop with 9 power levels and auto shut-off.", category: "Appliances", popularity: 62, dateAdded: "2025-12-18" },
  { name: "Vacuum Cleaner", price: 4999, mrp: 7999, image: "photo-1558317374-067fb5f30001", description: "2-in-1 bagless vacuum with HEPA filter and 1600W suction.", category: "Appliances", popularity: 59, dateAdded: "2026-02-27" },
  { name: "Ceiling Fan", price: 2499, mrp: 3999, image: "photo-1585515320310-259814833e62", description: "1200mm BLDC ceiling fan with remote and energy-efficient motor.", category: "Appliances", popularity: 66, dateAdded: "2026-07-26" },
  { name: "Air Conditioner 1.5 Ton", price: 32999, mrp: 39999, image: "photo-1585155770447-2f66e2a397b5", description: "1.5 ton split AC with inverter compressor and 3-star rating.", category: "Appliances", popularity: 75, dateAdded: "2026-07-14" },
  { name: "Steam Iron", price: 1299, mrp: 2299, image: "photo-1576089172869-4f5f6f315620", description: "1200W dry and steam iron with non-stick soleplate.", category: "Appliances", popularity: 65, dateAdded: "2026-07-07" },
  { name: "Oven Toaster Grill", price: 1999, mrp: 3499, image: "photo-1556910103-1c02745aae4d", description: "60L oven toaster grill with temperature control and timer.", category: "Appliances", popularity: 67, dateAdded: "2026-06-28" },
  { name: "Rice Cooker 1.8L", price: 1799, mrp: 2999, image: "photo-1574269909862-7e1d70bb8078", description: "Multi-function rice cooker with steaming tray and keep-warm.", category: "Appliances", popularity: 63, dateAdded: "2026-06-18" },
  { name: "Water Heater 15L", price: 4999, mrp: 7499, image: "photo-1585155770447-2f66e2a397b5", description: "15L storage water heater with 5-star energy rating and rust-proof tank.", category: "Appliances", popularity: 60, dateAdded: "2026-06-10" },
  { name: "Room Heater 2000W", price: 2499, mrp: 3999, image: "photo-1558317374-067fb5f30001", description: "Oil-filled radiator heater with 3 heat settings and tip-over guard.", category: "Appliances", popularity: 59, dateAdded: "2026-05-30" },

  // Beauty & Grooming
  { name: "Luxury Perfume 100ml", price: 1499, mrp: 2999, image: "photo-1541643600914-78b084683601", description: "Long-lasting EDP with notes of amber, vanilla, and musk.", category: "Beauty & Grooming", popularity: 77, dateAdded: "2026-05-16" },
  { name: "Skincare Set", price: 1999, mrp: 3499, image: "photo-1596462502278-27bfdc403348", description: "Cleanser, toner, serum, and moisturizer for daily glow.", category: "Beauty & Grooming", popularity: 81, dateAdded: "2026-06-22" },
  { name: "Hair Dryer 2000W", price: 1299, mrp: 2499, image: "photo-1522338242992-e1a54906a8da", description: "Ionic dryer with 3 heat settings and cold shot for frizz-free styling.", category: "Beauty & Grooming", popularity: 65, dateAdded: "2026-01-09" },
  { name: "Beard Trimmer", price: 899, mrp: 1699, image: "photo-1621605815971-fbc98d665033", description: "20 length settings, self-sharpening blades, cordless 90-min use.", category: "Beauty & Grooming", popularity: 63, dateAdded: "2025-10-30" },
  { name: "Makeup Kit", price: 2499, mrp: 4499, image: "photo-1522335789203-aabd1fc54bc9", description: "18-piece professional makeup kit with eyeshadow, blush, and lip colors.", category: "Beauty & Grooming", popularity: 71, dateAdded: "2026-03-08" },
  { name: "Vitamin C Serum", price: 599, mrp: 1199, image: "photo-1608248543803-ba4f8c70ae0b", description: "Brightening 10% vitamin C serum with hyaluronic acid.", category: "Beauty & Grooming", popularity: 74, dateAdded: "2026-07-23" },
  { name: "Matte Lipstick Set", price: 999, mrp: 1799, image: "photo-1583511655857-d19b40a7a54e", description: "Set of 6 long-wear matte lipsticks in trending shades.", category: "Beauty & Grooming", popularity: 72, dateAdded: "2026-07-17" },
  { name: "Makeup Brush Set", price: 799, mrp: 1599, image: "photo-1526947425960-945c6e72858f", description: "12-piece vegan makeup brush set with a storage roll.", category: "Beauty & Grooming", popularity: 68, dateAdded: "2026-07-09" },
  { name: "Face Wash Gel", price: 399, mrp: 799, image: "photo-1598440947619-2c35fc9aa908", description: "Gentle daily face wash with neem and tea tree extracts.", category: "Beauty & Grooming", popularity: 66, dateAdded: "2026-06-30" },
  { name: "Hair Straightener", price: 1499, mrp: 2799, image: "photo-1522338242992-e1a54906a8da", description: "Ceramic hair straightener with floating plates and 30-min heat-up.", category: "Beauty & Grooming", popularity: 67, dateAdded: "2026-06-21" },
  { name: "Men's Grooming Kit", price: 1299, mrp: 2499, image: "photo-1621605815971-fbc98d665033", description: "12-piece grooming kit with trimmer, scissors, and nail care tools.", category: "Beauty & Grooming", popularity: 70, dateAdded: "2026-06-11" },
  { name: "Under Eye Cream", price: 899, mrp: 1599, image: "photo-1571781926291-c477ebfd024b", description: "Caffeine eye cream to de-puff and brighten tired eyes.", category: "Beauty & Grooming", popularity: 62, dateAdded: "2026-06-01" },

  // Sports & Fitness
  { name: "Yoga Mat", price: 699, mrp: 1299, image: "photo-1601925260368-ae2f83cf8b7f", description: "Non-slip eco-friendly yoga mat with carrying strap.", category: "Sports & Fitness", popularity: 58, dateAdded: "2026-07-12" },
  { name: "Dumbbell Set 20kg", price: 2999, mrp: 4999, image: "photo-1584735175315-9d5df23860e6", description: "Adjustable chrome dumbbell pair with secure locking collars.", category: "Sports & Fitness", popularity: 69, dateAdded: "2026-04-30" },
  { name: "Cricket Bat", price: 1999, mrp: 3499, image: "photo-1591115765373-5207764f72e7", description: "English willow cricket bat, pre-knocked, full size.", category: "Sports & Fitness", popularity: 60, dateAdded: "2026-02-02" },
  { name: "Cycling Helmet", price: 1299, mrp: 2299, image: "photo-1571068316344-75bc76f77890", description: "Lightweight ventilated helmet with adjustable fit and reflective strap.", category: "Sports & Fitness", popularity: 57, dateAdded: "2026-05-28" },
  { name: "Resistance Bands Set", price: 599, mrp: 1199, image: "photo-1585776245991-cf89dd7fc73a", description: "5-level resistance loop bands with carry pouch, ideal for home workouts.", category: "Sports & Fitness", popularity: 56, dateAdded: "2026-07-20" },
  { name: "Treadmill", price: 29999, mrp: 39999, image: "photo-1517836357463-d25dfeac3438", description: "Motorized treadmill with 12 incline levels and 400mAh folding frame.", category: "Sports & Fitness", popularity: 70, dateAdded: "2026-07-27" },
  { name: "Exercise Bike", price: 18999, mrp: 24999, image: "photo-1544367567-0f2fcb009e0b", description: "Foldable exercise bike with 8 resistance levels and LCD display.", category: "Sports & Fitness", popularity: 64, dateAdded: "2026-07-19" },
  { name: "Football Size 5", price: 1299, mrp: 1999, image: "photo-1517963879433-6ad2b056d712", description: "Match-grade size 5 football with weatherproof PU surface.", category: "Sports & Fitness", popularity: 72, dateAdded: "2026-07-11" },
  { name: "Badminton Racket", price: 999, mrp: 1799, image: "photo-1593079831268-3381b0db4a77", description: "Lightweight graphite badminton racket with full cover.", category: "Sports & Fitness", popularity: 68, dateAdded: "2026-07-03" },
  { name: "Kettlebell 12kg", price: 2499, mrp: 3999, image: "photo-1584735175315-9d5df23860e6", description: "Cast iron kettlebell with smooth flat base and ergonomic handle.", category: "Sports & Fitness", popularity: 61, dateAdded: "2026-06-23" },
  { name: "Yoga Mat Pro", price: 999, mrp: 1799, image: "photo-1601925260368-ae2f83cf8b7f", description: "Extra-thick TPE yoga mat with alignment lines and carry bag.", category: "Sports & Fitness", popularity: 63, dateAdded: "2026-06-15" },
  { name: "Boxing Gloves", price: 1999, mrp: 3499, image: "photo-1549719386-74dfcbf7dbed", description: "PU leather boxing gloves with dense foam padding and wrist support.", category: "Sports & Fitness", popularity: 66, dateAdded: "2026-06-04" },

  // Toys & Books
  { name: "Building Blocks Set", price: 1499, mrp: 2999, image: "photo-1515488042361-ee00e0ddd4e4", description: "500-piece STEM building blocks for creative construction play.", category: "Toys & Books", popularity: 72, dateAdded: "2026-04-08" },
  { name: "Remote Control Car", price: 1999, mrp: 3499, image: "photo-1594787318286-3d835c1d207f", description: "4WD off-road RC car with 30-minute runtime and 2.4GHz remote.", category: "Toys & Books", popularity: 68, dateAdded: "2026-06-15" },
  { name: "Jigsaw Puzzle 1000 pcs", price: 799, mrp: 1499, image: "photo-1611996575749-79a3a250f948", description: "High-quality 1000-piece landscape puzzle, ages 12+.", category: "Toys & Books", popularity: 54, dateAdded: "2025-12-22" },
  { name: "Bestseller Book Set", price: 1299, mrp: 2499, image: "photo-1512820790803-83ca734da794", description: "Box set of 5 acclaimed novels in paperback.", category: "Toys & Books", popularity: 62, dateAdded: "2026-03-14" },
  { name: "Strategy Board Game", price: 999, mrp: 1999, image: "photo-1610890716171-6b1bb98ffd09", description: "Family strategy board game for 2-6 players, 60-min sessions.", category: "Toys & Books", popularity: 59, dateAdded: "2026-01-30" },
  { name: "Teddy Bear 24\"", price: 1499, mrp: 2499, image: "photo-1596461404969-9ae70f2830c1", description: "Super soft 24-inch teddy bear with huggable plush filling.", category: "Toys & Books", popularity: 67, dateAdded: "2026-07-28" },
  { name: "Wooden Train Set", price: 1999, mrp: 3499, image: "photo-1587654780291-39c9404d746b", description: "40-piece wooden train set with tracks, bridges, and figures.", category: "Toys & Books", popularity: 65, dateAdded: "2026-07-21" },
  { name: "Science Kit for Kids", price: 1299, mrp: 2299, image: "photo-1515488042361-ee00e0ddd4e4", description: "30+ experiments STEM kit with lab tools and illustrated guide.", category: "Toys & Books", popularity: 70, dateAdded: "2026-07-13" },
  { name: "Children's Story Books", price: 999, mrp: 1799, image: "photo-1544947950-fa07a98d237f", description: "Collection of 10 illustrated bedtime story books.", category: "Toys & Books", popularity: 71, dateAdded: "2026-07-05" },
  { name: "Chess Set Wooden", price: 1499, mrp: 2499, image: "photo-1610890716171-6b1bb98ffd09", description: "Handcrafted wooden chess set with folding board and storage.", category: "Toys & Books", popularity: 63, dateAdded: "2026-06-26" },
  { name: "Coloring Book Pack", price: 599, mrp: 999, image: "photo-1544716278-ca5e3f4abd8c", description: "Pack of 6 adult coloring books with 480 detailed pages.", category: "Toys & Books", popularity: 57, dateAdded: "2026-06-17" },
  { name: "Action Figure Set", price: 1299, mrp: 2299, image: "photo-1596461404969-9ae70f2830c1", description: "Set of 6 collectible action figures with accessories.", category: "Toys & Books", popularity: 66, dateAdded: "2026-06-06" }
];

export const products = catalog.map((product, index) => {
  const pool = CATEGORY_IMAGES[product.category] || [];
  const extras = pool.filter(imageId => imageId !== product.image);
  const images = [product.image];
  let cursor = index;
  while (images.length < 3 && extras.length > 0) {
    images.push(extras[cursor % extras.length]);
    cursor += 1;
  }
  return {
    id: index + 1,
    ...product,
    stock: (index * 7) % 60,
    image: u(product.image),
    images: images.map(u)
  };
});
