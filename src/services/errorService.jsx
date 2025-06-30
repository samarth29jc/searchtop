export const handleError = (error) => {
    // Log the error for debugging in development mode
    if (process.env.NODE_ENV === 'development') {
        // console.error('API Error:', error);
    }

    // Check for network errors
    if (!error.response) {
        return 'Network error. Please check your internet connection.';
    }

    // Handle specific HTTP errors (like 401 Unauthorized or 500 Internal Server Error)
    const { status, data } = error.response;
    switch (status) {
        case 400:
            return data.message || 'Bad request. Please check the input.';
        case 401:
            return 'Unauthorized. Please log in again.';
        case 500:
            return 'Server error. Please try again later.';
        default:
            return data.message || 'An error occurred. Please try again.';
    }
};
