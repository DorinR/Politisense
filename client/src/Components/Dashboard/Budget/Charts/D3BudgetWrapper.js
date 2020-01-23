import BarPieChart from "../BarPieCharts";
import BarChart from "../BarChart";

export default class BarChartWrapper extends Component {
  componentDidMount() {
    switch (this.props.type) {
      case "bar-pie":
        return new BarPieChart(this.refs.chart);
      case "bar":
        return new BarChart(this.refs.chart);
      default:
        return new DonutChart(this.refs.chart);
    }
  }
}
