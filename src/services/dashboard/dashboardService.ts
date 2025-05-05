import FuseUtils from "@fuse/utils";
import axiosClient from "../axiosClient";

class dashboardService extends FuseUtils.EventEmitter {
    getCityData (params: {  
      time_start: string,
      time_end: string, 
      city: string
    }) {
        return new Promise((resolve, reject) => {
          axiosClient.get(`${import.meta.env.VITE_BASE_DATA_ACCESS_TIER}/api/meters/chart/usage?time_start=${params?.time_start}&time_end=${params?.time_end}&city=${params?.city}`)
          .then((response) => resolve(response))
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx 
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js  
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
            }
            reject(error.response);
          });
        });
      // } 
    }


   getUsageDataByDeviceId (params: {  
      time_start: string,
      time_end: string, 
      device_id: string
      time_slot: string
    }) {
      return new Promise((resolve, reject) => {
        axiosClient.get(`${import.meta.env.VITE_BASE_DATA_ACCESS_TIER}/api/meters/chart?device_id=${params?.device_id}&time_start=${params?.time_start}&time_end=${params?.time_end}&time_slot=${params?.time_slot}`)
        .then((response) => resolve(response))
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx 
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js  
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          reject(error.response); 
        })
      });
    }

   getUsageDataByDistrictId (params: {  
      time_start: string,
      time_end: string, 
      district_id: string
      time_slot: string
    }) {
      return new Promise((resolve, reject) => {
        axiosClient.get(`${import.meta.env.VITE_BASE_DATA_ACCESS_TIER}/api/meters/chart?device_id=${params?.district_id}&time_start=${params?.time_start}&time_end=${params?.time_end}&time_slot=${params?.time_slot}&bucket=ward`)
        .then((response) => resolve(response))
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx 
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js  
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          reject(error.response); 
        })
      });
    }

    getDailyData (params: {  
      time_start: string,
      time_end: string, 
      device_id: string
    }) {
      return new Promise((resolve, reject) => {
        axiosClient.get(`${import.meta.env.VITE_BASE_DATA_ACCESS_TIER}/api/meters/chart/daily?device_id=${params?.device_id}&time_start=${params?.time_start}&time_end=${params?.time_end}&multiplyBy=${1000}`)
        .then((response) => resolve(response))
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx 
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js  
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          reject(error.response); 
        })
      });
    }

    getPredictDailyData (params: {  
      time_start: string,
      time_end: string, 
      device_id: string
    }) {
      return new Promise((resolve, reject) => {
        axiosClient.get(`${import.meta.env.VITE_BASE_DATA_ACCESS_TIER}/api/meters/chart/predict-daily?device_id=${params?.device_id}&time_start=${params?.time_start}&time_end=${params?.time_end}&multiplyBy=${1000}`)
        .then((response) => resolve(response))
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx 
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js  
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          reject(error.response); 
        })
      });
    }

}
  
  const instance = new dashboardService();
  
  export default instance;
  
