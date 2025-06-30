import axios from 'axios';
import PropTypes from 'prop-types';
import { handleError } from '../services/errorService'; // External error handling module (you can create this)

// API base URL

// const BASE_URL = 'https://api.vancipay.com/';

const BASE_URL = 'https://api.axipays.com/';

// const BASE_URL = 'https://api.vancipay/';

// Secure headers for all requests
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `${sessionStorage.getItem('authToken')}`,  // Example of using stored token for auth
});

// Validate parameters
const validateParams = (path, method, body) => {
    if (typeof path !== 'string' || !path) {
        throw new Error('Invalid or missing API path.');
    }
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (!allowedMethods.includes(method)) {
        throw new Error(`Invalid HTTP method: ${method}. Allowed methods: ${allowedMethods.join(', ')}`);
    }
    if (body && typeof body !== 'object') {
        throw new Error('Invalid body parameter; must be an object.');
    }
};

// Reusable API request handler
export const apiRequest = async (path, method = 'GET', body = null) => {
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
        if (error.response?.status === 404) {
            return null; 
        }
        return handleError(error);
    }
};


// Ensure prop-types for secure API calls
apiRequest.propTypes = {
    path: PropTypes.string.isRequired,
    method: PropTypes.oneOf(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
    body: PropTypes.object,
};
