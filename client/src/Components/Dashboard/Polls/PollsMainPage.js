import React, { Component } from 'react';
import Poll from 'react-polls';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import ListGroup from 'react-bootstrap/ListGroup'
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
                <Row style={{ height: '1.5rem' }}></Row>
                <InputGroup className="mb-3" style={{ width: '40rem' }}>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="search" ></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="Filter Through Bills"
                        aria-label="Search"
                        aria-describedby="basic-addon1"
                        style={{ width: '15rem' }}
                    />
                    <Button variant="warning" >My Voting History</Button>
                    <Button variant="info" >Most Popular Bills</Button>
                </InputGroup>
                <ListGroup>
                    {this.state.legislativeObjects.map(eachData => {
                        return (<ListGroup.Item>
                            <Card style={{ width: '40rem' }}>
                                <Card.Body>
                                    <Card.Title>{eachData.title}</Card.Title>
                                    <a href={eachData.link}>{eachData.link}</a>
                                    <Card.Text>
                                        <small className="text-muted">Retrieved on: {eachData.date}</small>
                                    </Card.Text>
                                    <Card.Text>{eachData.description}</Card.Text>
                                    {/* <Poll answers={pollAnswers} onVote={this.handleVote} /> */}
                                    <Button variant="success">For</Button>{' '}
                                    <Button variant="danger">Against</Button>
                                </Card.Body>
                            </Card>
                            <Row style={{ height: '1.5rem' }}></Row>
                        </ListGroup.Item>)
                    })}
                </ListGroup>
            </div>

        );
    }
};

export default PollsMainPage