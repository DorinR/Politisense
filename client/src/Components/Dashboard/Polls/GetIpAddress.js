import React, { Component } from 'react';
import axios from 'axios'


class GetIpAddress extends Component {

    constructor(props) {
        super(props);
        this.state = {
            country: '',
            postalCode: '',
            city: '',
            region: ''
        }
    }

    getIpInfo = () => {
        axios.get('https://ipapi.co/json/').then((response) => {
            let data = response.data;
            this.setState({
                country: data.country_name,
                postalCode: data.postal,
                city: data.city,
                region: data.region
            });
        }).catch((error) => {
            console.log(error);
        });
    };

    componentDidMount() {
        this.getIpInfo();
    }

    render() {
        return (
            <div>
                <p>Country Name: {this.state.country}</p>
                <p>Postal Code: {this.state.postalCode}</p>
                <p>City: {this.state.city}</p>
                <p>Region: {this.state.region}</p>
            </div>
        )
    }
};

export default GetIpAddress