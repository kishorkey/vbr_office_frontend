
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const API = {
  LOGIN: `${BASE_URL}/login`,
  GET_USER_ROLES: `${BASE_URL}/getUserroles`,
  SAVE_USER: `${BASE_URL}/saveUser`,
  CREATE_USER: `${BASE_URL}/createUser`,
  VERIFY_USER: `${BASE_URL}/verifyUser?`,
 
  // Add more as needed...
};