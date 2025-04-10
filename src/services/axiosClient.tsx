import store from '@/store/store';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import axios from 'axios';

const axiosClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // Chỉ show message nếu response trả về có status ngoài khoảng 2xx
    if (!(response.status >= 200 && response.status < 300)) {
      store.dispatch(showMessage({
        type: 'error',
        text: 'Something went wrong!',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      }));
    }
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong!';

    store.dispatch(showMessage({
      type: 'error',
      text: message,
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
    }));

    return Promise.reject(error);
  }
);

export default axiosClient;
