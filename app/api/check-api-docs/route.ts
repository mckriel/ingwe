import { NextRequest, NextResponse } from 'next/server';
import { fetch_with_auth } from '@/services/api/auth';

export async function POST(request: NextRequest) {
  try {
    // Try accessing the API docs at different possible endpoints
    const endpoints = [
      '/api/', 
      '/docs/',
      '/schema/',
      '/swagger/',
      '/openapi/'
    ];
    
    let successfulResponse = null;
    let availableEndpoints = {};
    
    // Try each docs endpoint
    for (const endpoint of endpoints) {
      try {
        console.log(`Checking API docs at: ${endpoint}`);
        const response = await fetch_with_auth(endpoint);
        
        if (response.ok) {
          console.log(`Found API docs at: ${endpoint}`);
          const contentType = response.headers.get('content-type');
          
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            successfulResponse = { 
              endpoint, 
              data,
              contentType
            };
            break;
          } else {
            console.log(`Found endpoint but not JSON: ${contentType}`);
          }
        }
      } catch (endpointError) {
        console.error(`Error checking docs at ${endpoint}:`, endpointError);
      }
    }
    
    // If we didn't find API docs, try looking at mashup API
    if (!successfulResponse) {
      try {
        console.log('Trying generic API list endpoint...');
        const apiListResponse = await fetch_with_auth('/mashup/api/v1/');
        
        if (apiListResponse.ok) {
          const apiList = await apiListResponse.json();
          availableEndpoints = apiList;
          console.log('Found API list at /mashup/api/v1/');
        }
      } catch (error) {
        console.error('Error checking API list:', error);
      }
    }
    
    // As a fallback, let's check for specific endpoints we know about
    // Create a list of endpoints to try
    const specificEndpoints = [
      '/mashup/api/v1/residential/',
      '/mashup/api/v1/property-types/',
      '/listings/api/v1/residential/',
      '/listings/api/v1/property-types/',
      '/lookups/api/v1/property-types/',
      '/propertydata/api/v1/property-types/'
    ];

    const endpointResults: Record<string, any> = {};

    for (const endpoint of specificEndpoints) {
      try {
        console.log(`Checking specific endpoint: ${endpoint}`);
        const response = await fetch_with_auth(endpoint);

        endpointResults[endpoint] = {
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type')
        };
        
        // If the endpoint exists, try to get its structure
        if (response.ok) {
          try {
            const data = await response.json();
            
            // Just store a subset of the data to keep the response size manageable
            if (data.count !== undefined && data.results !== undefined) {
              endpointResults[endpoint].structure = {
                count: data.count,
                hasResults: Array.isArray(data.results),
                resultsCount: Array.isArray(data.results) ? data.results.length : 0,
                sampleResult: Array.isArray(data.results) && data.results.length > 0 
                  ? data.results[0] 
                  : null
              };
            } else {
              endpointResults[endpoint].structure = {
                keys: Object.keys(data),
                isArray: Array.isArray(data),
                length: Array.isArray(data) ? data.length : undefined,
                sampleItem: Array.isArray(data) && data.length > 0 ? data[0] : null
              };
            }
          } catch (jsonError) {
            endpointResults[endpoint].parseError = 'Failed to parse JSON response';
          }
        }
      } catch (endpointError) {
        endpointResults[endpoint] = {
          error: 'Failed to access endpoint',
          status: 0,
          ok: false
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      docsFound: !!successfulResponse,
      docsEndpoint: successfulResponse?.endpoint || null,
      docsData: successfulResponse?.data || null,
      endpoints: availableEndpoints,
      specificEndpoints: endpointResults
    });
  } catch (error) {
    console.error('Error checking API docs:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}