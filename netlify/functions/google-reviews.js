// Netlify serverless function to fetch Google Places API reviews
// This acts as a proxy to avoid CORS issues

export const handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const PLACE_ID = '0x476c898046747e89:0xbb72908da3e9e4d6';
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyC_kpuGAFWGthkAwn_wB_qz4F00Bdhxll8';

  try {
    // First, try to find the place using text search
    let placeId = PLACE_ID;
    
    try {
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Grindcast+Studio+Bratislava&key=${API_KEY}&language=sk`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      if (searchData.status === 'OK' && searchData.results && searchData.results.length > 0) {
        const exactMatch = searchData.results.find(
          (place) => place.name.includes('Grindcast') || place.formatted_address?.includes('Bratislava')
        );
        if (exactMatch) {
          placeId = exactMatch.place_id;
        }
      }
    } catch (searchErr) {
      console.log('Text search failed, using original Place ID:', searchErr);
    }

    // Fetch place details with reviews
    const encodedPlaceId = encodeURIComponent(placeId);
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodedPlaceId}&fields=name,rating,user_ratings_total,reviews&key=${API_KEY}&language=sk`;
    
    const response = await fetch(detailsUrl);
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'OK' && data.result) {
      // Format reviews
      const formattedReviews = data.result.reviews
        ? data.result.reviews.slice(0, 3).map((review) => ({
            author: review.author_name,
            rating: review.rating,
            text: review.text,
            date: new Date(review.time * 1000).toLocaleDateString('sk-SK', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }),
            relativeTime: review.relative_time_description
          }))
        : [];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          name: data.result.name,
          rating: data.result.rating || 5.0,
          reviewCount: data.result.user_ratings_total || 0,
          reviews: formattedReviews
        })
      };
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: data.error_message || `API returned status: ${data.status}`
        })
      };
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Failed to fetch reviews'
      })
    };
  }
};

