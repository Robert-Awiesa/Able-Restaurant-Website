import { useState, useCallback } from 'react';

const INITIAL_STATE = {
  name:    '',
  email:   '',
  phone:   '',
  subject: '',
  message: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/;

function validate(fields) {
  const errors = {};

  if (!fields.name.trim())
    errors.name = 'Your name is required.';

  if (!fields.email.trim())
    errors.email = 'Your email is required.';
  else if (!EMAIL_REGEX.test(fields.email))
    errors.email = 'Enter a valid email address.';

  if (!fields.phone.trim())
    errors.phone = 'Your phone number is required.';
  else if (!PHONE_REGEX.test(fields.phone))
    errors.phone = 'Enter a valid phone number.';

  if (!fields.subject.trim())
    errors.subject = 'Please enter a subject.';

  if (!fields.message.trim())
    errors.message = 'Please enter your message.';

  return errors;
}

/**
 * useContactForm
 * Logic for the Contact Us form.
 */
export function useContactForm() {
  const [fields,    setFields]    = useState(INITIAL_STATE);
  const [errors,    setErrors]    = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Determine the base URL (matching AdminContext pattern)
      const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${BACKEND_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fields),
      });

      if (response.ok) {
        setSubmitted(true);
        setFields(INITIAL_STATE);
        setErrors({});
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to send message. Please try again.' });
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setErrors({ submit: 'Network error. Please check your connection.' });
    }
  }, [fields]);

  const reset = useCallback(() => {
    setSubmitted(false);
    setFields(INITIAL_STATE);
    setErrors({});
  }, []);

  return { fields, errors, submitted, handleChange, handleSubmit, reset };
}
