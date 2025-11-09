// Cloudflare Worker script for Google Places API proxy
// Deploy this to Cloudflare Workers (free tier)
// 
// Instructions:
// 1. Go to https://workers.cloudflare.com/
// 2. Create a new Worker
// 3. Paste this code
// 4. Add environment variable: GOOGLE_PLACES_API_KEY = your API key
// 5. Deploy and copy the Worker URL
// 6. Update GoogleBusinessWidget.jsx with the Worker URL

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const PLACE_ID = '0x476c898046747e89:0xbb72908da3e9e4d6';
    const API_KEY = env.GOOGLE_PLACES_API_KEY || 'AIzaSyC_kpuGAFWGthkAwn_wB_qz4F00Bdhxll8';

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
      // Note: Place ID from URL format (0x...) needs to be converted to standard format
      // Try using the Place ID directly first
      let encodedPlaceId = placeId;
      
      // If Place ID is in URL format (starts with 0x), try to use it as-is
      // Otherwise, encode it normally
      if (!placeId.startsWith('0x')) {
        encodedPlaceId = encodeURIComponent(placeId);
      }
      
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodedPlaceId}&fields=name,rating,user_ratings_total,reviews&key=${API_KEY}&language=sk`;
      
      const response = await fetch(detailsUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Places API HTTP error:', response.status, errorText);
        throw new Error(`Google Places API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      console.log('Google Places API response status:', data.status);
      if (data.status !== 'OK') {
        console.error('Google Places API error:', data.error_message || data.status);
      }

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

        return new Response(
          JSON.stringify({
            success: true,
            name: data.result.name,
            rating: data.result.rating || 5.0,
            reviewCount: data.result.user_ratings_total || 0,
            reviews: formattedReviews
          }),
          { headers: corsHeaders }
        );
      } else {
        // Return more detailed error information
        const errorMessage = data.error_message || `API returned status: ${data.status}`;
        console.error('Google Places API error details:', {
          status: data.status,
          error_message: data.error_message,
          place_id: placeId
        });
        
        return new Response(
          JSON.stringify({
            success: false,
            error: errorMessage,
            status: data.status,
            details: data.error_message || 'Unknown error'
          }),
          { status: 400, headers: corsHeaders }
        );
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || 'Failed to fetch reviews'
        }),
        { status: 500, headers: corsHeaders }
      );
    }
  }
};

