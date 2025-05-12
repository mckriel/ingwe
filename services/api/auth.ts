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

// token storage
let token_data: {
	token: string;
	expires_at: number;
} | null = null;

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
		console.log(`Making auth request to: ${API_BASE_URL}/users/public-api/login/`);
		const response = await fetch(`${API_BASE_URL}/users/public-api/login/`, {
			method: "GET",
			headers: {
				"Authorization": `Basic ${credentials}`,
          		"User-Agent": "ingwe",
			},
			cache: "no-store",
		});

		const response_text = await response.text();
		console.log(`Response status: ${response.status}`);

		if (!response.ok) {
			let error_message = "Authentication failed";
			try {
				const error_data = JSON.parse(response_text);
				error_message = `Authentication failed: ${error_data.detail || error_data.error_description}`;
			} catch (e) {
				error_message = `Authentication failed: ${response_text}`;
			}
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
			"User-Agent": "ingwe",
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
				"User-Agent": "ingwe",
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

		console.log("Token renewed successfully");
		return token_data.token;
	} catch (error) {
		console.error("Failed to renew token:", error);
		return get_token();
	}
}