import FuseUtils from "@fuse/utils";
import axiosClient from "../axiosClient";

class anomalyService extends FuseUtils.EventEmitter {
    searchAnomaly (params: any) {
        return new Promise((resolve, reject) => {
          axiosClient.get(`${import.meta.env.VITE_BASE_ANOMALY}/api/anomalies/${params?.type}`)
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

    searchAnomalyDetail (params: {
      data: any,
      deviceId: string
    }) {
        return new Promise((resolve, reject) => {
          const data = params.data.find((anomaly: any) => anomaly?.deviceId  === params.deviceId);
          resolve({data: data});
        });
    }
}
  
  const instance = new anomalyService();
  
  export default instance;
  
