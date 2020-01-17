import React, { useState, useEffect } from "react";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import axios from "axios";
const Firestore = require("../../../Firebase").Firestore;

const useStyles = makeStyles(theme => ({
  customCardContent: {
    padding: 5,
    paddingBottom: "5px!important",
    backgroundColor: "#ffa500"
  },
  customHeadingText: {
    color: "#ffffff",
    fontStyle: "italic",
    fontWeight: "bold"
  },
  customTextFormatting: {
    textTransform: "capitalize"
  }
}));

export async function fetchOfficeSpending() {
  const db = new Firestore();
  const officeSpendingItems = [];

  await db
    .FinancialRecord()
    .where("parent", "==", "8-Offices")
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      snapshot.forEach(doc => {
        officeSpendingItems.push(doc.data());
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  return officeSpendingItems;
}

export function computeTotalOfficeSpending(spendingItems) {
  let total = 0;
  spendingItems.forEach(item => {
    total += item.amount;
  });
  return (total / spendingItems.length) * 9;
}

export default function TotalOfficeCosts() {
  const classes = useStyles();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function getData() {
      const officeSpendingItems = await fetchOfficeSpending();
      // add up all the spending items and assign that total to the "Total" variable
      setTotal(computeTotalOfficeSpending(officeSpendingItems));
    }
    getData();
  });

  return (
    <ListItemText>
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            Average Office Costs: {Math.round(total)}
          </Typography>
        </CardContent>
      </Card>
      <Box m={1} />
    </ListItemText>
  );
}
