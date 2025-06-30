import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

// const BASE_URL = 'https://api.vancipay.com/api/v1/';

const BASE_URL = 'https://api.axipays.com/api/v1/';

// const BASE_URL = 'https://api.vancipay.com';

const getHeaders = () => ({
	'Content-Type': 'application/json',
	Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
});

const handleError = (error) => {
	if (error.response) {
		// console.error('Error Response:', error.response.data);
		throw new Error(error.response.data.message || 'Server error occurred');
	} else if (error.request) {
		// console.error('No Response:', error.request);
		throw new Error('No response from server');
	} else {
		// console.error('Error:', error.message);
		throw new Error(error.message);
	}
};

const validateParams = (path, method, body) => {
	if (typeof path !== 'string' || !path) {
		throw new Error('Invalid or missing API path.');
	}
	const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
	if (!allowedMethods.includes(method)) {
		throw new Error(`Invalid HTTP method: ${method}. Allowed methods: ${allowedMethods.join(', ')}`);
	}
	if (body && typeof body !== 'object') {
		throw new Error('Invalid body parameter; must be an object.');
	}
};

const apiRequest = async (path, method = 'POST', body = null) => {
	try {
		validateParams(path, method, body);

		const response = await axios({
			url: `${BASE_URL}${path}`,
			method,
			headers: getHeaders(),
			data: body,
		});

		return response.data;
	} catch (error) {
		throw handleError(error);
	}
};

// Decode JWT token and store the extracted details
function decodeToken(token) {
	// console.log(token)
	// Check if token is a non-empty string
	if (typeof token !== 'string' || !token.trim()) {
		// console.error("Token is not a valid string");
		return null;
	}

	try {
		const decoded = jwtDecode(token);
		const requiredFields = ['userId', 'role', 'behavior', 'email', 'clientId'];
		requiredFields.forEach(field => {
			if (!(field in decoded)) {
				// console.warn(`Field "${field}" is missing in the decoded token`);
			}
		});
		// console.log(decoded)
		return decoded;
	} catch (error) {
		// console.error("Invalid token", error);
		return null;
	}
}

// Login service
export const login = async (email, password) => {
	try {
		const response = await apiRequest('auth/login', 'POST', { email, password });

		const loginData = response.data;
		// sessionStorage.clear();

		const decoded = decodeToken(loginData);
		// console.log(response)
		if (decoded) {
			sessionStorage.setItem('userName', decoded.username);
			sessionStorage.setItem('userId', decoded.userId);
			sessionStorage.setItem('role', decoded.role);
			sessionStorage.setItem('behavior', decoded.behavior);
			sessionStorage.setItem('email', decoded.email);
			sessionStorage.setItem('clientId', decoded.clientId);
			sessionStorage.setItem('authToken', loginData);
		}
	} catch (error) {
		throw error;
	}
};

// Signup service
export const signup = async (userDetails) => {
	try {
		const data = await apiRequest('auth/signup', 'POST', userDetails);
		// console.log('Signup Response:', data); 
		return data;
	} catch (error) {
		// console.error('Error during signup:', error);
		throw error;
	}
};

// Ensure prop-types for secure API calls
apiRequest.propTypes = {
	path: PropTypes.string.isRequired,
	method: PropTypes.oneOf(['GET', 'POST', 'PUT', 'DELETE']),
	body: PropTypes.object,
};