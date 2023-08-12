import axios from "axios";
import backendPort from "../utils/config";
const baseUrl = `${backendPort}/login`;

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

export default { login };
