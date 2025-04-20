import FuseUtils from "@fuse/utils";
import axiosClient from "../axiosClient";
// import axios from "axios";

 

class jobService extends FuseUtils.EventEmitter {
    getCronJobs (params: any) {
        return new Promise((resolve, reject) => {
          axiosClient.get(`${import.meta.env.VITE_BASE_JOB_SERVICE}/jobs/all`, { params })
            .then((response) => {
              const jobResponseUpdate = response.data.data.map((job: any, index: any) => ({...job, id:index }));
              resolve({...response.data, data: jobResponseUpdate});
            })
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

    updateJobStatus (params: {job: any, enable: boolean}) {
        return new Promise((resolve, reject) => {
          axiosClient.post(`${import.meta.env.VITE_BASE_JOB_SERVICE}/jobs/trigger?cron_type=${params.job.cron_type}&city_id=${params.job.city_id}&district_id=${params.job.district_id}&enable=${params.enable}}`)
            .then((response) => resolve({id: params.job.id, status: params.enable ? "running" : "stopped"}))
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
            // resolve({id: params.id, status: params.status});
        });
      // } 
    }

    getJobDetail (params: {job: any}) {
        return new Promise((resolve, reject) => {
          axiosClient.get(`${import.meta.env.VITE_BASE_JOB_SERVICE}/jobs/detail?cron_type=${params.job.cron_type}&city_id=${params.job.city_id}&district_id=${params.job.district_id}`)
            .then((response) => resolve(response.data))
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
    }


    getDistributionData (params: {job: any}) {
      return new Promise((resolve, reject) => {
        const job = params.job;
        axiosClient.get(`${import.meta.env.VITE_BASE_JOB_SERVICE}/jobs/chart?cron_type=${job.cron_type}&city_id=${job.city_id}&district_id=${job.district_id}`)
        .then((res) => {
          resolve(res);
        })
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
      })
    }

    updateJobDetail (params: {data: any}) {
      return new Promise((resolve, reject) => {
        axiosClient.post(`${import.meta.env.VITE_BASE_JOB_SERVICE}/jobs/update?cron_type=${params.data.cron_type}&city_id=${params.data.city_id}&district_id=${params.data.district_id}&distribution_type=${params.data.distribution_type}&random_order=${params.data.random_order}&cron_time=${params.data.cron_time}&start_id=${params.data.start_id}&end_id=${params.data.end_id}&custom_date=${params.data.date.split('T')[0]}`)
          .then((response) => resolve(response.data))
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
  }   
}

  const instance = new jobService();
  
  export default instance;
  
