import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {
    Route,
    Redirect,
} from 'react-router-dom'
import Unverified from "./Unverified";
import CenteredCircularProgress from "../Dashboard/Utilities/CenteredCircularProgress";


export default function PrivateRoute(props) {
    const [loading, setLoading] = useState(true)
    const [verified, setVerified] = useState(false)
    const { component: Component, ...rest } = props;

    async function checkUserVerified(user) {
        return axios
            .post('/api/users/checkUserVerified', user)
            .then(res => {
                return res.data.message === 'verified'
            })
            .catch(err => console.error(err))
    }

    function unverified () {
        if (localStorage.getItem('user')) {
            return <Unverified />
        } else {
            return <Redirect to='/login' />
        }
    }

    useEffect(() => {
        checkUserVerified((JSON).parse(localStorage.getItem('user'))).then(res =>{
            setLoading(false)
            setVerified(res)
            }
        )
    }, [])

    return (
        <div>
        {loading? <CenteredCircularProgress/> :
                <Route
                    {...rest}
                    render={props =>
                        verified ? (
                            <Component {...props} />
                        ) : (
                            unverified()
                        )}
                />
        }
        </div>
    )
}
