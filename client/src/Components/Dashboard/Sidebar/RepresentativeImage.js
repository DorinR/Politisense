import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";
import { useMediaQuery } from "@material-ui/core";

export async function fetchUserRiding(userEmail) {
  return axios
    .get(`/api/users/${userEmail}/getUser`)
    .then((res) => {
      if (res.data.success) {
        return res.data.data.riding;
      }
    })
    .catch(console.error);
}

export async function fetchRepresentative(riding) {
  return axios
    .get(`/api/representatives/${riding}/getRepresentative`)
    .then((res) => {
      if (res.data.success) {
        return res.data.data;
      }
    })
    .catch(console.error);
}

const useStyles = makeStyles((theme) => ({
  bigAvatar: {
    marginLeft: theme.spacing(6),
    width: 100,
    height: 100,
    border: "3px solid #00bcd4",
  },
  bigAvatarXL: {
    marginLeft: theme.spacing(10),
    width: 100,
    height: 100,
    border: "3px solid #00bcd4",
  },
}));

export default function RepresentativeImage(props) {
  const classes = useStyles();
  return (
    <div>
      {props.representative && (
        <Avatar
          alt={props.representative.name}
          src={props.representative.imageUrl}
          className={classes.bigAvatar}
        />
      )}
    </div>
  );
}
