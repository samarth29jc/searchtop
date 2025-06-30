
export function validateName(name) {
    const trimmedName = name.trim();

    if (!trimmedName) {
        return { valid: false, message: 'Name is required' };
    }

    if (trimmedName.length < 2 || trimmedName.length > 50) {
        return { valid: false, message: 'Name must be between 2 and 50 characters' };
    }

    const nameRegex = /^[A-Za-z\s'-]+$/;    // Allow only letters, spaces, hyphens, apostrophes
    if (!nameRegex.test(trimmedName)) {
        return { valid: false, message: 'Letters only, no numbers or symbols.' };
    }

    // Basic sanitization to block scripts (in case someone tries to be clever)
    if (/<[^>]*script/.test(trimmedName)) {
        return { valid: false, message: 'Invalid characters in name' };
    }

    return { valid: true, message: '' };
}

export function validatePassword(password) {
    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
        return { valid: false, message: 'Password is required' }
    }

    if (trimmedPassword.length < 8 || trimmedPassword.length > 16) {
        return { valid: false, message: 'Password must be at least 6 characters' }
    }

    let strength = 0;
    if (trimmedPassword.length >= 8) strength++;
    if (/[A-Z]/.test(trimmedPassword)) strength++;
    if (/[a-z]/.test(trimmedPassword)) strength++;
    if (/^[A-Za-z][A-Za-z0-9!@#$%^&*]*$/.test(trimmedPassword)) strength++;

    let strengthMessage = '';
    let isValid = false

    switch (strength) {
        case 0:
        case 1:
            strengthMessage = 'Too Weak';
            break;
        case 2:
            strengthMessage = 'Fair';
            isValid = true;
            break;
        case 3:
            strengthMessage = 'Good';
            isValid = true;
            break;
        case 4:
            strengthMessage = 'Excellent';
            isValid = true;
            break;
        default:
            strengthMessage = '';
    }

    return {
        valid: isValid,
        strengthMessage: strengthMessage,
        message: '',
    };
}

export function validateEmail(email) {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
        return { valid: false, message: 'Email is required' };
    }

    const basicEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!basicEmailRegex.test(trimmedEmail)) {
        return { valid: false, message: 'Invalid email format' };
    }

    const [localPart, domain] = trimmedEmail.split('@');

    // Reject local or domain part if it’s just one repeating character (like aaaaaa or bbb)
    const isRepeating = (str) => /^([a-zA-Z0-9])\1{4,}$/.test(str); // 5+ repeating chars
    if (isRepeating(localPart) || isRepeating(domain.split('.')[0])) {
        return { valid: false, message: 'Too many repeating characters' };
    }

    return { valid: true, message: '' };
}