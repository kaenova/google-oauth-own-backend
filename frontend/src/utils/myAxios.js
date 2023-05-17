import axios from "axios";

const myAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export default myAxios