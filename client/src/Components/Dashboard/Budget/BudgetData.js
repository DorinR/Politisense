import React, { useState, useEffect, useCallback } from "react";
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
  },
  customTextFormatting: {
    textTransform: "capitalize"
  }
}));

export default function BudgetData() {
  const classes = useStyles();
  const [amount] = useState("");
  const [category] = useState("");
  const [member] = useState("");
  const [parent] = useState("");
  const [quarter] = useState("");
  const [repID, setRepID] = useState("");

  useEffect(() => {
    const db = new Firestore();
    db.Politician()
      .where("name", "==", "peter schiefke")
      .select()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        snapshot.forEach(doc => {
          setRepID(doc.id);
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
    console.log(repID);
    db.FinancialRecord()
      .where("member", "==", repID)
      .select()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        snapshot.forEach(doc => {
          // attributesAccumulator.push(doc.data());
          console.log(doc.data());
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
  });

  // }, []);
  return (
    <ListItemText>
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            Member: {member}
          </Typography>
        </CardContent>
      </Card>
      <Box m={1} />
    </ListItemText>
  );
}
