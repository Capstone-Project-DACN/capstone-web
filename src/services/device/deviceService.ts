import FuseUtils from "@fuse/utils";
import deviceResponse from "./inactiveResponse.json";
import topicsResponse from "./topicsResponse.json";
import devicesResponse from "./devicesResponse.json";
import axios, { AxiosError, AxiosResponse } from "axios";

class deviceService extends FuseUtils.EventEmitter {
  constructor() {
    super();
    this.init();
  }

  init(): void {
    this.setInterceptors();
  }

  setInterceptors = (): void => {
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.interceptors.response.use(
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

//   curl --location 'http://localhost:3001/devices/inactive?pageNumber=1&pageSize=100&dateTime=true' \
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
          axios
            .get(`http://localhost:3001/devices/inactive`, { params: finalParams })
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
        axios
          .post(`http://localhost:3001/devices/add-multiple`, payload)
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
        axios
          .post(`http://localhost:3001/devices/add`, params)
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
        axios
          .get(`http://localhost:3001/devices/topics/all`)
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
        axios
          .get(`http://localhost:3001/devices/get-by-topic/${params?.topic}`)
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

    // curl --location 'http://localhost:3001/devices/detail/household-HCMC-Q1-0'

    getDeviceDetail = (params: {deviceId: any}) => {
      return new Promise((resolve, reject) => {
        axios
          .get(`http://localhost:3001/devices/detail/${params?.deviceId}`)
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

//     curl --location 'http://localhost:3001/devices/remove' \
// --data '{
//     "deviceId": "id-0"
// }'
    removeDevice = (params: {deviceId: any}) => {
      return new Promise((resolve, reject) => {
        axios.post(`http://localhost:3001/devices/remove`, params)
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
  
