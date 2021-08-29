import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import { makeStyles } from "@material-ui/styles";

import Button from "@material-ui/core/Button";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: "center"
  },
}));

const Listings = () => {
  const classes = useStyles();

  return (
    <div class="container">
      <Grid container>
        <Grid item xs={12} md={12} lg={12}>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Token</TableCell>
                  <TableCell>Token Address</TableCell>
                  <TableCell>Cap</TableCell>
                  <TableCell>Max BNB</TableCell>
                  <TableCell>Min BNB</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Hola</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper>xs=12</Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>xs=6</Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>xs=6</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>xs=3</Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper>xs=3</Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Listings;
