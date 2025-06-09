// src/utils/validation.js
const Validation = {
    // Email validation
    isValidEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    // Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
    isValidPassword: (password) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      return passwordRegex.test(password);
    },
    
    // Phone number validation
    isValidPhone: (phone) => {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      return phoneRegex.test(phone);
    },
    
    // Name validation (only letters, spaces, hyphens, and apostrophes)
    isValidName: (name) => {
      const nameRegex = /^[a-zA-Z\s'-]+$/;
      return nameRegex.test(name);
    },
    
    // Postal/ZIP code validation (supports various formats)
    isValidPostalCode: (code) => {
      // This regex supports common postal code formats from various countries
      const postalRegex = /^[a-zA-Z0-9\s-]{3,10}$/;
      return postalRegex.test(code);
    },
    
    // Credit card validation (simple Luhn algorithm check)
    isValidCreditCard: (number) => {
      // Remove spaces and dashes
      number = number.replace(/[\s-]/g, '');
      
      if (!/^\d+$/.test(number)) return false;
      
      // Luhn algorithm
      let sum = 0;
      let shouldDouble = false;
      
      for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));
        
        if (shouldDouble) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
      }
      
      return sum % 10 === 0;
    },
    
    // Credit card expiry validation (MM/YY format, not expired)
    isValidExpiryDate: (expiry) => {
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!expiryRegex.test(expiry)) return false;
      
      const [month, year] = expiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month), 0);
      const currentDate = new Date();
      
      return expiryDate > currentDate;
    },
    
    // CVV validation (3-4 digits)
    isValidCVV: (cvv) => {
      const cvvRegex = /^\d{3,4}$/;
      return cvvRegex.test(cvv);
    },
    
    // Form validation for user registration
    validateRegistration: (formData) => {
      const errors = {};
      
      if (!formData.name) {
        errors.name = 'Name is required';
      } else if (!Validation.isValidName(formData.name)) {
        errors.name = 'Please enter a valid name';
      }
      
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!Validation.isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (!Validation.isValidPassword(formData.password)) {
        errors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    },
    
    // Form validation for checkout
    validateCheckout: (formData) => {
      const errors = {};
      
      // Shipping information validation
      if (!formData.name) errors.name = 'Name is required';
      if (!formData.address) errors.address = 'Address is required';
      if (!formData.city) errors.city = 'City is required';
      if (!formData.state) errors.state = 'State/Province is required';
      if (!formData.zipCode) {
        errors.zipCode = 'ZIP/Postal code is required';
      } else if (!Validation.isValidPostalCode(formData.zipCode)) {
        errors.zipCode = 'Please enter a valid ZIP/Postal code';
      }
      
      // Payment information validation
      if (formData.paymentMethod === 'credit_card') {
        if (!formData.cardNumber) {
          errors.cardNumber = 'Card number is required';
        } else if (!Validation.isValidCreditCard(formData.cardNumber)) {
          errors.cardNumber = 'Please enter a valid card number';
        }
        
        if (!formData.expiry) {
          errors.expiry = 'Expiry date is required';
        } else if (!Validation.isValidExpiryDate(formData.expiry)) {
          errors.expiry = 'Please enter a valid expiry date (MM/YY)';
        }
        
        if (!formData.cvv) {
          errors.cvv = 'CVV is required';
        } else if (!Validation.isValidCVV(formData.cvv)) {
          errors.cvv = 'Please enter a valid CVV';
        }
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }
  };
  
  export default Validation;