import FuseUtils from "@fuse/utils";
import jobResponse from "./jobResponse.json";
import jobDetailResponse from "./jobDetailResponse.json";
import axios from "axios";

class jobService extends FuseUtils.EventEmitter {
    getCronJobs (params: any) {
        return new Promise((resolve, reject) => {
          axios.get(`http://localhost:3000/jobs/all`, { params })
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

    // curl --location --request POST 'http://localhost:3000/jobs/trigger?cron_type=HouseholdData&city_id=HCMC&district_id=Q1&enable=false'
    updateJobStatus (params: {job: any, enable: boolean}) {
        return new Promise((resolve, reject) => {
          axios.post(`http://localhost:3000/jobs/trigger?cron_type=${params.job.cron_type}&city_id=${params.job.city_id}&district_id=${params.job.district_id}&enable=${params.enable}`)
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

    // curl --location 'http://localhost:3000/jobs/detail?cron_type=HouseholdData&city_id=HCMC&district_id=Q1'

    getJobDetail (params: {job: any}) {
        return new Promise((resolve, reject) => {
          axios.get(`http://localhost:3000/jobs/detail?cron_type=${params.job.cron_type}&city_id=${params.job.city_id}&district_id=${params.job.district_id}`)
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

    // curl --location --request POST 'http://localhost:3000/jobs/update?cron_type=HouseholdData&city_id=HCMC&district_id=Q1&distribution_type=Bell%20Curve&random_order=false&cron_time=4s'

    updateJobDetail (params: {data: any}) {
      return new Promise((resolve, reject) => {
        axios.post(`http://localhost:3000/jobs/update?cron_type=${params.data.cron_type}&city_id=${params.data.city_id}&district_id=${params.data.district_id}&distribution_type=${params.data.distribution_type}&random_order=${params.data.random_order}&cron_time=${params.data.cron_time}`)
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
  
