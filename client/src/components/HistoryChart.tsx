import { Bar } from "react-chartjs-2";

export const HistoryChart = ({ chartData }: any) => {
  return (
    <div className="chart-container">
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Statut du serveur",
            },
            legend: {
              display: false,
            },
          },
          animation:{
            duration: 0
          }
        }}
      />
    </div>
  );
};
