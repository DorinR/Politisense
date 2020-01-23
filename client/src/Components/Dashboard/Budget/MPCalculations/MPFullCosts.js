import React from "react";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

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

export default function MPFullCosts(props) {
  const classes = useStyles();

  return (
    <ListItemText>
      <Card>
        <CardContent className={classes.customCardContent}>
          <Typography className={classes.customHeadingText}>
            MP Total Costs: {Math.round(props.data)}
          </Typography>
        </CardContent>
      </Card>
      <Box m={1} />
    </ListItemText>
  );
}
