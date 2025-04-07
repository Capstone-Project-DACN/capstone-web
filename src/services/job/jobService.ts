import FuseUtils from "@fuse/utils";
import jobResponse from "./jobResponse.json";
import jobDetailResponse from "./jobDetailResponse.json";

class jobService extends FuseUtils.EventEmitter {
    getCronJobs (params: any) {
        return new Promise((resolve, reject) => {
          const jobResponseUpdate = jobResponse.data.map((job: any, index: any) => ({...job, id:index }));
          resolve({...jobResponse, data: jobResponseUpdate});
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
    };

    updateJobStatus (params: {id: number, status: string}) {
        return new Promise((resolve, reject) => {
            resolve({id: params.id, status: params.status});
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

    getJobDetail (params: {id: number}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve({id: params.id, data: jobDetailResponse.data}), 250)
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
}
  
  const instance = new jobService();
  
  export default instance;
  
