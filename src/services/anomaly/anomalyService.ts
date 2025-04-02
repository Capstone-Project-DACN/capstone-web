import FuseUtils from "@fuse/utils";
import anomalyReponse from "./anomalyResponse.json";
import axios from "axios";

class anomalyService extends FuseUtils.EventEmitter {
    searchAnomaly (params: {
      pageNumber?: number;
      pageSize?: number;
      dateTime?: boolean; 
    }) {
        return new Promise((resolve, reject) => {
          resolve(anomalyReponse);
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
      // } 
    }

    searchAnomalyByType (params: {
      pageNumber?: number;
      pageSize?: number;
      dateTime?: boolean; 
      filterType: string,
    }) {
        return new Promise((resolve, reject) => {
          const anomalyData = anomalyReponse.anomalies.filter((item) => item.type === params.filterType);
          if(params.filterType === 'ALL') resolve({anomalies: anomalyReponse.anomalies});
          else resolve({anomalies: anomalyData});
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
      // } 
    }


    searchAnomalyDetail (params: {
      timestamp: string
    }) {
        return new Promise((resolve, reject) => {
          console.log(anomalyReponse.anomalies);
          const data = anomalyReponse.anomalies.find((anomaly: any) => anomaly.timestamp == params.timestamp);
          console.log(data);
          resolve({data: data});
        });
      // } 
    }
}
  
  const instance = new anomalyService();
  
  export default instance;
  
