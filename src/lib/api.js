const API_KEY = process.env.NEXT_PUBLIC_PERENUAL_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_PERENUAL_BASE_URL || 'https://perenual.com/api';

export async function getPlants(page = 1) {
  try {
    // Check if API key is available, fallback to mock data if not
    if (!API_KEY) {
      console.warn('❌ API key not found, using mock data');
      console.log('Environment check - API_KEY:', typeof API_KEY, API_KEY);
      return getMockPlants();
    }
    
    console.log('✅ API key found, attempting real API call...');
    console.log('Using API key:', API_KEY.substring(0, 10) + '...');
    const response = await fetch(
      `${BASE_URL}/species-list?key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData['X-RateLimit-Exceeded'] || response.status === 429) {
        console.warn('API rate limit exceeded, using mock data');
        return getMockPlants();
      }
      throw new Error(`Failed to fetch plants: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('🎉 Real API data received! Total plants:', data.total);
    console.log('First plant:', data.data[0]?.common_name);
    
    // Check if response indicates rate limit exceeded
    if (data['X-RateLimit-Exceeded']) {
      console.warn('API rate limit exceeded, using mock data');
      return getMockPlants();
    }
    
    // Add random pricing and sunlight defaults to each plant
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(plant => addSunlightDefaults({
        ...plant,
        price: generateRandomPrice()
      }));
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching plants, falling back to mock data:', error);
    return getMockPlants();
  }
}

function getMockPlants() {
  return {
    data: [
      { id: 1, common_name: 'Marble Queen', scientific_name: 'Epipremnum aureum', default_image: { medium_url: '/api/placeholder/300/200' }, price: generateRandomPrice(), sunlight: ['part shade'] },
      { id: 2, common_name: 'Neon Pothos', scientific_name: 'Epipremnum aureum', default_image: { medium_url: '/api/placeholder/300/200' }, price: generateRandomPrice(), sunlight: ['part shade'] },
      { id: 3, common_name: 'Syngonium Rayii', scientific_name: 'Syngonium podophyllum', default_image: { medium_url: '/api/placeholder/300/200' }, price: generateRandomPrice(), sunlight: ['full sun', 'part shade'] },
      { id: 4, common_name: 'Pineapple', scientific_name: 'Ananas comosus', default_image: { medium_url: '/api/placeholder/300/200' }, price: generateRandomPrice(), sunlight: ['full sun'] },
      { id: 5, common_name: 'African Milk Tree', scientific_name: 'Euphorbia trigona', default_image: { medium_url: '/api/placeholder/300/200' }, price: generateRandomPrice(), sunlight: ['full sun'] },
      { id: 6, common_name: 'Pothos', scientific_name: 'Epipremnum aureum', default_image: { medium_url: '/api/placeholder/300/200' }, price: generateRandomPrice(), sunlight: ['part shade'] },
      { id: 7, common_name: 'Chinese Evergreen', scientific_name: 'Aglaonema', default_image: { medium_url: '/api/placeholder/300/200' }, price: generateRandomPrice(), sunlight: ['part shade'] },
      { id: 8, common_name: 'Peace Lily', scientific_name: 'Spathiphyllum wallisii', default_image: { medium_url: '/api/placeholder/300/200' }, price: generateRandomPrice(), sunlight: ['part shade'] },
      { id: 9, common_name: 'Snake Plant', scientific_name: 'Sansevieria trifasciata', default_image: { medium_url: '/api/placeholder/300/200' }, price: generateRandomPrice(), sunlight: ['full sun', 'part shade'] },
    ],
    to: 30,
    per_page: 30,
    current_page: 1,
    from: 1,
    last_page: 100,
    total: 3000
  };
}

export async function getPlantById(id) {
  try {
    // Check if API key is available, fallback to mock data if not
    if (!API_KEY) {
      console.warn('API key not found, using mock plant details');
      return getMockPlantDetails(id);
    }
    const response = await fetch(
      `${BASE_URL}/v2/species/details/${id}?key=${API_KEY}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData['X-RateLimit-Exceeded'] || response.status === 429) {
        console.warn('API rate limit exceeded, using mock plant details');
        return getMockPlantDetails(id);
      }
      throw new Error(`Failed to fetch plant details: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if response indicates rate limit exceeded
    if (data['X-RateLimit-Exceeded']) {
      console.warn('API rate limit exceeded, using mock plant details');
      return getMockPlantDetails(id);
    }
    
    // Add random pricing and sunlight defaults to the plant
    if (data && typeof data === 'object') {
      const enhancedData = addSunlightDefaults({
        ...data,
        price: generateRandomPrice()
      });
      return enhancedData;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching plant details, using mock data:', error);
    return getMockPlantDetails(id);
  }
}

function getMockPlantDetails(id) {
  // Mock some indoor plants and outdoor plants for demonstration
  const indoorPlantIds = [1, 2, 6, 7, 8, 9];
  const isIndoor = indoorPlantIds.includes(parseInt(id));
  
  return {
    id: parseInt(id),
    common_name: `Plant ${id}`,
    scientific_name: `Plantus ${id}`,
    indoor: isIndoor,
    outdoor: !isIndoor,
    watering: 'Average',
    sunlight: isIndoor ? ['part shade'] : ['full sun'],
    care_level: 'Medium',
    price: generateRandomPrice(),
    default_image: {
      medium_url: '/api/placeholder/300/200'
    },
    description: `This is a ${isIndoor ? 'beautiful indoor' : 'hardy outdoor'} plant perfect for your ${isIndoor ? 'home' : 'garden'}.`
  };
}

export async function getIndoorOutdoorPlants(page = 1, maxPlants = 50) {
  try {
    const plants = await getPlants(page);
    const indoorPlants = [];
    const outdoorPlants = [];
    
    if (!plants.data || plants.data.length === 0) {
      return { indoor: [], outdoor: [] };
    }

    console.log(`📊 Categorizing ${plants.data.length} plants from page ${page}...`);
    
    for (const plant of plants.data.slice(0, Math.min(maxPlants, plants.data.length))) {
      // Use intelligent categorization based on plant name and characteristics
      const isIndoor = isIndoorPlant(plant);
      
      if (isIndoor) {
        indoorPlants.push({...plant, indoor: true});
      } else {
        outdoorPlants.push({...plant, indoor: false});
      }
    }
    
    console.log(`🏠 Found ${indoorPlants.length} indoor plants, 🌳 ${outdoorPlants.length} outdoor plants`);
    
    return {
      indoor: indoorPlants,
      outdoor: outdoorPlants
    };
  } catch (error) {
    console.error('Error categorizing plants:', error);
    return { indoor: [], outdoor: [] };
  }
}

// Intelligent function to determine if a plant is suitable for indoor growing
function isIndoorPlant(plant) {
  const name = (plant.common_name || plant.scientific_name || '').toLowerCase();
  
  // Common indoor plants
  const indoorKeywords = [
    'pothos', 'philodendron', 'monstera', 'snake plant', 'sansevieria',
    'peace lily', 'spathiphyllum', 'rubber plant', 'ficus elastica',
    'chinese evergreen', 'aglaonema', 'spider plant', 'chlorophytum',
    'zz plant', 'zamioculcas', 'dracaena', 'prayer plant', 'maranta',
    'fiddle leaf fig', 'aloe', 'jade plant', 'crassula', 'begonia',
    'african violet', 'saintpaulia', 'orchid', 'anthurium', 'calathea',
    'bromeliad', 'christmas cactus', 'schlumbergera', 'boston fern',
    'nephrolepis', 'bird of paradise', 'strelitzia', 'parlor palm',
    'chamaedorea', 'areca palm', 'dypsis', 'majesty palm', 'ravenea',
    'kentia palm', 'howea', 'yucca', 'dieffenbachia', 'croton',
    'codiaeum', 'schefflera', 'hoya', 'peperomia', 'pilea'
  ];
  
  // Trees and large outdoor plants
  const outdoorKeywords = [
    'oak', 'maple', 'pine', 'fir', 'spruce', 'cedar', 'elm', 'ash',
    'birch', 'willow', 'poplar', 'cherry', 'apple', 'plum', 'peach',
    'magnolia', 'dogwood', 'redbud', 'linden', 'sycamore', 'hickory',
    'walnut', 'chestnut', 'beech', 'hornbeam', 'hawthorn', 'crabapple',
    'serviceberry', 'elderberry', 'sumac', 'buckeye', 'tulip tree',
    'sweetgum', 'liquidambar', 'catalpa', 'locust', 'honey locust',
    'tree', 'shrub', 'bush', 'hedge', 'climbing', 'vine'
  ];
  
  // Check for indoor plant indicators
  const isIndoorMatch = indoorKeywords.some(keyword => name.includes(keyword));
  const isOutdoorMatch = outdoorKeywords.some(keyword => name.includes(keyword));
  
  // If explicitly matched as outdoor, return false
  if (isOutdoorMatch && !isIndoorMatch) {
    return false;
  }
  
  // If explicitly matched as indoor, return true
  if (isIndoorMatch) {
    return true;
  }
  
  // For ambiguous cases, use additional heuristics
  // Small plants, succulents, and tropical plants are often indoor-friendly
  const smallPlantIndicators = ['dwarf', 'mini', 'compact', 'small'];
  const tropicalIndicators = ['tropical', 'houseplant', 'indoor'];
  
  const hasSmallIndicator = smallPlantIndicators.some(indicator => name.includes(indicator));
  const hasTropicalIndicator = tropicalIndicators.some(indicator => name.includes(indicator));
  
  if (hasSmallIndicator || hasTropicalIndicator) {
    return true;
  }
  
  // Default: assume outdoor for unrecognized plants
  return false;
}

export async function searchPlants(query, page = 1) {
  try {
    // Check if API key is available, fallback to mock data if not
    if (!API_KEY) {
      console.warn('API key not found, using mock search data');
      return getMockSearchResults(query);
    }
    const response = await fetch(
      `${BASE_URL}/species-list?key=${API_KEY}&page=${page}&q=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData['X-RateLimit-Exceeded'] || response.status === 429) {
        console.warn('API rate limit exceeded, using mock search data');
        return getMockSearchResults(query);
      }
      throw new Error(`Failed to search plants: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if response indicates rate limit exceeded
    if (data['X-RateLimit-Exceeded']) {
      console.warn('API rate limit exceeded, using mock search data');
      return getMockSearchResults(query);
    }
    
    // Add random pricing and sunlight defaults to each plant in search results
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(plant => addSunlightDefaults({
        ...plant,
        price: generateRandomPrice()
      }));
    }
    
    return data;
  } catch (error) {
    console.error('Error searching plants, falling back to mock data:', error);
    return getMockSearchResults(query);
  }
}

function getMockSearchResults(query) {
  const allMockPlants = [
    { id: 1, common_name: 'Marble Queen', scientific_name: 'Epipremnum aureum', family: 'Araceae', genus: 'Epipremnum', care_level: 'Easy', price: generateRandomPrice(), sunlight: ['part shade'] },
    { id: 2, common_name: 'Neon Pothos', scientific_name: 'Epipremnum aureum', family: 'Araceae', genus: 'Epipremnum', care_level: 'Easy', price: generateRandomPrice(), sunlight: ['part shade'] },
    { id: 3, common_name: 'Syngonium Rayii', scientific_name: 'Syngonium podophyllum', family: 'Araceae', genus: 'Syngonium', care_level: 'Medium', price: generateRandomPrice(), sunlight: ['full sun', 'part shade'] },
    { id: 4, common_name: 'Pineapple', scientific_name: 'Ananas comosus', family: 'Bromeliaceae', genus: 'Ananas', care_level: 'Hard', price: generateRandomPrice(), sunlight: ['full sun'] },
    { id: 5, common_name: 'African Milk Tree', scientific_name: 'Euphorbia trigona', family: 'Euphorbiaceae', genus: 'Euphorbia', care_level: 'Easy', price: generateRandomPrice(), sunlight: ['full sun'] },
    { id: 6, common_name: 'Pothos', scientific_name: 'Epipremnum aureum', family: 'Araceae', genus: 'Epipremnum', care_level: 'Easy', price: generateRandomPrice(), sunlight: ['part shade'] },
    { id: 7, common_name: 'Chinese Evergreen', scientific_name: 'Aglaonema commutatum', family: 'Araceae', genus: 'Aglaonema', care_level: 'Medium', price: generateRandomPrice(), sunlight: ['part shade'] },
    { id: 8, common_name: 'Peace Lily', scientific_name: 'Spathiphyllum wallisii', family: 'Araceae', genus: 'Spathiphyllum', care_level: 'Medium', price: generateRandomPrice(), sunlight: ['part shade'] },
    { id: 9, common_name: 'Snake Plant', scientific_name: 'Sansevieria trifasciata', family: 'Asparagaceae', genus: 'Sansevieria', care_level: 'Easy', price: generateRandomPrice(), sunlight: ['full sun', 'part shade'] },
    { id: 10, common_name: 'Fiddle Leaf Fig', scientific_name: 'Ficus lyrata', family: 'Moraceae', genus: 'Ficus', care_level: 'Hard', price: generateRandomPrice(), sunlight: ['full sun', 'part shade'] },
    { id: 11, common_name: 'Monstera Deliciosa', scientific_name: 'Monstera deliciosa', family: 'Araceae', genus: 'Monstera', care_level: 'Medium', price: generateRandomPrice(), sunlight: ['part shade'] },
    { id: 12, common_name: 'Rubber Plant', scientific_name: 'Ficus elastica', family: 'Moraceae', genus: 'Ficus', care_level: 'Easy', price: generateRandomPrice(), sunlight: ['full sun', 'part shade'] },
    { id: 13, common_name: 'Boston Fern', scientific_name: 'Nephrolepis exaltata', family: 'Nephrolepidaceae', genus: 'Nephrolepis', care_level: 'Medium', price: generateRandomPrice(), sunlight: ['part shade'] },
    { id: 14, common_name: 'Spider Plant', scientific_name: 'Chlorophytum comosum', family: 'Asparagaceae', genus: 'Chlorophytum', care_level: 'Easy', price: generateRandomPrice(), sunlight: ['part shade'] },
    { id: 15, common_name: 'ZZ Plant', scientific_name: 'Zamioculcas zamiifolia', family: 'Araceae', genus: 'Zamioculcas', care_level: 'Easy', price: generateRandomPrice(), sunlight: ['part shade'] }
  ];
  
  if (!query.trim()) {
    return { data: [], suggestions: [] };
  }
  
  const searchTerm = query.toLowerCase();
  const filteredPlants = allMockPlants.filter(plant =>
    plant.common_name.toLowerCase().includes(searchTerm) ||
    plant.scientific_name.toLowerCase().includes(searchTerm)
  );
  
  // Generate suggestions for autocomplete
  const suggestions = allMockPlants
    .filter(plant => 
      plant.common_name.toLowerCase().startsWith(searchTerm) ||
      plant.scientific_name.toLowerCase().startsWith(searchTerm)
    )
    .slice(0, 5)
    .map(plant => plant.common_name);
  
  return {
    data: filteredPlants.slice(0, 20).map(plant => ({
      ...plant,
      default_image: { medium_url: '/api/placeholder/300/200' }
    })),
    suggestions
  };
}

export function generateRandomPrice() {
  // Generate realistic plant prices between $15 and $85
  return Math.floor(Math.random() * (85 - 15 + 1)) + 15;
}

// Add reasonable sunlight defaults based on plant characteristics
function addSunlightDefaults(plant) {
  if (plant.sunlight && Array.isArray(plant.sunlight)) {
    return plant; // Already has sunlight data
  }
  
  const plantName = (plant.common_name || plant.scientific_name || '').toLowerCase();
  
  // Plants that prefer partial shade
  const shadeLovers = [
    'fern', 'boston fern', 'maidenhair fern', 'bird nest fern',
    'hosta', 'coral bells', 'heuchera', 
    'begonia', 'impatiens', 'coleus', 
    'caladium', 'astilbe', 'bleeding heart',
    'pothos', 'aglaonema', 'spathiphyllum', 'peace lily', 'chinese evergreen', 
    'marble queen', 'neon pothos', 'monstera', 'spider plant', 
    'zz plant', 'zamioculcas', 'philodendron',
    'japanese maple', 'maple', 'dogwood', 'redbud',
    'azalea', 'rhododendron', 'camellia', 'hydrangea'
  ];
                      
  // Plants that can handle both full sun and partial shade
  const flexible = [
    'snake plant', 'sansevieria', 'rubber plant', 'ficus', 'fiddle leaf', 
    'syngonium', 'dracaena', 'monstera',
    'rose', 'lavender', 'salvia', 'peony', 
    'daylily', 'black eyed susan', 'coneflower',
    'oak', 'cherry', 'apple', 'pear',
    'boxelder', 'holly', 'viburnum'
  ];
  
  // Determine sunlight requirements
  let sunlight = ['full sun']; // Default for most outdoor plants
  
  if (shadeLovers.some(shade => plantName.includes(shade))) {
    sunlight = ['part shade'];
  } else if (flexible.some(flex => plantName.includes(flex))) {
    sunlight = ['full sun', 'part shade'];
  }
  
  return {
    ...plant,
    sunlight
  };
}