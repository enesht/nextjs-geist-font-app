import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create Sections
  const nostaji = await prisma.section.upsert({
    where: { name: 'NOSTAJI' },
    update: {},
    create: {
      name: 'NOSTAJI',
      description: 'Nostaji bölümü - geleneksel atmosfer'
    }
  })

  const restoran = await prisma.section.upsert({
    where: { name: 'RESTORAN' },
    update: {},
    create: {
      name: 'RESTORAN',
      description: 'Ana restoran bölümü'
    }
  })

  const cafe = await prisma.section.upsert({
    where: { name: 'CAFE' },
    update: {},
    create: {
      name: 'CAFE',
      description: 'Cafe bölümü - kahve ve hafif yemekler'
    }
  })

  console.log('✅ Sections created')

  // Create Tables for each section
  const tables = []
  
  // Nostaji tables (1-10)
  for (let i = 1; i <= 10; i++) {
    const table = await prisma.table.upsert({
      where: { sectionId_number: { sectionId: nostaji.id, number: i } },
      update: {},
      create: {
        number: i,
        sectionId: nostaji.id,
        capacity: i <= 5 ? 4 : 6
      }
    })
    tables.push(table)
  }

  // Restoran tables (1-15)
  for (let i = 1; i <= 15; i++) {
    const table = await prisma.table.upsert({
      where: { sectionId_number: { sectionId: restoran.id, number: i } },
      update: {},
      create: {
        number: i,
        sectionId: restoran.id,
        capacity: i <= 8 ? 4 : 6
      }
    })
    tables.push(table)
  }

  // Cafe tables (1-8)
  for (let i = 1; i <= 8; i++) {
    const table = await prisma.table.upsert({
      where: { sectionId_number: { sectionId: cafe.id, number: i } },
      update: {},
      create: {
        number: i,
        sectionId: cafe.id,
        capacity: 2
      }
    })
    tables.push(table)
  }

  console.log('✅ Tables created')

  // Create Users
  const hashedPassword = await bcrypt.hash('123456', 10)

  const patron = await prisma.user.upsert({
    where: { username: 'patron' },
    update: {},
    create: {
      username: 'patron',
      password: hashedPassword,
      fullName: 'Restoran Patronu',
      role: 'PATRON'
    }
  })

  const manager = await prisma.user.upsert({
    where: { username: 'mudur' },
    update: {},
    create: {
      username: 'mudur',
      password: hashedPassword,
      fullName: 'Restoran Müdürü',
      role: 'MANAGER'
    }
  })

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      fullName: 'Sistem Yöneticisi',
      role: 'ADMIN'
    }
  })

  const chef1 = await prisma.user.upsert({
    where: { username: 'sef1' },
    update: {},
    create: {
      username: 'sef1',
      password: hashedPassword,
      fullName: 'Şef - Nostaji',
      role: 'CHEF',
      sectionId: nostaji.id
    }
  })

  const chef2 = await prisma.user.upsert({
    where: { username: 'sef2' },
    update: {},
    create: {
      username: 'sef2',
      password: hashedPassword,
      fullName: 'Şef - Restoran',
      role: 'CHEF',
      sectionId: restoran.id
    }
  })

  const chef3 = await prisma.user.upsert({
    where: { username: 'sef3' },
    update: {},
    create: {
      username: 'sef3',
      password: hashedPassword,
      fullName: 'Şef - Cafe',
      role: 'CHEF',
      sectionId: cafe.id
    }
  })

  // Mutfak kullanıcıları
  const kitchen1 = await prisma.user.upsert({
    where: { username: 'mutfak1' },
    update: {},
    create: {
      username: 'mutfak1',
      password: hashedPassword,
      fullName: 'Mutfak 1 Personeli',
      role: 'KITCHEN1'
    }
  })

  const kitchen2 = await prisma.user.upsert({
    where: { username: 'mutfak2' },
    update: {},
    create: {
      username: 'mutfak2',
      password: hashedPassword,
      fullName: 'Mutfak 2 Personeli',
      role: 'KITCHEN2'
    }
  })

  const cashier = await prisma.user.upsert({
    where: { username: 'kasa' },
    update: {},
    create: {
      username: 'kasa',
      password: hashedPassword,
      fullName: 'Kasa Personeli',
      role: 'CASHIER'
    }
  })

  console.log('✅ Users created')

  // Create Categories
  const categories = [
    { name: 'Izgaralar', kitchen: 'KITCHEN1' },
    { name: 'Çorbalar', kitchen: 'KITCHEN1' },
    { name: 'Salatalar', kitchen: 'KITCHEN2' },
    { name: 'Ana Yemekler', kitchen: 'KITCHEN1' },
    { name: 'Tatlılar', kitchen: 'KITCHEN2' },
    { name: 'İçecekler', kitchen: 'KITCHEN2' },
    { name: 'Kahveler', kitchen: 'KITCHEN2' },
    { name: 'Mezeler', kitchen: 'KITCHEN2' }
  ]

  const createdCategories = []
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { name: cat.name }
    })
    createdCategories.push({ ...category, kitchen: cat.kitchen })
  }

  console.log('✅ Categories created')

  // Create Products
  const products = [
    // Izgaralar
    { name: 'Adana Kebap', price: 85.00, category: 'Izgaralar', kitchen: 'KITCHEN1' },
    { name: 'Urfa Kebap', price: 80.00, category: 'Izgaralar', kitchen: 'KITCHEN1' },
    { name: 'Kuzu Şiş', price: 95.00, category: 'Izgaralar', kitchen: 'KITCHEN1' },
    { name: 'Tavuk Şiş', price: 70.00, category: 'Izgaralar', kitchen: 'KITCHEN1' },
    { name: 'Karışık Izgara', price: 120.00, category: 'Izgaralar', kitchen: 'KITCHEN1' },

    // Çorbalar
    { name: 'Mercimek Çorbası', price: 25.00, category: 'Çorbalar', kitchen: 'KITCHEN1' },
    { name: 'Yayla Çorbası', price: 30.00, category: 'Çorbalar', kitchen: 'KITCHEN1' },
    { name: 'Domates Çorbası', price: 28.00, category: 'Çorbalar', kitchen: 'KITCHEN1' },

    // Salatalar
    { name: 'Mevsim Salata', price: 35.00, category: 'Salatalar', kitchen: 'KITCHEN2' },
    { name: 'Çoban Salata', price: 30.00, category: 'Salatalar', kitchen: 'KITCHEN2' },
    { name: 'Roka Salata', price: 40.00, category: 'Salatalar', kitchen: 'KITCHEN2' },

    // Ana Yemekler
    { name: 'Kuzu Güveç', price: 90.00, category: 'Ana Yemekler', kitchen: 'KITCHEN1' },
    { name: 'Tavuk Sote', price: 65.00, category: 'Ana Yemekler', kitchen: 'KITCHEN1' },
    { name: 'Balık Izgara', price: 85.00, category: 'Ana Yemekler', kitchen: 'KITCHEN1' },

    // Tatlılar
    { name: 'Baklava', price: 45.00, category: 'Tatlılar', kitchen: 'KITCHEN2' },
    { name: 'Künefe', price: 50.00, category: 'Tatlılar', kitchen: 'KITCHEN2' },
    { name: 'Sütlaç', price: 35.00, category: 'Tatlılar', kitchen: 'KITCHEN2' },

    // İçecekler
    { name: 'Çay', price: 8.00, category: 'İçecekler', kitchen: 'KITCHEN2' },
    { name: 'Ayran', price: 12.00, category: 'İçecekler', kitchen: 'KITCHEN2' },
    { name: 'Kola', price: 15.00, category: 'İçecekler', kitchen: 'KITCHEN2' },
    { name: 'Su', price: 5.00, category: 'İçecekler', kitchen: 'KITCHEN2' },

    // Kahveler
    { name: 'Türk Kahvesi', price: 25.00, category: 'Kahveler', kitchen: 'KITCHEN2' },
    { name: 'Espresso', price: 20.00, category: 'Kahveler', kitchen: 'KITCHEN2' },
    { name: 'Cappuccino', price: 30.00, category: 'Kahveler', kitchen: 'KITCHEN2' },
    { name: 'Latte', price: 32.00, category: 'Kahveler', kitchen: 'KITCHEN2' },

    // Mezeler
    { name: 'Humus', price: 25.00, category: 'Mezeler', kitchen: 'KITCHEN2' },
    { name: 'Cacık', price: 20.00, category: 'Mezeler', kitchen: 'KITCHEN2' },
    { name: 'Ezme', price: 22.00, category: 'Mezeler', kitchen: 'KITCHEN2' },
    { name: 'Haydari', price: 24.00, category: 'Mezeler', kitchen: 'KITCHEN2' }
  ]

  for (const prod of products) {
    const category = createdCategories.find(c => c.name === prod.category)
    if (category) {
      await prisma.product.upsert({
        where: { name: prod.name },
        update: {},
        create: {
          name: prod.name,
          price: prod.price,
          categoryId: category.id,
          kitchenAssignment: prod.kitchen as 'KITCHEN1' | 'KITCHEN2'
        }
      })
    }
  }

  console.log('✅ Products created')

  // Şef kategori izinleri oluştur
  const izgaraCategory = createdCategories.find(c => c.name === 'Izgaralar')
  const icecekCategory = createdCategories.find(c => c.name === 'İçecekler')
  const salatCategory = createdCategories.find(c => c.name === 'Salatalar')
  const corbaCategory = createdCategories.find(c => c.name === 'Çorbalar')
  const anaYemekCategory = createdCategories.find(c => c.name === 'Ana Yemekler')
  const tatliCategory = createdCategories.find(c => c.name === 'Tatlılar')
  const kahveCategory = createdCategories.find(c => c.name === 'Kahveler')
  const mezeCategory = createdCategories.find(c => c.name === 'Mezeler')

  // Şef 1 (Nostaji) - Izgaralar ve İçecekler
  if (izgaraCategory) {
    await prisma.chefCategoryPermission.upsert({
      where: { userId_categoryId: { userId: chef1.id, categoryId: izgaraCategory.id } },
      update: {},
      create: { userId: chef1.id, categoryId: izgaraCategory.id }
    })
  }
  if (icecekCategory) {
    await prisma.chefCategoryPermission.upsert({
      where: { userId_categoryId: { userId: chef1.id, categoryId: icecekCategory.id } },
      update: {},
      create: { userId: chef1.id, categoryId: icecekCategory.id }
    })
  }

  // Şef 2 (Restoran) - Ana Yemekler, Çorbalar, Salatalar
  if (anaYemekCategory) {
    await prisma.chefCategoryPermission.upsert({
      where: { userId_categoryId: { userId: chef2.id, categoryId: anaYemekCategory.id } },
      update: {},
      create: { userId: chef2.id, categoryId: anaYemekCategory.id }
    })
  }
  if (corbaCategory) {
    await prisma.chefCategoryPermission.upsert({
      where: { userId_categoryId: { userId: chef2.id, categoryId: corbaCategory.id } },
      update: {},
      create: { userId: chef2.id, categoryId: corbaCategory.id }
    })
  }
  if (salatCategory) {
    await prisma.chefCategoryPermission.upsert({
      where: { userId_categoryId: { userId: chef2.id, categoryId: salatCategory.id } },
      update: {},
      create: { userId: chef2.id, categoryId: salatCategory.id }
    })
  }

  // Şef 3 (Cafe) - Kahveler, Tatlılar, İçecekler
  if (kahveCategory) {
    await prisma.chefCategoryPermission.upsert({
      where: { userId_categoryId: { userId: chef3.id, categoryId: kahveCategory.id } },
      update: {},
      create: { userId: chef3.id, categoryId: kahveCategory.id }
    })
  }
  if (tatliCategory) {
    await prisma.chefCategoryPermission.upsert({
      where: { userId_categoryId: { userId: chef3.id, categoryId: tatliCategory.id } },
      update: {},
      create: { userId: chef3.id, categoryId: tatliCategory.id }
    })
  }
  if (icecekCategory) {
    await prisma.chefCategoryPermission.upsert({
      where: { userId_categoryId: { userId: chef3.id, categoryId: icecekCategory.id } },
      update: {},
      create: { userId: chef3.id, categoryId: icecekCategory.id }
    })
  }

  console.log('✅ Chef category permissions created')

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('👑 Patron: patron / 123456')
  console.log('👨‍💼 Müdür: mudur / 123456')
  console.log('⚙️ Admin: admin / 123456')
  console.log('👨‍🍳 Şef 1 (Nostaji): sef1 / 123456')
  console.log('👨‍🍳 Şef 2 (Restoran): sef2 / 123456')
  console.log('👨‍🍳 Şef 3 (Cafe): sef3 / 123456')
  console.log('🍳 Mutfak 1: mutfak1 / 123456')
  console.log('🍳 Mutfak 2: mutfak2 / 123456')
  console.log('💰 Kasa: kasa / 123456')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
