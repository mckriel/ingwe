// services/api/auth.ts

// api configuration
const API_BASE_URL = process.env.PROPDATA_API_BASE_URL || "https://api-gw.propdata.net";
const API_USERNAME = process.env.PROPDATA_API_USERNAME || "";
const API_PASSWORD = process.env.PROPDATA_API_PASSWORD || "";

// response interfaces
interface token_response {
	access_token: string,
	token_type: string,
	expires_in: number,
}

interface api_error {
	error: string,
	error_description: string,
}

// token storage - use localStorage in development to persist across hot reloads
let token_data: {
	token: string;
	expires_at: number;
} | null = null;

// Try to load from localStorage in browser environment (development only)
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('propdata_token_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.expires_at > Date.now()) {
        token_data = parsed;
      }
    }
  } catch (e) {
    // Silently fail if localStorage is not available
  }
}

// AbortController factory with timeout
function createAbortController(timeout = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return {
    controller,
    timeoutId,
    signal: controller.signal,
    cleanup: () => clearTimeout(timeoutId)
  };
}

// Enhanced fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 30000): Promise<Response> {
  const { controller, signal, cleanup, timeoutId } = createAbortController(timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal
    });
    cleanup();
    return response;
  } catch (error) {
    cleanup();
    // Check if it's an AbortError (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request to ${url} timed out after ${timeout}ms`);
    }
    throw error;
  }
}

// get auth token from api
export async function get_token(): Promise<string> {
	// Check if we have a valid cached token
	if (token_data && token_data.expires_at > Date.now()) {
		return token_data.token;
	}

	// get a new token
	const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64");

	try {
		// Set up auth request
		const auth_url = `${API_BASE_URL}/users/public-api/login/`;
		const auth_headers = {
			"Authorization": `Basic ${credentials}`,
		};
		
		// Use enhanced fetch with a 30-second timeout
    const response = await fetchWithTimeout(auth_url, {
      method: "GET",
      headers: auth_headers,
      cache: "no-store",
    }, 30000);

		const response_text = await response.text();

		if (!response.ok) {
			let error_message = "Authentication failed";
			try {
				const error_data = JSON.parse(response_text);
				error_message = `Authentication failed: ${error_data.detail || error_data.error_description || error_data.message || JSON.stringify(error_data)}`;
			} catch (e) {
				error_message = `Authentication failed: ${response_text}`;
			}
			
			throw new Error(error_message);
		}

		let data;
		try {
			data = JSON.parse(response_text);
		} catch (error) {
			throw new Error(`Invalid response format from auth endpoint`);
		}

		// Extract token from the PropData API response format
		const token = data.clients?.[0]?.token;
		if (!token) {
			throw new Error(`Token not found in response`);
		}

		// Store token with expiration time (30 minutes minus 1 minute safety margin)
		token_data = {
			token: token,
			expires_at: Date.now() + (1800 - 60) * 1000,
		};
		
		// Save to localStorage in browser environment (development only)
		if (typeof window !== 'undefined') {
			try {
				localStorage.setItem('propdata_token_data', JSON.stringify(token_data));
			} catch (e) {
				// Silently fail if localStorage is not available
			}
		}
		
		return token_data.token;
	} catch (error) {
		// For API connectivity issues, provide a more helpful error message
		if (error instanceof Error) {
			if (error.message.includes('timed out') || error.message.includes('fetch failed')) {
				console.error(`API connection failed - please check your internet connection or API endpoint (${API_BASE_URL})`);
				
				// For development, provide mock data if environment variable is set
				if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
					console.log("Using mock data for development");
					// Return a fake token that will be rejected if actual API becomes available
					return "mock_development_token";
				}
			}
		}
		
		console.error(`Failed to get authentication token:`, error);
		throw error;
	}
}

// authentication request
export async function fetch_with_auth(endpoint: string, options: RequestInit = {}): Promise<Response> {
	try {
		const token = await get_token();

		// Don't attempt API requests with mock token
		if (token === "mock_development_token") {
			// For development mocking, return a mock response
			const mockResponse = new Response(JSON.stringify({
				count: 0,
				results: []
			}), {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return mockResponse;
		}

		// merge headers
		const headers = {
			"Authorization": `Bearer ${token}`,
			...options.headers,	
		};

		// Use enhanced fetch with a 30-second timeout
		return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
			...options,
			headers,
			cache: "no-store",
		}, 30000);
	} catch (error) {
		console.error("Error making authenticated request:", error);
		
		// For development, provide a mock response if environment variable is set
		if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true') {
			console.log("Using mock data for development");
			const mockResponse = new Response(JSON.stringify({
				count: 0,
				results: []
			}), {
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			});
			return mockResponse;
		}
		
		throw error;
	}
}

export async function renew_token(): Promise<string> {
	// Fixed condition: added missing ! before token_data.token
	if (!token_data || !token_data.token) {
		return get_token();
	}

	try {
		const response = await fetchWithTimeout(`${API_BASE_URL}/users/api/v1/renew-token/`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token_data.token}`,
			},
			cache: "no-store",
		}, 30000);

		if (!response.ok) {
			return get_token();
		}

		const data = await response.json();

		token_data = {
			token: data.token || data.access_token,
			expires_at: Date.now() + (data.expires_in || 1800 - 60) * 1000,
		};
		
		// Save to localStorage in browser environment (development only)
		if (typeof window !== 'undefined') {
			try {
				localStorage.setItem('propdata_token_data', JSON.stringify(token_data));
			} catch (e) {
				// Silently fail if localStorage is not available
			}
		}

		return token_data.token;
	} catch (error) {
		return get_token();
	}
}