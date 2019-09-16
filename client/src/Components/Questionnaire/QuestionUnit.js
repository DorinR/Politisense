import React, { Component, Fragment } from 'react'

class QuestionUnit extends Component {

  render () {

    return (
        <div>
                <React.Fragment>
                    {this.props.questionunit.id} {this.props.questionunit.question} 
                </React.Fragment>
        </div>
    )
  }
}

export default QuestionUnit
