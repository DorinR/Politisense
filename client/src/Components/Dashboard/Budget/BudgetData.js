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
  },
  customTextFormatting: {
    textTransform: "capitalize"
  }
}));

export default function RepresentativeInfo(props) {
  const classes = useStyles();
  const [id] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("TEST 123");
  console.log(user);
  console.log("TEST 234");

  useEffect(() => {
    const db = new Firestore();
    db.Politician()
      .select()
      .then(snapshot => {
        console.log("Inside Snapshot");
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        snapshot.forEach(doc => {
          console.log(doc.id);
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
          <Typography className={classes.customHeadingText}>
            MEMBER ID
          </Typography>
          <span className={classes.customTextFormatting}>{id}</span>
        </CardContent>
      </Card>
      <Box m={1} />
    </ListItemText>
  );
}
