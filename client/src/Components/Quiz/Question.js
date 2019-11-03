import React from "react";
import PropTypes from "prop-types";
import "./questions_index.css";

function Question(props) {
  return <h2 className="question">{props.content}</h2>;
}

Question2.propTypes = {
  content: PropTypes.string.isRequired
};

export default Question;
