import FuseUtils from "@fuse/utils";
import deviceResponse from "./inactiveResponse.json";
import axios from "axios";

class deviceService extends FuseUtils.EventEmitter {
    searchInactiveDevice (params: {
      pageNumber?: number;
      pageSize?: number;
      dateTime?: boolean; 
    }) {
        return new Promise((resolve, reject) => {
          resolve(deviceResponse);
          // axios
          //   .get(`http://localhost:3001/devices/inactive`, { params })
          //   .then((response) => resolve(deviceResponse))
          //   // .then((response) => resolve(response))
          //   .catch(function (error) {
          //     if (error.response) {
          //       // The request was made and the server responded with a status code
          //       // that falls out of the range of 2xx
          //     } else if (error.request) {
          //       // The request was made but no response was received
          //       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          //       // http.ClientRequest in node.js
          //       console.log(error.request);
          //     } else {
          //       // Something happened in setting up the request that triggered an Error
          //       console.log("Error", error.message);
          //     }
    
          //     reject(error.response);
          //   });
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
  }}
  
  const instance = new deviceService();
  
  export default instance;
  
