export const validateRequiredFields = (fields: string[]): boolean | null => {
    for (const field of fields) {
      if (!field) {
        return false
      }
    }
    return true;
  };
  
  export const validatePassword = (password: string): boolean | null => {
    const passwordValidationRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordValidationRegex.test(password)) {
      return  false;
    }
    return true;
  };
  