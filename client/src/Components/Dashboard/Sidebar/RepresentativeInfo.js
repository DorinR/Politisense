import React, { useState, useEffect } from "react";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
const Firestore = require("../../../Firebase").Firestore;

const useStyles = makeStyles(theme => ({
  customCardContent: {
    padding: 5,
    paddingBottom: "5px!important",
    backgroundColor: "#f7f7f7"
  },
  customHeadingText: {
    color: "#41aaa8",
    fontStyle: "italic",
    fontWeight: "bold"
  }
}));

export default function RepresentativeInfo(props) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [politicalParty, setPoliticalParty] = useState("");
  const [riding, setRiding] = useState("");
  const [yearElected, setYearElected] = useState(1000);

  useEffect(() => {
    let db = new Firestore();
    db.Politician()
      .select("name", "==", props.representativeToLoad)
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        snapshot.forEach(doc => {
          const { name, politicalParty, riding, yearElected } = doc.data();
          setName(name);
          setPoliticalParty(politicalParty);
          setYearElected(yearElected);
          setRiding(riding);
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  });
  return (
    <ListItemText>
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>NAME</Typography>
          {name}
        </CardContent>
      </Card>
      <Box m={1} />
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            POLITICAL PARTY
          </Typography>
          {politicalParty}
        </CardContent>
      </Card>
      <Box m={1} />
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>RIDING</Typography>
          {riding}
        </CardContent>
      </Card>
      <Box m={1} />
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            YEAR ELECTED
          </Typography>
          {yearElected}
        </CardContent>
      </Card>
    </ListItemText>
  );
}
