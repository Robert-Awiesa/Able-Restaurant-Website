import { useState, useCallback } from 'react';

const INITIAL_STATE = {
  name:        '',
  phone:       '',
  foodName:    '',
  extras:      '',
  quantity:    1,
  dateTime:    '',
  address:     '',
  message:     '',
};

const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/;

function validate(fields) {
  const errors = {};

  if (!fields.name.trim())
    errors.name = 'Your name is required.';

  if (!fields.phone.trim())
    errors.phone = 'Your phone number is required.';
  else if (!PHONE_REGEX.test(fields.phone))
    errors.phone = 'Enter a valid phone number.';

  if (!fields.foodName.trim())
    errors.foodName = 'Please enter the food you want to order.';

  if (!fields.quantity || Number(fields.quantity) < 1)
    errors.quantity = 'Quantity must be at least 1.';

  if (!fields.dateTime)
    errors.dateTime = 'Please choose a delivery date and time.';
  else if (new Date(fields.dateTime) <= new Date())
    errors.dateTime = 'Delivery time must be in the future.';

  if (!fields.address.trim())
    errors.address = 'Your delivery address is required.';

  return errors;
}

/**
 * useOrderForm
 * Encapsulates all order-form logic: controlled state, validation, and submission.
 */
export function useOrderForm() {
  const [fields,   setFields]   = useState(INITIAL_STATE);
  const [errors,   setErrors]   = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // TODO: replace with real API call / form handler
    console.info('Order submitted:', fields);
    setSubmitted(true);
    setFields(INITIAL_STATE);
    setErrors({});
  }, [fields]);

  const reset = useCallback(() => {
    setSubmitted(false);
    setFields(INITIAL_STATE);
    setErrors({});
  }, []);

  return { fields, errors, submitted, handleChange, handleSubmit, reset };
}
