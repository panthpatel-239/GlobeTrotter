import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const citiesData = [
  // 1. Ahmedabad
  {
    name: 'Ahmedabad',
    country: 'India',
    description: 'India\'s first UNESCO World Heritage City, famous for its historic pols, Sabarmati Ashram, vibrant street food at Manek Chowk, and intricate textiles.',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    costIndex: 2,
    popularity: 88,
    activities: [
      {
        name: 'Sabarmati Ashram Visit',
        description: 'Explore the peaceful riverfront headquarters of Mahatma Gandhi where the historic Dandi Salt March originated.',
        category: 'Cultural',
        estimatedCost: 0,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1600683794351-f76269df16a7?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Manek Chowk Midnight Food Walk',
        description: 'Experience bustling jewelry market by day that transforms into a legendary street food paradise by night, serving Gwalior dosa, chocolate sandwiches, and kulfi.',
        category: 'Food',
        estimatedCost: 350,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Adalaj Stepwell Heritage Tour',
        description: 'Marvel at the 5-story deep 15th-century subterranean water building adorned with intricate Solanki architecture and carvings.',
        category: 'Sightseeing',
        estimatedCost: 50,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Sabarmati Riverfront Evening Stroll & Boating',
        description: 'Walk or boat along the scenic urban promenade featuring lush gardens and skyline views of Ahmedabad.',
        category: 'Nature',
        estimatedCost: 150,
        duration: '1.5 hours',
        image: 'https://images.unsplash.com/photo-1622396481304-984e7f8674d8?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 2. Mumbai
  {
    name: 'Mumbai',
    country: 'India',
    description: 'The financial powerhouse and entertainment capital of India, known for colonial architecture, coastal promenades, Bollywood, and vibrant energy.',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    costIndex: 4,
    popularity: 96,
    activities: [
      {
        name: 'Gateway of India & Colaba Heritage Walk',
        description: 'Admire the 20th-century basalt triumphal arch overlooking the Arabian Sea and wander through art-deco Colaba streets.',
        category: 'Sightseeing',
        estimatedCost: 0,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Elephanta Caves Ferry & Island Tour',
        description: 'Take a boat trip across Mumbai Harbor to UNESCO-listed cave temples dedicated to Lord Shiva, sculpted in rock.',
        category: 'Cultural',
        estimatedCost: 600,
        duration: 'Half day',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Marine Drive Sunset & Chowpatty Street Food',
        description: 'Sit along the Queen\'s Necklace to catch a golden sunset and taste fresh Mumbai pav bhaji, pani puri, and bhel puri.',
        category: 'Food',
        estimatedCost: 400,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Bandra Bandstand & Street Art Exploration',
        description: 'Explore trendy Bandra with hip cafes, heritage Portuguese bungalows, seaside promenade, and vibrant murals.',
        category: 'Adventure',
        estimatedCost: 200,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 3. Delhi
  {
    name: 'Delhi',
    country: 'India',
    description: 'India\'s historic capital bridging ancient Mughal monuments, Lutyens avenues, bustling spice bazaars, and modern culture.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
    costIndex: 3,
    popularity: 95,
    activities: [
      {
        name: 'Old Delhi Chandni Chowk Food & Rickshaw Tour',
        description: 'Navigate ancient alleys tasting Paranthe Wali Gali parathas, Karim\'s kebabs, and Old Famous Jalebi Wala treats.',
        category: 'Food',
        estimatedCost: 500,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1585675100414-add2e465a136?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Qutub Minar & Mehrauli Archaeological Park',
        description: 'Tour the tallest brick minaret in the world surrounded by medieval monuments and lush ruins.',
        category: 'Sightseeing',
        estimatedCost: 250,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Humayun\'s Tomb & Sunder Nursery Walk',
        description: 'Visit the magnificent precursor to the Taj Mahal surrounded by tranquil Mughal gardens and biodiversity parks.',
        category: 'Cultural',
        estimatedCost: 300,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'India Gate & Kartavya Path Light Show',
        description: 'Stroll through the grand ceremonial boulevard of India surrounded by manicured lawns, fountains, and war memorials.',
        category: 'Sightseeing',
        estimatedCost: 0,
        duration: '1.5 hours',
        image: 'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 4. Jaipur
  {
    name: 'Jaipur',
    country: 'India',
    description: 'The Pink City of Rajasthan, famed for majestic hill forts, royal palaces, gemstone bazaars, and rich Rajput hospitality.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    costIndex: 2,
    popularity: 94,
    activities: [
      {
        name: 'Amber Palace & Jaigarh Fort Tour',
        description: 'Discover the hilltop fortress with artistic Hindu elements, Sheesh Mahal (Mirror Palace), and Maota Lake views.',
        category: 'Sightseeing',
        estimatedCost: 550,
        duration: 'Half day',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Hawa Mahal & City Palace Photo Walk',
        description: 'Photograph the iconic 953-window Palace of Winds and browse the royal textiles and weapons museum in City Palace.',
        category: 'Cultural',
        estimatedCost: 400,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1603288967399-5e76313a1e48?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Nahargarh Fort Sunset View',
        description: 'Catch panoramic golden hour views over the entire Pink City skyline from the edge of the Aravalli hills.',
        category: 'Nature',
        estimatedCost: 200,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Johari & Bapu Bazaar Handicraft Shopping',
        description: 'Shop for authentic Jaipuri quilts, blue pottery, block-printed textiles, and handmade leather juttis.',
        category: 'Shopping',
        estimatedCost: 800,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 5. Agra
  {
    name: 'Agra',
    country: 'India',
    description: 'Home of the timeless Taj Mahal, Agra Fort, and rich Mughal history nestled on the banks of the Yamuna River.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    costIndex: 2,
    popularity: 97,
    activities: [
      {
        name: 'Taj Mahal Sunrise Experience',
        description: 'Witness the world-famous white marble monument of love bathe in the soft golden hues of early morning light.',
        category: 'Sightseeing',
        estimatedCost: 500,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Agra Fort Exploration',
        description: 'Tour the massive red sandstone fortress that served as the primary residence of the Mughal emperors until 1638.',
        category: 'Cultural',
        estimatedCost: 350,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Mehtab Bagh & Sunset Silhouette Walk',
        description: 'Enjoy tranquil charbagh garden views of the Taj Mahal from across the Yamuna river at dusk.',
        category: 'Nature',
        estimatedCost: 150,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Agra Petha & Mughlai Culinary Tour',
        description: 'Taste original Panchhi Petha delicacies and rich Bedmi Puri with spicy aloo sabzi in the historic bazaars.',
        category: 'Food',
        estimatedCost: 300,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 6. Goa
  {
    name: 'Goa',
    country: 'India',
    description: 'India\'s premier coastal getaway featuring sun-kissed beaches, Portuguese colonial churches, water sports, and beachside shacks.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    costIndex: 3,
    popularity: 98,
    activities: [
      {
        name: 'Scuba Diving & Watersports at Grand Island',
        description: 'Boat ride to Grand Island with underwater reef diving, jet ski rides, parasailing, and bumper boats.',
        category: 'Adventure',
        estimatedCost: 2200,
        duration: 'Full day',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Fontainhas Latin Quarter Heritage Walk',
        description: 'Stroll through Asia\'s only surviving Latin Quarter with vibrant pastel Portuguese villas and artisan bakeries.',
        category: 'Cultural',
        estimatedCost: 200,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Dudhsagar Waterfall Jeep Safari',
        description: 'Trek or take a 4x4 jungle safari to the four-tiered sea of milk waterfall nestled in the Western Ghats.',
        category: 'Nature',
        estimatedCost: 1500,
        duration: 'Full day',
        image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Anjuna Beach Sunset & Shack Seafood Dinner',
        description: 'Relax to chill music, fresh grilled kingfish, and refreshing drinks as the sun dips into the Arabian Sea.',
        category: 'Food',
        estimatedCost: 900,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 7. Udaipur
  {
    name: 'Udaipur',
    country: 'India',
    description: 'The City of Lakes and Venice of the East, famed for shimmering Lake Pichola, white marble palaces, and romantic heritage.',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    costIndex: 3,
    popularity: 91,
    activities: [
      {
        name: 'Lake Pichola Sunset Boat Cruise',
        description: 'Sail past the ethereal Lake Palace, Jag Mandir island, and illuminated ghats against the Aravalli hills backdrop.',
        category: 'Sightseeing',
        estimatedCost: 650,
        duration: '1.5 hours',
        image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Udaipur City Palace Complex Tour',
        description: 'Explore the grandest palace complex in Rajasthan with peacocks in mosaic, crystal gallery, and royal balconies.',
        category: 'Cultural',
        estimatedCost: 450,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Bagore Ki Haveli Dharohar Dance Show',
        description: 'Watch traditional Rajasthani folk dances, puppet acts, and fire balancing performances right by Gangaur Ghat.',
        category: 'Cultural',
        estimatedCost: 200,
        duration: '1.5 hours',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 8. Bengaluru
  {
    name: 'Bengaluru',
    country: 'India',
    description: 'The Silicon Valley of India and Garden City, boasting pleasant weather, lush parks, craft microbreweries, and modern innovation.',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    costIndex: 3,
    popularity: 89,
    activities: [
      {
        name: 'Lalbagh Botanical Garden & Glass House Walk',
        description: 'Stroll among centuries-old tropical trees, rare bonsai, and the Victorian-style glass pavilion.',
        category: 'Nature',
        estimatedCost: 50,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Indiranagar Craft Brewery & Cafe Hopping',
        description: 'Taste artisanal ales, fresh stouts, and global gastropub dishes along 100 Feet Road.',
        category: 'Food',
        estimatedCost: 1200,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1538488881523-294da0c87b63?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Bangalore Palace Royal Audio Tour',
        description: 'Discover Tudor-style architecture modeled after Windsor Castle, complete with fortified towers and wood carvings.',
        category: 'Cultural',
        estimatedCost: 450,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 9. Hyderabad
  {
    name: 'Hyderabad',
    country: 'India',
    description: 'The City of Pearls and Nizams, renowned for authentic Dum Biryani, historic Charminar, Golconda Fort, and booming tech parks.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    costIndex: 2,
    popularity: 90,
    activities: [
      {
        name: 'Charminar & Laad Bazaar Pearl Shopping',
        description: 'Climb the 16th-century four-minaret monument and shop for glittering lacquer bangles and Basra pearls.',
        category: 'Sightseeing',
        estimatedCost: 150,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Authentic Hyderabadi Dum Biryani Feast',
        description: 'Savor fragrant saffron rice slow-cooked with tender marinated mutton and rich spices at legendary eateries.',
        category: 'Food',
        estimatedCost: 450,
        duration: '1.5 hours',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Golconda Fort Sound & Light Show',
        description: 'Explore the historic diamond trading fortress with acoustic engineering wonders and dramatic evening storytelling.',
        category: 'Cultural',
        estimatedCost: 250,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 10. Kolkata
  {
    name: 'Kolkata',
    country: 'India',
    description: 'The City of Joy and cultural heart of India, famous for Victoria Memorial, Howrah Bridge, colonial tramways, and Bengali sweets.',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',
    costIndex: 2,
    popularity: 87,
    activities: [
      {
        name: 'Victoria Memorial Hall & Maidan Gardens',
        description: 'Tour the grand white Makrana marble monument dedicated to Queen Victoria, showcasing rare paintings and royal relics.',
        category: 'Sightseeing',
        estimatedCost: 100,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Park Street & College Street Boi Para Walk',
        description: 'Browse the largest second-hand book market in the world, followed by coffee and snacks at the iconic Indian Coffee House.',
        category: 'Cultural',
        estimatedCost: 200,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Bengali Sweet & Kathi Roll Tasting Trail',
        description: 'Taste authentic Kolkata kathi rolls at Nizam\'s and freshly made spongy Rosogolla, Sandesh, and Mishti Doi.',
        category: 'Food',
        estimatedCost: 350,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 11. Paris
  {
    name: 'Paris',
    country: 'France',
    description: 'The City of Light, synonymous with haute couture, world-class art at the Louvre, romantic Seine riverbanks, and Parisian bistros.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    costIndex: 5,
    popularity: 99,
    activities: [
      {
        name: 'Eiffel Tower Summit & Trocadéro Sunset',
        description: 'Ascend to the top deck for breathtaking 360-degree views over Paris and watch the tower sparkle at twilight.',
        category: 'Sightseeing',
        estimatedCost: 3000,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Louvre Museum Masterpieces Guided Tour',
        description: 'Admire the Mona Lisa, Venus de Milo, and Winged Victory of Samothrace in the world\'s largest art museum.',
        category: 'Cultural',
        estimatedCost: 2200,
        duration: '3.5 hours',
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Seine River Cruise & Montmartre Walk',
        description: 'Cruise along the Seine past Notre Dame and climb the cobbled steps of Montmartre to the Sacré-Cœur basilica.',
        category: 'Sightseeing',
        estimatedCost: 1800,
        duration: 'Half day',
        image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'French Patisserie & Wine Tasting Experience',
        description: 'Taste authentic warm buttery croissants, colorful macarons, and paired Bordeaux wines in a Saint-Germain cellar.',
        category: 'Food',
        estimatedCost: 3500,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 12. London
  {
    name: 'London',
    country: 'United Kingdom',
    description: 'Dynamic global city steeped in history, from Big Ben and Tower Bridge to world-class West End theatre and royal palaces.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    costIndex: 5,
    popularity: 98,
    activities: [
      {
        name: 'Tower of London & Crown Jewels Tour',
        description: 'Uncover 1,000 years of royal intrigue, fortress history, and gaze at the dazzling Crown Jewels collection.',
        category: 'Cultural',
        estimatedCost: 3200,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'London Eye Flight & Westminster Walk',
        description: 'Soar 135 meters above the Thames in an observation capsule for views of Parliament, Big Ben, and Buckingham Palace.',
        category: 'Sightseeing',
        estimatedCost: 3500,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Borough Market Artisanal Food Tour',
        description: 'Sample British artisan cheeses, freshly baked sausage rolls, salt beef sandwiches, and chocolate fudge.',
        category: 'Food',
        estimatedCost: 2000,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'West End Musical Theatre Night',
        description: 'Experience an unforgettable award-winning theatrical performance in London\'s historic theatre district.',
        category: 'Cultural',
        estimatedCost: 5500,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 13. Dubai
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    description: 'An ultra-modern desert metropolis famous for futuristic skyscrapers, luxury shopping, man-made islands, and desert safaris.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    costIndex: 4,
    popularity: 97,
    activities: [
      {
        name: 'Burj Khalifa Top Deck & Dubai Mall Fountain Show',
        description: 'Ride the world\'s fastest elevator to levels 124 & 125 of the tallest building on earth and watch the fountain dance.',
        category: 'Sightseeing',
        estimatedCost: 3800,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Red Dunes Desert Safari & BBQ Dinner',
        description: 'Adrenaline-pumping 4x4 dune bashing, camel riding, sandboarding, falconry, and belly dance performance under the stars.',
        category: 'Adventure',
        estimatedCost: 3500,
        duration: '6 hours',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Dubai Marina Luxury Yacht Cruise',
        description: 'Sail through the towering Dubai Marina skyscrapers and past Ain Dubai and the Palm Jumeirah.',
        category: 'Sightseeing',
        estimatedCost: 4500,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Old Dubai Gold & Spice Souk Abra Ride',
        description: 'Take a traditional 1-dirham wooden abra boat across Dubai Creek to explore fragrant saffron, incense, and gold jewellery.',
        category: 'Shopping',
        estimatedCost: 500,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 14. Singapore
  {
    name: 'Singapore',
    country: 'Singapore',
    description: 'A futuristic garden city offering Michelin-starred street food, Marina Bay skyline, lush botanical biodomes, and diverse cultural districts.',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    costIndex: 4,
    popularity: 96,
    activities: [
      {
        name: 'Gardens by the Bay & Supertree Grove Light Show',
        description: 'Walk through the climate-controlled Flower Dome and Cloud Forest with its 35m indoor waterfall, followed by Garden Rhapsody.',
        category: 'Sightseeing',
        estimatedCost: 2000,
        duration: '3.5 hours',
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Chinatown & Maxwell Hawker Centre Feast',
        description: 'Taste Tian Tian Hainanese Chicken Rice, char kway teow, and laksa in Singapore\'s most legendary food market.',
        category: 'Food',
        estimatedCost: 800,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Night Safari Wildlife Tram Tour',
        description: 'Explore the world\'s first nocturnal wildlife park observing over 900 animals in naturalistic jungle habitats.',
        category: 'Adventure',
        estimatedCost: 3200,
        duration: '3.5 hours',
        image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Sentosa Island Cable Car & Beach Day',
        description: 'Ride scenic cable cars overlooking Keppel Harbour to relax on Siloso Beach or visit Universal Studios.',
        category: 'Sightseeing',
        estimatedCost: 2800,
        duration: 'Half day',
        image: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 15. Tokyo
  {
    name: 'Tokyo',
    country: 'Japan',
    description: 'An exhilarating blend of neon-lit skyscrapers, ancient Shinto shrines, culinary perfection, anime culture, and lightning-fast bullet trains.',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    costIndex: 4,
    popularity: 98,
    activities: [
      {
        name: 'Shibuya Crossing & Shinjuku Neon Night Walk',
        description: 'Cross the busiest pedestrian intersection on Earth, visit Hachiko statue, and explore Omoide Yokocho lantern alley.',
        category: 'Sightseeing',
        estimatedCost: 500,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Senso-ji Temple & Asakusa Traditional Rickshaw',
        description: 'Walk through Kaminarimon Thunder Gate to Tokyo\'s oldest Buddhist temple and browse Nakamise-dori sweet stalls.',
        category: 'Cultural',
        estimatedCost: 1500,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Tsukiji Outer Market Sushi & Wagyu Tasting',
        description: 'Taste freshly torched A5 Wagyu beef skewers, fatty tuna nigiri, tamagoyaki omelettes, and matcha ice cream.',
        category: 'Food',
        estimatedCost: 2500,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'teamLab Borderless Immersive Digital Art',
        description: 'Immerse yourself in a world of borderless digital art installations that react dynamically to touch and movement.',
        category: 'Cultural',
        estimatedCost: 2800,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  // 16. New York
  {
    name: 'New York',
    country: 'United States',
    description: 'The iconic Big Apple, featuring Central Park, Broadway shows, world-class museums, Statue of Liberty, and unmatched urban energy.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    costIndex: 5,
    popularity: 99,
    activities: [
      {
        name: 'Statue of Liberty & Ellis Island Ferry',
        description: 'Sail across New York Harbor to stand at the base of Lady Liberty and tour the historic immigration museum.',
        category: 'Sightseeing',
        estimatedCost: 2500,
        duration: '4 hours',
        image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Central Park Bike Tour & Bethesda Fountain',
        description: 'Pedal through the green oasis past Bow Bridge, Strawberry Fields, Jacqueline Kennedy Onassis Reservoir, and Belvedere Castle.',
        category: 'Nature',
        estimatedCost: 2000,
        duration: '3 hours',
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Empire State Building or Top of the Rock Observatory',
        description: 'Take in panoramic views of Manhattan\'s skyline, Chrysler Building, and Hudson River from the 86th floor open-air deck.',
        category: 'Sightseeing',
        estimatedCost: 3800,
        duration: '2 hours',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Chelsea Market & High Line Elevated Park Walk',
        description: 'Walk along the historic freight rail line converted into an elevated park filled with wildflowers, modern art, and gourmet food stalls.',
        category: 'Food',
        estimatedCost: 1800,
        duration: '2.5 hours',
        image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
];

async function main() {
  console.log('🌱 Starting GlobeTrotter database seed...');

  // 1. Create demo users for easy testing/presentation
  const demoUsers = [
    { email: 'alex@globetrotter.io', name: 'Alex Rover', password: 'password123' },
    { email: 'traveler@globetrotter.com', name: 'Alex Rover', password: 'Traveler@123' },
  ];

  let primaryUser: any = null;

  for (const u of demoUsers) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      const created = await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          passwordHash,
          profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        },
      });
      console.log(`✅ Demo user created: ${created.email} (password: ${u.password})`);
      if (!primaryUser) primaryUser = created;
    } else {
      // Update password hash just in case
      const passwordHash = await bcrypt.hash(u.password, 10);
      await prisma.user.update({
        where: { id: existing.id },
        data: { passwordHash },
      });
      console.log(`ℹ️  Demo user updated: ${existing.email} (password: ${u.password})`);
      if (!primaryUser) primaryUser = existing;
    }
  }

  const demoUser = primaryUser;

  // 2. Seed Cities and Activities
  console.log(`🏙️  Seeding ${citiesData.length} cities with activities...`);

  for (const cityItem of citiesData) {
    const { activities, ...cityData } = cityItem;

    // Upsert city by name and country
    const existingCity = await prisma.city.findFirst({
      where: { name: cityData.name, country: cityData.country },
    });

    let city;
    if (existingCity) {
      city = await prisma.city.update({
        where: { id: existingCity.id },
        data: cityData,
      });
    } else {
      city = await prisma.city.create({
        data: cityData,
      });
    }

    // Seed activities for this city
    for (const act of activities) {
      const existingAct = await prisma.activity.findFirst({
        where: { cityId: city.id, name: act.name },
      });

      if (existingAct) {
        await prisma.activity.update({
          where: { id: existingAct.id },
          data: act,
        });
      } else {
        await prisma.activity.create({
          data: {
            ...act,
            cityId: city.id,
          },
        });
      }
    }
    console.log(`   ✓ Seeded ${city.name}, ${city.country} (${activities.length} activities)`);
  }

  // 3. Create a sample showcase trip with stops, activities and expenses for each demo user
  const allUsers = await prisma.user.findMany();
  for (const user of allUsers) {
    const existingTrip = await prisma.trip.findFirst({
      where: { userId: user.id, title: 'Golden Triangle & Royal Rajasthan' },
    });

    if (!existingTrip) {
      console.log(`🗺️  Creating sample showcase trip for user: ${user.email}...`);
      const delhi = await prisma.city.findFirst({ where: { name: 'Delhi' } });
      const jaipur = await prisma.city.findFirst({ where: { name: 'Jaipur' } });
      const agra = await prisma.city.findFirst({ where: { name: 'Agra' } });

      if (delhi && jaipur && agra) {
        const sampleTrip = await prisma.trip.create({
          data: {
            userId: user.id,
            title: 'Golden Triangle & Royal Rajasthan',
            description: 'A 7-day royal journey through Delhi, Agra, and Jaipur exploring Mughal marvels and Rajput palaces.',
            startDate: new Date('2026-10-15'),
            endDate: new Date('2026-10-22'),
            coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
            budgetLimit: 45000,
            isPublic: true,
            shareId: `gt-${user.id.slice(0, 8)}-2026`,
          },
        });

      // Stop 1: Delhi
      const stop1 = await prisma.tripStop.create({
        data: {
          tripId: sampleTrip.id,
          cityId: delhi.id,
          arrivalDate: new Date('2026-10-15'),
          departureDate: new Date('2026-10-17'),
          order: 1,
        },
      });

      const delhiActs = await prisma.activity.findMany({ where: { cityId: delhi.id } });
      if (delhiActs.length > 0) {
        await prisma.tripActivity.create({
          data: {
            tripStopId: stop1.id,
            activityId: delhiActs[0].id,
            date: new Date('2026-10-15'),
            startTime: '11:00 AM',
            cost: delhiActs[0].estimatedCost,
          },
        });
      }

      // Stop 2: Agra
      const stop2 = await prisma.tripStop.create({
        data: {
          tripId: sampleTrip.id,
          cityId: agra.id,
          arrivalDate: new Date('2026-10-17'),
          departureDate: new Date('2026-10-19'),
          order: 2,
        },
      });

      const agraActs = await prisma.activity.findMany({ where: { cityId: agra.id } });
      if (agraActs.length > 0) {
        await prisma.tripActivity.create({
          data: {
            tripStopId: stop2.id,
            activityId: agraActs[0].id,
            date: new Date('2026-10-18'),
            startTime: '06:00 AM',
            cost: agraActs[0].estimatedCost,
          },
        });
      }

      // Stop 3: Jaipur
      const stop3 = await prisma.tripStop.create({
        data: {
          tripId: sampleTrip.id,
          cityId: jaipur.id,
          arrivalDate: new Date('2026-10-19'),
          departureDate: new Date('2026-10-22'),
          order: 3,
        },
      });

      const jaipurActs = await prisma.activity.findMany({ where: { cityId: jaipur.id } });
      if (jaipurActs.length > 0) {
        await prisma.tripActivity.create({
          data: {
            tripStopId: stop3.id,
            activityId: jaipurActs[0].id,
            date: new Date('2026-10-20'),
            startTime: '09:30 AM',
            cost: jaipurActs[0].estimatedCost,
          },
        });
      }

      // Expenses
      await prisma.expense.createMany({
        data: [
          {
            tripId: sampleTrip.id,
            category: 'transport',
            description: 'Vande Bharat Express Train Tickets (Delhi - Agra - Jaipur)',
            amount: 3200,
            date: new Date('2026-10-15'),
          },
          {
            tripId: sampleTrip.id,
            category: 'accommodation',
            description: 'Heritage Haveli Hotel (3 Nights in Jaipur & Agra)',
            amount: 14500,
            date: new Date('2026-10-17'),
          },
          {
            tripId: sampleTrip.id,
            category: 'food',
            description: 'Traditional Thali dinners & street food tastings',
            amount: 4200,
            date: new Date('2026-10-18'),
          },
          {
            tripId: sampleTrip.id,
            category: 'activities',
            description: 'Monument entry passes & guided audio tours',
            amount: 2100,
            date: new Date('2026-10-19'),
          },
          {
            tripId: sampleTrip.id,
            category: 'other',
            description: 'Handicraft souvenirs from Johari Bazaar',
            amount: 2500,
            date: new Date('2026-10-21'),
          },
        ],
      });

      console.log(`✅ Sample showcase trip created with shareId: ${sampleTrip.shareId}`);
    }
  }
}

  console.log('🎉 Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
