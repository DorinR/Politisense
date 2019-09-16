import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import ButtonQ from './ButtonQ'

export default function Questions () {
  return (
    <Container maxWidth='md'>
      <h2>Questionnaire</h2>

      <Grid container justify='center'>
        {/* <QuestionCard /> */}
        <ButtonQ />
      </Grid>

    </Container>
  )
}
