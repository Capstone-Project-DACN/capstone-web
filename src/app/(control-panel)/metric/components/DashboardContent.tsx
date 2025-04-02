import LineChart from "./components/LineChart";
import StatsWidget from "./components/StatsWidget";

const DataMetricMainContent = () => {
  return (
    <div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-10">
          <StatsWidget
            title="Devices"
            value={12500}
            trend={{
              value: 23,
              direction: "up",
            }}
            type="primary"
            perDay={true}
          />

          <StatsWidget
            title="Anomaly"
            value={95}
            trend={{
              value: 23,
              direction: "up",
            }}
            type="warning"
          />

          <StatsWidget
            title="Inactive"
            value={10}
            trend={{
              value: 23,
              direction: "up",
            }}
            type="warning"
          />

          <StatsWidget
            title="Average"
            value={25}
            trend={{
              value: 10,
              direction: "up",
            }}
            type="primary"
          />

          <StatsWidget
            title="Min - Max"
            value={95.4}
            secondValue={192225.4}
            trend={{
              value: 23,
              direction: "down",
            }}
            type="success"
          />
        </div>

        <div className="mt-10 shadow-sm">
          <LineChart /> 
        </div>
    </div>
   )
};

export default DataMetricMainContent;
