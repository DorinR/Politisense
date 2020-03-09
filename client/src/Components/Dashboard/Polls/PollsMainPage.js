import React, { Component } from 'react';
import Poll from 'react-polls';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row'
import axios from 'axios'


// Declaring poll question and answers
const pollQuestion = 'Is react-polls useful?'
const pollAnswers = [
    { option: 'Yea', votes: 8 },
    { option: 'Nay', votes: 2 }
]


class PollsMainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            legislativeObjects: [],
            pollAnswers: [...pollAnswers]
        }
    }

    // Handling user vote
    // Increments the votes count of answer when the user votes
    handleVote = voteAnswer => {
        const { pollAnswers } = this.state
        const newPollAnswers = pollAnswers.map(answer => {
            if (answer.option === voteAnswer) answer.votes++
            return answer
        })
        this.setState({
            pollAnswers: newPollAnswers
        })
    }

    getUpcomingBills = async () => {
        axios.get(`http://localhost:5000/api/bills/getUpcomingBills`).then((response) => {
            let array = response.data.data
            let bills = array.map(x => x)
            let legislativeObjects = bills[0].data[0]
            this.setState({
                legislativeObjects: legislativeObjects
            });
            console.log(this.state.legislativeObjects)
            console.log(legislativeObjects[0])
            console.log(legislativeObjects[0].title)
            return legislativeObjects
        }).catch((error) => {
            console.log(error);
        });
    }

    componentDidMount() {
        this.getUpcomingBills();
    }

    render() {
        const { pollAnswers } = this.state
        return (
            <div>
                {/* <Poll question={pollQuestion} answers={pollAnswers} onVote={this.handleVote} /> */}
                {/* <Container>
                    <Row>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Bill C-130</Card.Title>
                                <Card.Link href="#">Bill Link</Card.Link>
                                <Card.Text>
                                    <small className="text-muted">12 December 2019</small>
                                </Card.Text>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                    </Card.Text>
                                <Poll answers={pollAnswers} onVote={this.handleVote} />
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Bill D-76</Card.Title>
                                <Card.Link href="#">Bill Link</Card.Link>
                                <Card.Text>
                                    <small className="text-muted">1 November 2019</small>
                                </Card.Text>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                    </Card.Text>
                                <Poll answers={pollAnswers} onVote={this.handleVote} />
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>Motion 30</Card.Title>
                                <Card.Link href="#">Bill Link</Card.Link>
                                <Card.Text>
                                    <small className="text-muted">19 October 2019</small>
                                </Card.Text>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the bulk of
                                    the card's content.
                                </Card.Text>
                                <Poll answers={pollAnswers} onVote={this.handleVote} />
                            </Card.Body>
                        </Card>
                    </Row>

                </Container> */}
                <ul>
                    {this.state.legislativeObjects.map(eachData => {
                        // console.log(eachData)
                        return (<li>
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>{eachData.title}</Card.Title>
                                    <Card.Link href="#">{eachData.link}</Card.Link>
                                    <Card.Text>
                                        <small className="text-muted">{eachData.date}</small>
                                    </Card.Text>
                                    <Card.Text>{eachData.description}</Card.Text>
                                    <Poll answers={pollAnswers} onVote={this.handleVote} />
                                </Card.Body>
                            </Card>
                            {/* {eachData.title + eachData.date + eachData.link + eachData.description} */}
                        </li>)
                    })}
                </ul>
            </div>

        );
    }
};

export default PollsMainPage