import React from "react";
import PropTypes from "prop-types";
import { TransitionGroup } from "react-transition-group";
import "./questions_index.css";

function Result(props) {
  return (
    <TransitionGroup
      className="container_questionnaire result"
      component="div"
      transitionName="fade"
      transitionEnterTimeout={800}
      transitionLeaveTimeout={500}
      transitionAppear
      transitionAppearTimeout={500}
    >
      <div>
        You prefer <strong>{props.quizResult}</strong>!
      </div>
    </TransitionGroup>
  );
}

Result.propTypes = {
  quizResult: PropTypes.string.isRequired
};

export default Result;
