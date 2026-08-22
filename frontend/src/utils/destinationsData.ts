import { City } from '../types';

export interface GlobalDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  image: string;
  description: string;
  costIndex: 'budget' | 'moderate' | 'luxury';
  popularityScore: number;
  averageDailyCost: number;
  aliases?: string[];
  topAttractions?: string[];
}

export const GLOBAL_DESTINATIONS: GlobalDestination[] = [
  // --- INDIA ---
  {
    id: 'dest-ahmedabad',
    name: 'Ahmedabad',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80',
    description: "India's first UNESCO World Heritage City, famous for Sabarmati Ashram, Sidi Saiyyed Mosque, and rich textile culture.",
    costIndex: 'budget',
    popularityScore: 90,
    averageDailyCost: 35,
    aliases: ['ahemdabad', 'amdavad', 'ahmdabad', 'ahmedabad gujarat', 'gandhinagar'],
    topAttractions: ['Sabarmati Ashram', 'Adalaj Stepwell', 'Kankaria Lake', 'Sidi Saiyyed Mosque', 'Manek Chowk'],
  },
  {
    id: 'dest-mumbai',
    name: 'Mumbai',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    description: 'The vibrant financial capital of India, home to Bollywood, Marine Drive, and colonial heritage architecture.',
    costIndex: 'moderate',
    popularityScore: 96,
    averageDailyCost: 55,
    aliases: ['bombay', 'mumbay', 'mumbi'],
    topAttractions: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Colaba Causeway'],
  },
  {
    id: 'dest-delhi',
    name: 'Delhi',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    description: 'The historic capital of India spanning centuries of Mughal monuments, bustling bazaars, and modern culture.',
    costIndex: 'budget',
    popularityScore: 97,
    averageDailyCost: 40,
    aliases: ['new delhi', 'dilli', 'old delhi', 'ncr'],
    topAttractions: ['Qutub Minar', 'Red Fort', 'Humayun Tomb', 'India Gate', 'Chandni Chowk'],
  },
  {
    id: 'dest-jaipur',
    name: 'Jaipur',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    description: 'The Pink City of Rajasthan with magnificent hilltop forts, royal palaces, and vibrant handicraft markets.',
    costIndex: 'budget',
    popularityScore: 95,
    averageDailyCost: 40,
    aliases: ['pink city', 'rajasthan', 'jaypur'],
    topAttractions: ['Hawa Mahal', 'Amber Palace', 'City Palace', 'Nahargarh Fort', 'Jantar Mantar'],
  },
  {
    id: 'dest-agra',
    name: 'Agra',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    description: 'Home to the iconic Taj Mahal, Agra Fort, and grand Mughal architectural wonders along the Yamuna river.',
    costIndex: 'budget',
    popularityScore: 98,
    averageDailyCost: 35,
    aliases: ['taj mahal', 'taj city'],
    topAttractions: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh'],
  },
  {
    id: 'dest-goa',
    name: 'Goa',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'Sun-drenched beaches, Portuguese colonial churches, coastal seafood shacks, and lively beachside night markets.',
    costIndex: 'budget',
    popularityScore: 96,
    averageDailyCost: 50,
    aliases: ['panjim', 'north goa', 'south goa', 'calangute', 'baga'],
    topAttractions: ['Baga Beach', 'Fort Aguada', 'Basilica of Bom Jesus', 'Dudhsagar Falls'],
  },
  {
    id: 'dest-udaipur',
    name: 'Udaipur',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    description: 'The City of Lakes with romantic marble palaces floating on serene waters and royal Mewar heritage.',
    costIndex: 'budget',
    popularityScore: 92,
    averageDailyCost: 45,
    aliases: ['city of lakes', 'lake pichola', 'udaypur'],
    topAttractions: ['City Palace Udaipur', 'Lake Pichola Boat Cruise', 'Jag Mandir', 'Saheliyon-ki-Bari'],
  },
  {
    id: 'dest-bengaluru',
    name: 'Bengaluru',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    description: 'The Silicon Valley of India, celebrated for green botanical gardens, craft microbreweries, and lively youth culture.',
    costIndex: 'moderate',
    popularityScore: 91,
    averageDailyCost: 50,
    aliases: ['bangalore', 'bengluru', 'silicon valley of india'],
    topAttractions: ['Lalbagh Botanical Garden', 'Bangalore Palace', 'Cubbon Park', 'Indiranagar Cafes'],
  },
  {
    id: 'dest-varanasi',
    name: 'Varanasi',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    description: 'One of the worlds oldest living cities on the sacred Ganges river, famous for spiritual Ganga Aarti and ancient ghats.',
    costIndex: 'budget',
    popularityScore: 94,
    averageDailyCost: 30,
    aliases: ['kashi', 'banaras', 'benares', 'varansi'],
    topAttractions: ['Dashashwamedh Ghat Aarti', 'Kashi Vishwanath Temple', 'Assi Ghat Sunrise', 'Sarnath'],
  },
  {
    id: 'dest-surat',
    name: 'Surat',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80',
    description: 'The Diamond City of the world and food capital of Gujarat, famous for Locho, Ghari, and vibrant silk markets.',
    costIndex: 'budget',
    popularityScore: 86,
    averageDailyCost: 30,
    aliases: ['diamond city', 'surat gujarat'],
    topAttractions: ['Dumas Beach', 'Dutch Gardens', 'Surat Castle', 'Gopi Talav'],
  },
  {
    id: 'dest-vadodara',
    name: 'Vadodara',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
    description: 'The Cultural Capital of Gujarat, home to the majestic Lukshmi Villas Palace and Statue of Unity gateway.',
    costIndex: 'budget',
    popularityScore: 88,
    averageDailyCost: 35,
    aliases: ['baroda', 'statue of unity', 'vadodra'],
    topAttractions: ['Lukshmi Villas Palace', 'Sayaji Baug', 'Statue of Unity Day Trip', 'Kirti Mandir'],
  },
  {
    id: 'dest-hyderabad',
    name: 'Hyderabad',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?auto=format&fit=crop&w=800&q=80',
    description: 'The City of Pearls, famous for authentic Hyderabadi Dum Biryani, Golconda Fort, and Charminar.',
    costIndex: 'budget',
    popularityScore: 90,
    averageDailyCost: 40,
    aliases: ['cyberabad', 'hydrabad', 'charminar city'],
    topAttractions: ['Charminar', 'Golconda Fort', 'Ramoji Film City', 'Hussain Sagar Lake'],
  },
  {
    id: 'dest-kolkata',
    name: 'Kolkata',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
    description: 'The City of Joy, steeped in literature, art, Victoria Memorial, yellow taxis, and mouthwatering sweets.',
    costIndex: 'budget',
    popularityScore: 89,
    averageDailyCost: 35,
    aliases: ['calcutta', 'city of joy'],
    topAttractions: ['Victoria Memorial', 'Howrah Bridge', 'Dakshineswar Kali Temple', 'Park Street'],
  },
  {
    id: 'dest-kerala',
    name: 'Kochi & Kerala Backwaters',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    description: 'Gods Own Country, celebrated for luxury houseboat cruises, spice plantations, and Ayurvedic wellness.',
    costIndex: 'budget',
    popularityScore: 94,
    averageDailyCost: 50,
    aliases: ['cochin', 'alleppey', 'alappuzha', 'munnar', 'kerala'],
    topAttractions: ['Alleppey Houseboat Cruise', 'Fort Kochi Chinese Fishing Nets', 'Munnar Tea Hills'],
  },
  {
    id: 'dest-ladakh',
    name: 'Leh Ladakh',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    description: 'High-altitude Himalayan wonderland with crystal-clear Pangong Lake, Buddhist monasteries, and mountain passes.',
    costIndex: 'budget',
    popularityScore: 95,
    averageDailyCost: 55,
    aliases: ['leh', 'pangong', 'nubra valley', 'ladakh'],
    topAttractions: ['Pangong Tso Lake', 'Nubra Valley Camel Safari', 'Khardung La Pass', 'Thiksey Monastery'],
  },

  // --- JAPAN & EAST ASIA ---
  {
    id: 'dest-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    description: 'A dazzling metropolis blending neon skyscrapers, anime pop culture, tranquil Shinto shrines, and world-class sushi.',
    costIndex: 'moderate',
    popularityScore: 99,
    averageDailyCost: 120,
    aliases: ['tokio', 'shibuya', 'shinjuku', 'japan tokyo'],
    topAttractions: ['Shibuya Crossing', 'Sensō-ji Temple', 'teamLab Planets', 'Tsukiji Outer Market', 'Tokyo Skytree'],
  },
  {
    id: 'dest-kyoto',
    name: 'Kyoto',
    country: 'Japan',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    description: 'The cultural heart of Japan with thousands of classical Buddhist temples, gardens, imperial palaces, and geishas.',
    costIndex: 'moderate',
    popularityScore: 98,
    averageDailyCost: 110,
    aliases: ['kyto', 'kioto', 'arashiyama', 'fushimi inari'],
    topAttractions: ['Fushimi Inari-taisha', 'Arashiyama Bamboo Grove', 'Kinkaku-ji (Golden Pavilion)', 'Gion District'],
  },
  {
    id: 'dest-osaka',
    name: 'Osaka',
    country: 'Japan',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80',
    description: 'Japans street food kitchen, famous for takoyaki, okonomiyaki, vibrant Dotonbori neon signs, and Osaka Castle.',
    costIndex: 'moderate',
    popularityScore: 96,
    averageDailyCost: 95,
    aliases: ['dotonbori', 'kansai', 'osaca'],
    topAttractions: ['Dotonbori Neon Canal', 'Osaka Castle', 'Universal Studios Japan', 'Kuromon Ichiba Market'],
  },
  {
    id: 'dest-seoul',
    name: 'Seoul',
    country: 'South Korea',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80',
    description: 'K-pop dynamic capital where royal Joseon palaces meet high-tech smart cities, street food night markets, and skincare boutiques.',
    costIndex: 'moderate',
    popularityScore: 97,
    averageDailyCost: 90,
    aliases: ['korea', 'south korea', 'gangnam', 'myeongdong', 'seol'],
    topAttractions: ['Gyeongbokgung Palace', 'Myeongdong Night Market', 'N Seoul Tower', 'Bukchon Hanok Village'],
  },

  // --- SOUTHEAST ASIA & MIDDLE EAST ---
  {
    id: 'dest-bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: 'Tropical paradise featuring emerald rice terraces, cliffside Uluwatu temples, world-class surfing, and beach clubs.',
    costIndex: 'budget',
    popularityScore: 98,
    averageDailyCost: 55,
    aliases: ['ubud', 'canggu', 'seminyak', 'uluwatu', 'denpasar'],
    topAttractions: ['Tegallalang Rice Terrace', 'Uluwatu Temple Sunset', 'Sacred Monkey Forest', 'Mount Batur Sunrise'],
  },
  {
    id: 'dest-bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80',
    description: 'Ornate golden shrines, lively street food alleys on Yaowarat road, floating markets, and pulsating nightlife.',
    costIndex: 'budget',
    popularityScore: 98,
    averageDailyCost: 50,
    aliases: ['krung thep', 'thailand', 'siam', 'bkk'],
    topAttractions: ['The Grand Palace', 'Wat Arun', 'Chatuchak Weekend Market', 'Chao Phraya Dinner Cruise'],
  },
  {
    id: 'dest-singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
    description: 'Futuristic garden city renowned for Gardens by the Bay, Marina Bay Sands infinity pool, and Michelin-rated hawker stalls.',
    costIndex: 'luxury',
    popularityScore: 97,
    averageDailyCost: 140,
    aliases: ['singapor', 'lion city', 'marina bay', 'changi'],
    topAttractions: ['Gardens by the Bay', 'Marina Bay Sands SkyPark', 'Sentosa Island', 'Jewel Changi Waterfall'],
  },
  {
    id: 'dest-dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-modern desert metropolis with Burj Khalifa, opulent shopping malls, luxury yacht cruises, and dune desert safaris.',
    costIndex: 'luxury',
    popularityScore: 98,
    averageDailyCost: 160,
    aliases: ['dxb', 'uae', 'emirates', 'burj khalifa'],
    topAttractions: ['Burj Khalifa Observation Deck', 'Dubai Mall & Fountain', 'Red Dune Desert Safari', 'Palm Jumeirah'],
  },

  // --- EUROPE ---
  {
    id: 'dest-paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'The City of Light, celebrated for the Eiffel Tower, the Louvre museum, haute cuisine, romantic Seine cruises, and Parisian cafes.',
    costIndex: 'luxury',
    popularityScore: 99,
    averageDailyCost: 160,
    aliases: ['pari', 'city of light', 'france paris', 'eiffel'],
    topAttractions: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise', 'Montmartre & Sacré-Cœur', 'Champs-Élysées'],
  },
  {
    id: 'dest-london',
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    description: 'Global cultural epicenter featuring Big Ben, red double-decker buses, West End theater shows, and historic royal palaces.',
    costIndex: 'luxury',
    popularityScore: 99,
    averageDailyCost: 170,
    aliases: ['uk', 'england', 'britain', 'big ben', 'londn'],
    topAttractions: ['Big Ben & Parliament', 'London Eye', 'Tower of London & Tower Bridge', 'British Museum'],
  },
  {
    id: 'dest-rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    description: 'The Eternal City with iconic Colosseum, Roman Forum, Vatican City, Trevi Fountain, and authentic pasta and gelato.',
    costIndex: 'moderate',
    popularityScore: 98,
    averageDailyCost: 130,
    aliases: ['roma', 'eternal city', 'colosseum', 'vatican'],
    topAttractions: ['Colosseum & Forum', 'Vatican Museums & Sistine Chapel', 'Trevi Fountain', 'Pantheon'],
  },
  {
    id: 'dest-barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
    description: 'Gaudís architectural wonderland with the Sagrada Família, Park Güell, Mediterranean beaches, and tapas bars on La Rambla.',
    costIndex: 'moderate',
    popularityScore: 97,
    averageDailyCost: 110,
    aliases: ['barclona', 'bcn', 'catalonia', 'sagrada familia'],
    topAttractions: ['Sagrada Família', 'Park Güell', 'Gothic Quarter', 'Barceloneta Beach', 'Casa Batlló'],
  },
  {
    id: 'dest-amsterdam',
    name: 'Amsterdam',
    country: 'Netherlands',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80',
    description: 'Historic canal rings, bicycle-friendly streets, Van Gogh museum, Anne Frank House, and picturesque gabled townhouses.',
    costIndex: 'luxury',
    popularityScore: 96,
    averageDailyCost: 140,
    aliases: ['amstredam', 'holland', 'netherlands', 'ams'],
    topAttractions: ['Canal Ring Cruise', 'Van Gogh Museum', 'Rijksmuseum', 'Anne Frank House', 'Jordaan District'],
  },
  {
    id: 'dest-prague',
    name: 'Prague',
    country: 'Czech Republic',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80',
    description: 'The City of a Hundred Spires with fairytale Prague Castle, Charles Bridge cobblestones, and world-renowned Czech pilsner.',
    costIndex: 'budget',
    popularityScore: 95,
    averageDailyCost: 65,
    aliases: ['praha', 'czechia', 'charles bridge'],
    topAttractions: ['Charles Bridge Sunrise', 'Prague Castle', 'Old Town Square & Astronomical Clock'],
  },
  {
    id: 'dest-santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    description: 'Whitewashed cliffside villas, cobalt blue church domes, volcanic caldera panoramas, and legendary Oia sunsets.',
    costIndex: 'luxury',
    popularityScore: 97,
    averageDailyCost: 175,
    aliases: ['thira', 'oia', 'fira', 'greek islands', 'greece'],
    topAttractions: ['Oia Sunset Walk', 'Caldera Catamaran Cruise', 'Red Beach', 'Akrotiri Archaeological Site'],
  },
  {
    id: 'dest-switzerland',
    name: 'Interlaken & Swiss Alps',
    country: 'Switzerland',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    description: 'Snowcapped Jungfrau peaks, turquoise alpine lakes, glacier train journeys, and scenic valley hiking trails.',
    costIndex: 'luxury',
    popularityScore: 96,
    averageDailyCost: 210,
    aliases: ['zurich', 'interlaken', 'jungfrau', 'zermatt', 'swiss alps'],
    topAttractions: ['Jungfraujoch Top of Europe', 'Lake Brienz Cruise', 'Lauterbrunnen Waterfalls Valley'],
  },

  // --- AMERICAS & OCEANIA ---
  {
    id: 'dest-newyork',
    name: 'New York City',
    country: 'United States',
    region: 'Americas',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    description: 'The Big Apple with Times Square, Central Park, Broadway musicals, world-class museums, and iconic skyline views.',
    costIndex: 'luxury',
    popularityScore: 99,
    averageDailyCost: 220,
    aliases: ['nyc', 'new york', 'manhattan', 'brooklyn', 'big apple'],
    topAttractions: ['Times Square', 'Central Park', 'Statue of Liberty', 'Empire State Building', 'High Line & Hudson Yards'],
  },
  {
    id: 'dest-sanfrancisco',
    name: 'San Francisco',
    country: 'United States',
    region: 'Americas',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
    description: 'The Golden Gate Bridge, historic cable cars, Fisherman Wharf sea lions, Victorian Painted Ladies, and Napa Valley gateway.',
    costIndex: 'luxury',
    popularityScore: 95,
    averageDailyCost: 195,
    aliases: ['sf', 'bay area', 'golden gate', 'california'],
    topAttractions: ['Golden Gate Bridge Walk', 'Alcatraz Island Tour', 'Fishermans Wharf', 'Cable Car Ride'],
  },
  {
    id: 'dest-sydney',
    name: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    description: 'Sydney Opera House, sunny Bondi Beach coastal walks, Harbour Bridge climbs, and vibrant Pacific waterfront dining.',
    costIndex: 'moderate',
    popularityScore: 96,
    averageDailyCost: 140,
    aliases: ['sidney', 'australia', 'bondi', 'nsw'],
    topAttractions: ['Sydney Opera House', 'Bondi to Coogee Coastal Walk', 'Sydney Harbour Bridge Climb', 'Manly Ferry'],
  },
  {
    id: 'dest-cairo',
    name: 'Cairo',
    country: 'Egypt',
    region: 'Africa',
    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80',
    description: 'The Great Pyramids of Giza, the Sphinx, Nile river felucca sails, and treasures of King Tutankhamun in the Grand Museum.',
    costIndex: 'budget',
    popularityScore: 95,
    averageDailyCost: 45,
    aliases: ['giza', 'egypt', 'pyramids'],
    topAttractions: ['Great Pyramids of Giza', 'The Great Sphinx', 'Grand Egyptian Museum', 'Khan el-Khalili Bazaar'],
  },
  {
    id: 'dest-capetown',
    name: 'Cape Town',
    country: 'South Africa',
    region: 'Africa',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    description: 'Table Mountain cable car views, penguins at Boulders Beach, Cape Point dramatic cliffs, and world-class wine estates.',
    costIndex: 'budget',
    popularityScore: 94,
    averageDailyCost: 65,
    aliases: ['table mountain', 'south africa', 'cape town'],
    topAttractions: ['Table Mountain Aerial Cableway', 'Boulders Beach Penguin Colony', 'Cape Point & Good Hope', 'V&A Waterfront'],
  }
];

/**
 * Fuzzy search across all destinations with typo tolerance
 */
export function searchGlobalDestinations(query: string, availableCities: City[] = []): City[] {
  if (!query || !query.trim()) {
    return availableCities.length > 0
      ? availableCities
      : GLOBAL_DESTINATIONS.map(d => ({
          id: d.id,
          name: d.name,
          country: d.country,
          description: d.description,
          image: d.image,
          costIndex: d.costIndex,
          popularityScore: d.popularityScore,
          averageDailyCost: d.averageDailyCost,
          topAttractions: d.topAttractions,
        }));
  }

  const cleanQuery = query.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  // 1. Check existing available/seeded cities
  const matchedFromAvailable = availableCities.filter(c => {
    const nameClean = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const countryClean = c.country.toLowerCase().replace(/[^a-z0-9]/g, '');
    return nameClean.includes(cleanQuery) || countryClean.includes(cleanQuery) || cleanQuery.includes(nameClean);
  });

  // 2. Search Global Destinations dictionary
  const matchedFromGlobal = GLOBAL_DESTINATIONS.filter(dest => {
    const nameClean = dest.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const countryClean = dest.country.toLowerCase().replace(/[^a-z0-9]/g, '');
    const regionClean = dest.region.toLowerCase().replace(/[^a-z0-9]/g, '');

    // Direct match
    if (nameClean.includes(cleanQuery) || cleanQuery.includes(nameClean)) return true;
    if (countryClean.includes(cleanQuery) || regionClean.includes(cleanQuery)) return true;

    // Aliases match (e.g. 'ahemdabad' -> Ahmedabad, 'bombay' -> Mumbai)
    if (dest.aliases && dest.aliases.some(alias => {
      const aliasClean = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
      return aliasClean.includes(cleanQuery) || cleanQuery.includes(aliasClean);
    })) {
      return true;
    }

    // Levenshtein fuzzy distance for short typos (e.g., 1-2 char edits)
    if (levenshteinDistance(nameClean, cleanQuery) <= 2) return true;

    return false;
  }).map(d => ({
    id: d.id,
    name: d.name,
    country: d.country,
    description: d.description,
    image: d.image,
    costIndex: d.costIndex,
    popularityScore: d.popularityScore,
    averageDailyCost: d.averageDailyCost,
    topAttractions: d.topAttractions,
  }));

  // Merge unique by city name
  const resultMap = new Map<string, City>();
  for (const c of [...matchedFromAvailable, ...matchedFromGlobal]) {
    const key = c.name.toLowerCase();
    if (!resultMap.has(key)) {
      resultMap.set(key, c);
    }
  }

  return Array.from(resultMap.values());
}

/**
 * Basic Levenshtein distance for fuzzy typo tolerance
 */
function levenshteinDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 99;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
