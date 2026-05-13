import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding ORBY JEWELS database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("OrbyAdmin@2024", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@orbyjewels.com" },
    update: {},
    create: {
      name: "Orby Admin",
      email: "admin@orbyjewels.com",
      password: hashedPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Demo customer
  const customerPassword = await bcrypt.hash("Customer@123", 12);
  await prisma.user.upsert({
    where: { email: "demo@customer.com" },
    update: {},
    create: {
      name: "Priya Sharma",
      email: "demo@customer.com",
      password: customerPassword,
      role: Role.CUSTOMER,
      emailVerified: new Date(),
      phone: "+91 98765 43210",
    },
  });

  // Categories
  const categories = [
    { name: "Rings", slug: "rings", description: "Exquisite rings for every occasion", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600" },
    { name: "Necklaces", slug: "necklaces", description: "Elegant necklaces and pendants", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600" },
    { name: "Earrings", slug: "earrings", description: "Stunning earrings collection", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600" },
    { name: "Bracelets", slug: "bracelets", description: "Beautiful bracelets and bangles", image: "https://images.unsplash.com/photo-1573408301185-9519f94a81d2?w=600" },
    { name: "Bangles", slug: "bangles", description: "Traditional and modern bangles", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600" },
    { name: "Pendants", slug: "pendants", description: "Delicate and bold pendants", image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600" },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log("✅ Categories created");

  // Subcategories
  const subcategories = [
    { name: "Solitaire Rings", slug: "solitaire-rings", categoryId: createdCategories["rings"] },
    { name: "Engagement Rings", slug: "engagement-rings", categoryId: createdCategories["rings"] },
    { name: "Wedding Bands", slug: "wedding-bands", categoryId: createdCategories["rings"] },
    { name: "Statement Rings", slug: "statement-rings", categoryId: createdCategories["rings"] },
    { name: "Diamond Necklaces", slug: "diamond-necklaces", categoryId: createdCategories["necklaces"] },
    { name: "Gold Chains", slug: "gold-chains", categoryId: createdCategories["necklaces"] },
    { name: "Pearl Necklaces", slug: "pearl-necklaces", categoryId: createdCategories["necklaces"] },
    { name: "Stud Earrings", slug: "stud-earrings", categoryId: createdCategories["earrings"] },
    { name: "Drop Earrings", slug: "drop-earrings", categoryId: createdCategories["earrings"] },
    { name: "Hoop Earrings", slug: "hoop-earrings", categoryId: createdCategories["earrings"] },
    { name: "Tennis Bracelets", slug: "tennis-bracelets", categoryId: createdCategories["bracelets"] },
    { name: "Charm Bracelets", slug: "charm-bracelets", categoryId: createdCategories["bracelets"] },
  ];

  const createdSubcategories: Record<string, string> = {};
  for (const sub of subcategories) {
    const created = await prisma.subcategory.upsert({
      where: { slug_categoryId: { slug: sub.slug, categoryId: sub.categoryId } },
      update: {},
      create: sub,
    });
    createdSubcategories[sub.slug] = created.id;
  }
  console.log("✅ Subcategories created");

  // Products
  const products = [
    {
      name: "Eternal Rose Diamond Ring",
      slug: "eternal-rose-diamond-ring",
      sku: "OJ-RNG-001",
      description: "A timeless solitaire diamond ring crafted in 18K rose gold. The brilliant-cut diamond is set in a six-prong setting, allowing maximum light to enter and reflect, creating breathtaking sparkle.",
      shortDesc: "Brilliant-cut diamond in 18K rose gold",
      price: 85000,
      comparePrice: 95000,
      stock: 15,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      categoryId: createdCategories["rings"],
      subcategoryId: createdSubcategories["solitaire-rings"],
      material: "18K Rose Gold",
      purity: "18K (75%)",
      stoneType: "Diamond",
      stoneWeight: 0.5,
      metalWeight: 3.2,
      gender: "Women",
      occasion: "Engagement, Wedding",
      images: [
        { url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800", isPrimary: false },
        { url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800", isPrimary: false },
      ],
    },
    {
      name: "Royal Pearl Necklace",
      slug: "royal-pearl-necklace",
      sku: "OJ-NCK-001",
      description: "An exquisite strand of hand-picked Akoya pearls with an 18K gold diamond-studded clasp. Each pearl is selected for its exceptional luster and perfectly round shape.",
      shortDesc: "Akoya pearls with diamond gold clasp",
      price: 125000,
      comparePrice: 145000,
      stock: 8,
      isFeatured: true,
      isBestSeller: true,
      categoryId: createdCategories["necklaces"],
      subcategoryId: createdSubcategories["pearl-necklaces"],
      material: "18K White Gold",
      purity: "18K (75%)",
      stoneType: "Akoya Pearl, Diamond",
      gender: "Women",
      occasion: "Wedding, Formal",
      images: [
        { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800", isPrimary: false },
      ],
    },
    {
      name: "Celestial Diamond Earrings",
      slug: "celestial-diamond-earrings",
      sku: "OJ-EAR-001",
      description: "Dazzling drop earrings featuring cascading diamonds set in 18K white gold. These statement earrings catch the light beautifully and are perfect for special occasions.",
      shortDesc: "Cascading diamond drops in white gold",
      price: 68000,
      comparePrice: 78000,
      stock: 20,
      isFeatured: true,
      isNewArrival: true,
      isTrending: true,
      categoryId: createdCategories["earrings"],
      subcategoryId: createdSubcategories["drop-earrings"],
      material: "18K White Gold",
      purity: "18K (75%)",
      stoneType: "Diamond",
      stoneWeight: 0.8,
      gender: "Women",
      occasion: "Party, Wedding",
      images: [
        { url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800", isPrimary: false },
      ],
    },
    {
      name: "Golden Heritage Bangle Set",
      slug: "golden-heritage-bangle-set",
      sku: "OJ-BNG-001",
      description: "A set of three handcrafted 22K gold bangles featuring intricate traditional motifs inspired by Mughal architecture. Each bangle is engraved by master craftsmen.",
      shortDesc: "Set of 3 handcrafted 22K gold bangles",
      price: 195000,
      comparePrice: 215000,
      stock: 5,
      isFeatured: true,
      isBestSeller: true,
      categoryId: createdCategories["bangles"],
      material: "22K Yellow Gold",
      purity: "22K (91.6%)",
      metalWeight: 28.5,
      gender: "Women",
      occasion: "Wedding, Festival",
      images: [
        { url: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1573408301185-9519f94a81d2?w=800", isPrimary: false },
      ],
    },
    {
      name: "Sapphire Tennis Bracelet",
      slug: "sapphire-tennis-bracelet",
      sku: "OJ-BRC-001",
      description: "An elegant tennis bracelet featuring alternating blue sapphires and diamonds set in 18K white gold. The perfect accessory for both formal and casual occasions.",
      shortDesc: "Sapphire and diamond in 18K white gold",
      price: 110000,
      comparePrice: 130000,
      stock: 12,
      isNewArrival: true,
      isTrending: true,
      categoryId: createdCategories["bracelets"],
      subcategoryId: createdSubcategories["tennis-bracelets"],
      material: "18K White Gold",
      purity: "18K (75%)",
      stoneType: "Blue Sapphire, Diamond",
      stoneWeight: 3.5,
      gender: "Women",
      occasion: "Party, Wedding",
      images: [
        { url: "https://images.unsplash.com/photo-1573408301185-9519f94a81d2?w=800", isPrimary: true },
      ],
    },
    {
      name: "Lotus Diamond Pendant",
      slug: "lotus-diamond-pendant",
      sku: "OJ-PND-001",
      description: "A delicate lotus-shaped pendant crafted in 18K rose gold, adorned with sparkling pavé diamonds. Comes with an 18-inch rose gold chain.",
      shortDesc: "Lotus pavé diamond in 18K rose gold",
      price: 45000,
      comparePrice: 52000,
      stock: 25,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isTrending: true,
      categoryId: createdCategories["pendants"],
      material: "18K Rose Gold",
      purity: "18K (75%)",
      stoneType: "Diamond",
      stoneWeight: 0.25,
      gender: "Women",
      occasion: "Casual, Gifting",
      images: [
        { url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800", isPrimary: false },
      ],
    },
    {
      name: "Vintage Emerald Ring",
      slug: "vintage-emerald-ring",
      sku: "OJ-RNG-002",
      description: "A stunning vintage-inspired ring featuring a 2-carat Colombian emerald surrounded by a halo of round diamonds. Set in 18K yellow gold with milgrain detailing.",
      shortDesc: "Colombian emerald halo in 18K yellow gold",
      price: 175000,
      comparePrice: 195000,
      stock: 3,
      isFeatured: true,
      isTrending: true,
      categoryId: createdCategories["rings"],
      subcategoryId: createdSubcategories["statement-rings"],
      material: "18K Yellow Gold",
      purity: "18K (75%)",
      stoneType: "Colombian Emerald, Diamond",
      stoneWeight: 2.0,
      metalWeight: 5.8,
      gender: "Women",
      occasion: "Statement, Party",
      images: [
        { url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800", isPrimary: false },
      ],
    },
    {
      name: "Diamond Solitaire Studs",
      slug: "diamond-solitaire-studs",
      sku: "OJ-EAR-002",
      description: "Classic diamond solitaire stud earrings set in 18K white gold with secure screw-back clasps. Each diamond is GIA certified for quality assurance.",
      shortDesc: "GIA certified diamonds in 18K white gold",
      price: 55000,
      comparePrice: 65000,
      stock: 30,
      isBestSeller: true,
      categoryId: createdCategories["earrings"],
      subcategoryId: createdSubcategories["stud-earrings"],
      material: "18K White Gold",
      purity: "18K (75%)",
      stoneType: "Diamond (GIA Certified)",
      stoneWeight: 0.6,
      gender: "Women",
      occasion: "Daily, Formal",
      images: [
        { url: "https://images.unsplash.com/photo-1583795128727-6ec3642408f8?w=800", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800", isPrimary: false },
      ],
    },
  ];

  for (const product of products) {
    const { images, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        images: {
          create: images.map((img, idx) => ({
            ...img,
            sortOrder: idx,
          })),
        },
      },
    });
  }
  console.log("✅ Products created");

  // Testimonials
  const testimonials = [
    {
      name: "Ananya Krishnan",
      location: "Chennai, Tamil Nadu",
      rating: 5,
      comment: "I purchased the Eternal Rose Diamond Ring for my engagement and it was absolutely breathtaking. The quality is exceptional and the packaging was so luxurious. My partner was speechless!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    },
    {
      name: "Meera Patel",
      location: "Mumbai, Maharashtra",
      rating: 5,
      comment: "The Royal Pearl Necklace exceeded all my expectations. The pearls have an incredible luster and the gold clasp is so delicate and beautiful. Orby Jewels truly delivers luxury.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
    {
      name: "Priya Nair",
      location: "Bangalore, Karnataka",
      rating: 5,
      comment: "I gifted my mother the Heritage Bangle Set on her anniversary and she cried tears of joy. The craftsmanship is extraordinary. Every detail is perfect. Worth every rupee!",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150",
    },
    {
      name: "Shreya Gupta",
      location: "Delhi, NCR",
      rating: 5,
      comment: "The Celestial Diamond Earrings are simply divine. I wore them to a wedding and received so many compliments. The quality and design are unmatched. Orby Jewels is my go-to for fine jewellery.",
      avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150",
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log("✅ Testimonials created");

  // Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "Timeless Elegance",
        subtitle: "New Collection 2024",
        description: "Discover our exquisite collection of handcrafted jewellery, designed for the modern woman who appreciates timeless beauty.",
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1920",
        link: "/collections/new-arrivals",
        buttonText: "Explore Collection",
        position: "hero",
        sortOrder: 1,
      },
      {
        title: "Bridal Collection",
        subtitle: "Your Special Moment",
        description: "Make your wedding unforgettable with our curated bridal jewellery collection.",
        image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1920",
        link: "/collections/bridal",
        buttonText: "Shop Bridal",
        position: "hero",
        sortOrder: 2,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Banners created");

  // Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "ORBY10",
        description: "10% off on all orders",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 5000,
        maxDiscount: 10000,
        isActive: true,
      },
      {
        code: "WELCOME500",
        description: "₹500 off on first order",
        discountType: "FIXED",
        discountValue: 500,
        minOrderValue: 2000,
        isActive: true,
      },
      {
        code: "LUXURY20",
        description: "20% off on orders above ₹50,000",
        discountType: "PERCENTAGE",
        discountValue: 20,
        minOrderValue: 50000,
        maxDiscount: 25000,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Coupons created");

  // Site Settings
  const settings = [
    { key: "site_name", value: "Orby Jewels", type: "text" },
    { key: "site_tagline", value: "Where Elegance Meets Artistry", type: "text" },
    { key: "brand_under", value: "Under Nera Groups", type: "text" },
    { key: "contact_email", value: "hello@orbyjewels.com", type: "email" },
    { key: "contact_phone", value: "+91 98765 43210", type: "text" },
    { key: "whatsapp", value: "+91 98765 43210", type: "text" },
    { key: "address", value: "123, Luxury Lane, Bandra West, Mumbai - 400050", type: "text" },
    { key: "instagram", value: "https://instagram.com/orbyjewels", type: "url" },
    { key: "facebook", value: "https://facebook.com/orbyjewels", type: "url" },
    { key: "shipping_charge", value: "99", type: "number" },
    { key: "free_shipping_above", value: "5000", type: "number" },
    { key: "tax_rate", value: "3", type: "number" },
  ];

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("✅ Site settings created");

  // Reviews
  const allProducts = await prisma.product.findMany();
  const customer = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });

  if (customer && allProducts.length > 0) {
    for (const product of allProducts.slice(0, 4)) {
      await prisma.review.upsert({
        where: { productId_userId: { productId: product.id, userId: customer.id } },
        update: {},
        create: {
          productId: product.id,
          userId: customer.id,
          rating: 5,
          title: "Absolutely stunning!",
          comment: "The quality is exceptional and exactly as described. The packaging was beautiful and delivery was prompt. Highly recommend Orby Jewels!",
          isVerified: true,
        },
      });
    }
  }
  console.log("✅ Reviews created");

  console.log("🎉 Database seeded successfully!");
  console.log("\n📋 Demo Credentials:");
  console.log("   Admin: admin@orbyjewels.com / OrbyAdmin@2024");
  console.log("   Customer: demo@customer.com / Customer@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
