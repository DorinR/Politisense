import React from 'react'
import QuestionUnit from './QuestionUnit'

class QuestionList extends React.Component {
  render () {
    return (
      <ul>
        <li>
          {this.props.questionList.map((questionunit) => {
            return <QuestionUnit questionunit={questionunit} />
          })}
        </li>
      </ul>
    )
  }
}

export default QuestionList
