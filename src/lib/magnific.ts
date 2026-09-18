import axios from 'axios'

const MAGNIFIC_API_KEY = import.meta.env.VITE_MAGNIFIC_API_KEY
const MAGNIFIC_BASE_URL = 'https://api.magnific.ai'

export const magnificClient = axios.create({
  baseURL: MAGNIFIC_BASE_URL,
  headers: {
    'x-api-key': MAGNIFIC_API_KEY,
    'Content-Type': 'application/json',
  },
})
