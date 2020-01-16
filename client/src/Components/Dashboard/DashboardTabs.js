import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Dashboard from "./Dashboard";
import BillHistoryTable from "./PastBills/BillHistoryTable";
import BudgetData from "./Budget/BudgetData";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import BarChartIcon from "@material-ui/icons/BarChart";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import TotalTravelCosts from "./Budget/TotalTravelCosts";
import TotalOfficeCosts from "./Budget/TotalOfficeCosts";
import TotalPrintingCosts from "./Budget/TotalPrintingCosts";
import TotalHospitalityCosts from "./Budget/TotalHospitalityCosts";
import TotalGiftsCosts from "./Budget/TotalGiftsCosts";
import TotalEmployeeCosts from "./Budget/TotalEmployeeCosts";
import TotalAdvertisingCosts from "./Budget/TotalAdvertisingCosts";
import AverageAdvertising from "./Budget/AverageAdvertising";
import AverageEmployee from "./Budget/AverageEmployee";
import AverageGifts from "./Budget/AverageGifts";
import AverageHospitality from "./Budget/AverageHospitality";
import AverageTravel from "./Budget/AverageTravel";
import AverageOffice from "./Budget/AverageOffice";
import AveragePrinting from "./Budget/AveragePrinting";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

export default function DashboardTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box p={5}>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
            aria-label="scrollable force tabs example"
          >
            <Tab
              label="Visualization"
              icon={<BarChartIcon />}
              {...a11yProps(0)}
            />
            <Tab
              label="Voting History"
              icon={<AccountBalanceIcon />}
              {...a11yProps(1)}
            />
            <Tab label="Budget" icon={<AttachMoneyIcon />} {...a11yProps(0)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Dashboard />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <BillHistoryTable />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <BudgetData />
          <TotalEmployeeCosts />
          <AverageEmployee />
          <TotalAdvertisingCosts />
          <AverageAdvertising />
          <TotalGiftsCosts />
          <AverageGifts />
          <TotalHospitalityCosts />
          <AverageHospitality />
          <TotalTravelCosts />
          <AverageTravel />
          <TotalOfficeCosts />
          <AverageOffice />
          <TotalPrintingCosts />
          <AveragePrinting />
        </TabPanel>
      </div>
    </Box>
  );
}
