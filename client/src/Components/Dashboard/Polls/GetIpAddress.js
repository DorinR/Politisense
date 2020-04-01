import React, { Component } from 'react';
import axios from 'axios'

export async function getIpInfo() {
    return axios.get('https://ipapi.co/json/').then((response) => {
        let data = response.data;
        // this.setState({
        //     country: data.country_name,
        //     postalCode: data.postal,
        //     city: data.city,
        //     region: data.region
        // });
        console.log(data.country_name)
        console.log(data.postal)
        return data.country_name
    }).catch((error) => {
        console.log(error);
    });
}


export async function getIpPostalCode() {
    return axios.get('https://ipapi.co/json/').then((response) => {
        let data = response.data;
        return data.postal
    }).catch((error) => {
        console.log(error);
    });
}

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