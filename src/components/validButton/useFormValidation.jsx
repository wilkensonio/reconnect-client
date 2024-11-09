import { useEffect, useState } from 'react';

const useFormValidation = (fields, validate) => {
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(validate(fields));
  }, [fields, validate]);

  return isFormValid;
};

export default useFormValidation;
