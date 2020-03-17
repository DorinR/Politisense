/* eslint-disable no-undef */
/* eslint-env node */
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Login from "./Components/Auth/Login";
import SignUp from "./Components/Auth/SignUp";
import Navbar from "./Components/Navbar";
import Logout from "./Components/Logout";
import UserAccountTabs from "./Components/Dashboard/UserAccount/UserAccountTabs";
import MapWrapper from "./Components/Dashboard/MapWrapper";
import Questionnaire from "./Components/Questionnaire";
import MyMP from "./Components/MyMP/MyMP";
import CategoryDashboard from "./Components/Dashboard/CategoryDashboard";
import BillHistoryTable from "./Components/Dashboard/PastBills/BillHistoryTable";
import BudgetContainer from "./Components/Dashboard/Budget/BudgetContainer";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/styles";
import { useMediaQuery } from "@material-ui/core";
import Sidebar from "./Components/Navbar";
import Topbar from "./Components/Topbar";
import CompareContainer from "./Components/Dashboard/Compare/CompareContainer";
import GeneralDashboard from "./Components/Dashboard/GeneralDashboard";
const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 56,
    height: "100%",
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64
    }
  },
  shiftContent: {
    paddingLeft: 240
  },
  content: {
    height: "100%"
  }
}));

const App = () => {
  // const { children } = props;
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true
  });
  const [openSidebar, setOpenSidebar] = useState(false);
  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };
  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };
  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  const LoginContainer = () => (
    <div className="container">
      <Route exact path="/" render={() => <Redirect to="/login" />} />
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
    </div>
  );
  const DefaultContainer = () => (
    <div>
      {/*<Navbar>*/}
      <div
        className={clsx({
          [classes.root]: true,
          [classes.shiftContent]: isDesktop
        })}
      >
        <Sidebar
          onClose={handleSidebarClose}
          open={shouldOpenSidebar}
          variant={isDesktop ? "persistent" : "temporary"}
        >
          {" "}
        </Sidebar>
        <Topbar onSidebarOpen={handleSidebarOpen} />

        <div>
          <Route exact path="/" render={() => <Redirect to="/login" />} />
          <PrivateRoute path="/logout" component={Logout} />
          <PrivateRoute path="/map" component={MapWrapper} />
          <PrivateRoute path="/account" component={UserAccountTabs} />
          <PrivateRoute path="/general" component={GeneralDashboard} />
          <PrivateRoute path="/myMp" component={MyMP} />
          <PrivateRoute path="/categories" component={CategoryDashboard} />
          <PrivateRoute path="/votingHistory" component={BillHistoryTable} />
          <PrivateRoute path="/budget" component={BudgetContainer} />
          <PrivateRoute path="/compare" component={CompareContainer} />
        </div>
      </div>
      {/*</Navbar>*/}
    </div>
  );

  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("user") ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" /> // eslint-disable-next-line
        )
      }
    />
  );

  return (
    <Router>
      <Switch>
        <Route exact path="/(login)" component={LoginContainer} />
        <Route exact path="/signup" component={LoginContainer} />
        <Route exact path="/question" component={Questionnaire} />
        <Route component={DefaultContainer} />
      </Switch>
    </Router>
  );
};

export default App;
