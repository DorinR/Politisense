import React, { useState, useEffect } from "react";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import axios from "axios";
const Firestore = require("../../../../Firebase").Firestore;

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

export async function fetchRepId(representative) {
  const db = new Firestore();
  const ref = await db
    .Politician()
    .where("name", "==", representative)
    .select()
    .catch(console.error);
  const documentId = ref.docs[0].id;
  return documentId;
}

// =========== OFFICE COSTS ============
export async function fetchOfficeSpending(repID) {
  const db = new Firestore();
  const officeSpendingItems = [];

  await db
    .FinancialRecord()
    .where("member", "==", repID)
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
  return total;
}

// =========== TRAVEL COSTS ============
export async function fetchTravelSpending(repID) {
  const db = new Firestore();
  const travelSpendingItems = [];

  await db
    .FinancialRecord()
    .where("member", "==", repID)
    .where("parent", "==", "3-Travel")
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      snapshot.forEach(doc => {
        travelSpendingItems.push(doc.data());
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  return travelSpendingItems;
}

export function computeTotalTravelSpending(spendingItems) {
  let total = 0;
  spendingItems.forEach(item => {
    total += item.amount;
  });
  return total;
}

// =========== PRINTING COSTS ============
export async function fetchPrintingSpending(repID) {
  const db = new Firestore();
  const printingSpendingItems = [];

  await db
    .FinancialRecord()
    .where("member", "==", repID)
    .where("parent", "==", "7-Printing")
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      snapshot.forEach(doc => {
        printingSpendingItems.push(doc.data());
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  return printingSpendingItems;
}

export function computeTotalPrintingSpending(spendingItems) {
  let total = 0;
  spendingItems.forEach(item => {
    total += item.amount;
  });
  return total;
}

// =========== ADVERTISING COSTS ============
export async function fetchAdvertisingSpending(repID) {
  const db = new Firestore();
  const advertisingSpendingItems = [];

  await db
    .FinancialRecord()
    .where("member", "==", repID)
    .where("category", "==", "6-Advertising")
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      snapshot.forEach(doc => {
        advertisingSpendingItems.push(doc.data());
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  return advertisingSpendingItems;
}

export function computeTotalAdvertisingSpending(spendingItems) {
  let total = 0;
  spendingItems.forEach(item => {
    total += item.amount;
  });
  return total;
}

// =========== EMPLOYEE COSTS ============
export async function fetchEmployeeSpending(repID) {
  const db = new Firestore();
  const employeeSpendingItems = [];

  await db
    .FinancialRecord()
    .where("member", "==", repID)
    .where("category", "==", "1-Employees' salaries")
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      snapshot.forEach(doc => {
        employeeSpendingItems.push(doc.data());
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  return employeeSpendingItems;
}

export function computeTotalEmployeeSpending(spendingItems) {
  let total = 0;
  spendingItems.forEach(item => {
    total += item.amount;
  });
  return total;
}

// =========== GIFTS COSTS ============
export async function fetchGiftsSpending(repID) {
  const db = new Firestore();
  const giftsSpendingItems = [];

  await db
    .FinancialRecord()
    .where("member", "==", repID)
    .where("category", "==", "5-Gifts")
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      snapshot.forEach(doc => {
        giftsSpendingItems.push(doc.data());
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  return giftsSpendingItems;
}

export function computeTotalGiftsSpending(spendingItems) {
  let total = 0;
  spendingItems.forEach(item => {
    total += item.amount;
  });
  return total;
}

// =========== HOSPITALITY COSTS ============

export async function fetchHospitalitySpending(repID) {
  const db = new Firestore();
  const hospitalitySpendingItems = [];

  await db
    .FinancialRecord()
    .where("member", "==", repID)
    .where("category", "==", "4-Hospitality")
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }
      snapshot.forEach(doc => {
        hospitalitySpendingItems.push(doc.data());
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
  return hospitalitySpendingItems;
}

export function computeTotalHospitalitySpending(spendingItems) {
  let total = 0;
  spendingItems.forEach(item => {
    total += item.amount;
  });
  return total;
}

// =========== TOTAL BUDGET COSTS ============

export default function TotalBudgetCosts() {
  const classes = useStyles();
  const [total, setTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function getData() {
      /* eslint-disable */
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const { email } = user;
        // get riding
        const riding = await fetchUserRiding(email);

        // get representative for that riding
        const representative = await fetchRepresentative(riding);

        // get the ID of that representative
        // const representativeId = await fetchRepId(representative);

        // get all the individual spending records for this politician
        const officeSpendingItems = await fetchOfficeSpending(representativeId);
        // const hospitalitySpendingItems = await fetchHospitalitySpending(
        //   representativeId
        // );
        // const giftsSpendingItems = await fetchGiftsSpending(representativeId);
        // const advertisingSpendingItems = await fetchAdvertisingSpending(
        //   representativeId
        // );
        // const travelSpendingItems = await fetchTravelSpending(representativeId);
        // const employeeSpendingItems = await fetchEmployeeSpending(
        //   representativeId
        // );
        // const printingSpendingItems = await fetchPrintingSpending(
        //   representativeId
        // );

        // add up all the spending items and assign that total to the "Total" variable
        setTotal(computeTotalOfficeSpending(officeSpendingItems));
      }
    }
    getData();
  });

  return (
    <ListItemText>
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            Office Costs: {Math.round(total)}
          </Typography>
        </CardContent>
      </Card>
      <Box m={1} />
    </ListItemText>
  );
}
