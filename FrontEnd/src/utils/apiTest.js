// Utility to test API connection
import axios from 'axios';

export const testApiConnection = async () => {
  try {
    const response = await axios.get('/api/pub', { timeout: 5000 });
    console.log('✅ API connection successful:', response.status);
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', {
      message: error.message,
      code: error.code,
      response: error.response?.status,
      url: error.config?.url,
    });
    
    if (error.code === 'ECONNREFUSED' || error.request) {
      console.error('⚠️ Backend server is not running or not accessible on port 9090');
      console.error('Please start the Spring Boot application');
    }
    
    return false;
  }
};

