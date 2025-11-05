import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';

let isRegistered = false;

export const ensureChartsRegistered = () => {
  if (isRegistered) {
    return;
  }

  Chart.register(
    ArcElement,
    BarElement,
    CategoryScale,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
  );

  isRegistered = true;
};
