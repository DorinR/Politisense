import React, { Component, Fragment } from 'react'

class QuestionUnit extends Component {
  render () {
    return (
      <div>
        <>
          {this.props.questionunit.id} {this.props.questionunit.question}
        </>
      </div>
    )
  }
}

export default QuestionUnit
