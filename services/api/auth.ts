// services/api/auth.ts

// Remove unused imports
// import { ApiError } from "next/dist/server/api-utils";
// import { headers } from "next/headers";

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
        console.log("Loaded token from localStorage");
        token_data = parsed;
      } else {
        console.log("Stored token expired or invalid");
      }
    }
  } catch (e) {
    console.error("Failed to load token from localStorage", e);
  }
}

// get auth token from api
export async function get_token(): Promise<string> {
	// Add debug log to trace token fetching
	console.log("get_token called, checking cache...");
	
	// Check if we have a valid cached token
	if (token_data && token_data.expires_at > Date.now()) {
		console.log("Using cached token");
		return token_data.token;
	}

	console.log("Token cache miss, fetching new token");
	// get a new token
	const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString("base64");

	try {
		// Enhanced logging for debugging
		const auth_url = `${API_BASE_URL}/users/public-api/login/`;
		const auth_headers = {
			"Authorization": `Basic ${credentials}`,
			// "User-Agent": "ingwe", // Removed User-Agent header to test if it's causing issues
		};
		
		console.log("NOTE: User-Agent header has been deliberately removed for testing");

		// Create obfuscated credentials for safe logging
		// By replacing all but first 3 and last 3 characters with asterisks
		let safe_credential_logging = "";
		if (API_USERNAME.length > 6) {
			safe_credential_logging = API_USERNAME.substring(0, 3) + 
				'*'.repeat(API_USERNAME.length - 6) + 
				API_USERNAME.substring(API_USERNAME.length - 3);
		} else if (API_USERNAME.length > 0) {
			safe_credential_logging = API_USERNAME[0] + '*'.repeat(API_USERNAME.length - 1);
		}
		
		console.log("=== AUTHENTICATION DEBUG INFO ===");
		console.log(`API Base URL: ${API_BASE_URL}`);
		console.log(`Auth endpoint: ${auth_url}`);
		console.log(`Full request URL: ${auth_url}`);
		console.log(`HTTP Method: GET`);
		console.log(`Username used (obfuscated): ${safe_credential_logging}`);
		console.log(`Username length: ${API_USERNAME.length}`);
		console.log(`Password length: ${API_PASSWORD.length}`);
		console.log(`Credentials Base64 length: ${credentials.length}`);
		console.log(`Credentials Base64 prefix: ${credentials.substring(0, 5)}...`);
		
		// Log the complete HTTP request as it would appear on the wire
		console.log("=== COMPLETE HTTP REQUEST ===");
		console.log(`GET /users/public-api/login/ HTTP/1.1
Host: ${new URL(auth_url).host}
Authorization: Basic ${credentials}
Accept: */*
`);
		console.log("================================");
		
		const response = await fetch(auth_url, {
			method: "GET",
			headers: auth_headers,
			cache: "no-store",
		});

		const response_text = await response.text();
		console.log(`Response status: ${response.status}`);
		console.log(`Response headers:`, JSON.stringify(Object.fromEntries([...response.headers.entries()]), null, 2));
		
		// Log a preview of the response body (limited to avoid exposing sensitive data)
		if (response_text.length > 0) {
			console.log(`Response preview (first 100 chars): ${response_text.substring(0, 100)}${response_text.length > 100 ? '...' : ''}`);
		} else {
			console.log(`Response body is empty`);
		}

		if (!response.ok) {
			let error_message = "Authentication failed";
			let error_details = {};
			
			try {
				const error_data = JSON.parse(response_text);
				error_details = error_data;
				error_message = `Authentication failed: ${error_data.detail || error_data.error_description || error_data.message || JSON.stringify(error_data)}`;
			} catch (e) {
				error_message = `Authentication failed: ${response_text}`;
			}
			
			console.error("=== AUTHENTICATION ERROR DETAILS ===");
			console.error(`Status: ${response.status} ${response.statusText}`);
			console.error(`Error message: ${error_message}`);
			console.error(`Error details:`, JSON.stringify(error_details, null, 2));
			console.error(`Response body: ${response_text}`);
			console.error("====================================");
			
			throw new Error(error_message);
		}

		let data;
		try {
			data = JSON.parse(response_text);
		} catch (error) {
			console.error(`Failed to parse response as JSON: ${response_text}`);
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
				console.log("Token saved to localStorage for persistence across hot reloads");
			} catch (e) {
				console.error("Failed to save token to localStorage", e);
			}
		}
		
		console.log("New token obtained and cached");
		return token_data.token;
	} catch (error) {
		console.error(`Failed to get authentication token: ${error}`);
		throw error; // Throw the original error for better debugging
	}
}

// authentication request
export async function fetch_with_auth(endpoint: string, options: RequestInit = {}): Promise<Response> {
	try {
		const token = await get_token();

		// merge headers
		const headers = {
			"Authorization": `Bearer ${token}`,
			// "User-Agent": "ingwe", // Removed User-Agent header to test if it's causing issues
			...options.headers,	
		};

		console.log(`Making authenticated request to: ${API_BASE_URL}${endpoint}`);
		return fetch(`${API_BASE_URL}${endpoint}`, {
			...options,
			headers,
			cache: "no-store",
		});
	} catch (error) {
		console.error("Error making authenticated request:", error);
		throw error;
	}
}

export async function renew_token(): Promise<string> {
	// Fixed condition: added missing ! before token_data.token
	if (!token_data || !token_data.token) {
		return get_token();
	}

	try {
		console.log("Renewing token");
		const response = await fetch(`${API_BASE_URL}/users/api/v1/renew-token/`, {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${token_data.token}`,
				// "User-Agent": "ingwe", // Removed User-Agent header to test if it's causing issues
			},
			cache: "no-store",
		});

		if (!response.ok) {
			console.error("Token renewal failed, getting new token");
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
				console.log("Renewed token saved to localStorage");
			} catch (e) {
				console.error("Failed to save renewed token to localStorage", e);
			}
		}

		console.log("Token renewed successfully");
		return token_data.token;
	} catch (error) {
		console.error("Failed to renew token:", error);
		return get_token();
	}
}