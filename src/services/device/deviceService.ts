import FuseUtils from "@fuse/utils";
import { AxiosError, AxiosResponse } from "axios";
import axiosClient from "../axiosClient";

class deviceService extends FuseUtils.EventEmitter {
  constructor() {
    super();
    this.init();
  }

  init(): void {
    this.setInterceptors();
  }

  setInterceptors = (): void => {
    axiosClient.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    axiosClient.defaults.headers.common["Content-Type"] = "application/json";
    axiosClient.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (err: AxiosError) => {
        try {
          return await new Promise((resolve, reject) => {
            if (!err.response) {
              reject(err);
            }
            throw err;
          });
        } catch (err_1: any) {
        }
      }
    );
  };

//   curl --location '${import.meta.env.VITE_BASE_DEVICE_SERVICE}/devices/inactive?pageNumber=1&pageSize=100&dateTime=true' \
// --data ''
    searchInactiveDevice (params: {
      pageNumber?: number;
      pageSize?: number;
      dateTime?: boolean; 
    }) {
        return new Promise((resolve, reject) => {
          // resolve(deviceResponse);
          const finalParams = {
            pageNumber: params?.pageNumber || 1,
            pageSize: params?.pageSize || 100,
            dateTime: params?.dateTime || false
          }
          axiosClient
            .get(`${import.meta.env.VITE_BASE_DEVICE_SERVICE}/devices/inactive`, { params: finalParams })
            .then((response) => resolve(response))
            // .then((response) => resolve(response))
            .catch(function (error) {
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
              }
  
              reject(error.response);
            });
        });
      } 
 
    addHouseholdDevices = (params: {
      start?: number;
      end?: number;
      prefix?: string;
    }) => {
      const payload = params;

      return new Promise((resolve, reject) => {
        axiosClient
          .post(`${import.meta.env.VITE_BASE_DEVICE_SERVICE}/devices/add-multiple`, payload)
          .then((response) => resolve(response))
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }
  
            reject(error.response);
          });
      });
    };
 
    addAreaDevice(params: {
      deviceId: string
    }) {
      return new Promise((resolve, reject) => {
        axiosClient
          .post(`${import.meta.env.VITE_BASE_DEVICE_SERVICE}/devices/add`, params)
          .then((response) => resolve(response))
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }
  
            reject(error.response);
          });
    })
    }

    getDeviceTopics = () => {
      return new Promise((resolve, reject) => {
        axiosClient
          .get(`${import.meta.env.VITE_BASE_DEVICE_SERVICE}/devices/topics/all`)
          .then((response) => resolve(response))
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }

            reject(error.response);
          });
      });
    };

    getDevicesByTopic = (params: {topic: string}) => {
      return new Promise((resolve, reject) => {
        axiosClient
          .get(`${import.meta.env.VITE_BASE_DEVICE_SERVICE}/devices/get-by-topic/${params?.topic}`)
          .then((response) => resolve(response))
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }

            reject(error.response);
          });
      });
    };

    // curl --location '${import.meta.env.VITE_BASE_DEVICE_SERVICE}/devices/detail/household-HCMC-Q1-0'

    getDeviceDetail = (params: {deviceId: any}) => {
      return new Promise((resolve, reject) => {
        axiosClient
          .get(`${import.meta.env.VITE_BASE_DEVICE_SERVICE}/devices/detail/${params?.deviceId}`)
          .then((response) => resolve(response))
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }

            reject(error.response);  
          });
      });
    };

//     curl --location '${import.meta.env.VITE_BASE_DEVICE_SERVICE}/devices/remove' \
// --data '{
//     "deviceId": "id-0"
// }'
    removeDevice = (params: {deviceId: any}) => {
      return new Promise((resolve, reject) => {
        axiosClient.post(`${import.meta.env.VITE_BASE_DEVICE_SERVICE}/devices/remove`, params)
          .then((response) => resolve(response))
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }
            reject(error.response);
          })
      });
    };
}

const instance = new deviceService();

export default instance;
  
