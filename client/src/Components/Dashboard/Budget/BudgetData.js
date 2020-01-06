import React, { useState, useEffect, useCallback } from "react";
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

export async function fetchUserRiding(userEmail) {
  let result = "";
  await axios
    .get(`http://localhost:5000/api/users/${userEmail}/getUser`)
    .then(res => {
      if (res.data.success) {
        const riding = res.data.data.riding;
        result = riding;
      }
    })
    .catch(err => console.error(err));
  return result;
}

export async function fetchRepresentative(riding) {
  let result = "";
  await axios
    .get(
      `http://localhost:5000/api/representatives/${riding}/getRepresentative`
    )
    .then(res => {
      if (res.data.success) {
        const representative = res.data.data.name;
        result = representative;
      }
    })
    .catch(err => console.error(err));
  return result;
}

export default function BudgetData() {
  const classes = useStyles();
  const [amount] = useState("");
  const [category] = useState("");
  const [member] = useState("");
  const [parent] = useState("");
  const [quarter] = useState("");
  const [repID, setRepID] = useState("");
  const [userRepresentative, setUserRepresentative] = useState("");

  useEffect(() => {
    const db = new Firestore();

    async function getData() {
      /* eslint-disable */
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const { email } = user;
        const riding = await fetchUserRiding(email);
        const representative = await fetchRepresentative(riding);
        setUserRepresentative(representative);
        localStorage.setItem("rep", JSON.stringify(representative));
      }
    }
    getData();
    db.Politician()
      .where("name", "==", userRepresentative)
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
    db.FinancialRecord()
      .where("member", "==", repID)
      .select()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }
        snapshot.forEach(doc => {
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
