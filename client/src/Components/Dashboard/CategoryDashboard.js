import React from 'react'
import CategoryGrid from './CategoryGrid'
import {Card, CardHeader, IconButton, CardContent, Divider} from "@material-ui/core";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import clsx from "clsx";
import DescriptionDialog from "../MyMP/DescriptionDialog";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '`calc(100% - 1px)%',
        // width: `calc(100% - 20px)`,
        // [theme.breakpoints.up('lg')]: {
        //     height: "90%"}
    },
    content: {
        padding: 0
    },
    image: {
        height: 48,
        width: 48
    },
    title: {
        color: "#263238",
        fontSize: "16px",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontWeight: 700
    },
    actions: {
        justifyContent: 'flex-end',
    }
}));
export default function CategoryDashboard (props) {
    const { className, ...rest } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    };
    const handleClose = () => {
        setOpen(false)
    };

    return (
      <div>
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
          <CardHeader
              classes={{
                title: classes.title,
              }}
              title="MP's Voting Record Based on your interests "
              action={
                <IconButton aria-label="settings">
                  <HelpOutlineIcon onClick={handleClickOpen}/>
                </IconButton>
              }
          />
            <Divider />
            <CardContent>
              <CategoryGrid />
          </CardContent>
            <DescriptionDialog open = {open}
                               onClose={handleClose}
                               d3={true}
                               explaination={{title:"Voting Record Based on Your Interests",
                                          body:"In this section, you can know more about your MP based on your interests that you picked in the sign up process" +
                                              "You can find more information about your MP by choosing more categories. "}
                                      }
            />
        </Card>
      </div>
  )
}
