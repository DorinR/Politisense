import BarPieChart from "../BarPieCharts";
import BarChart from "../BarChart";
import D3Chart from "../D3BudgetChart";

export default class BarChartWrapper extends Component {
  componentDidMount() {
    switch (this.props.type) {
      case "bar-pie":
        return new BarPieChart(this.refs.chart);
      case "bar":
        return new BarChart(this.refs.chart);
      default:
        return new D3BudgetChart(
          this.refs.chart,
          this.props.data,
          this.props.categoryType
        );
    }
  }
}
