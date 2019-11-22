import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';


const useStyles = makeStyles(theme => ({
  card: {
    width: 400,
    height: 150,
    margin: "auto",
    marginTop: 20,
    position: "relative"
  },
  cardActions: {
    position: "absolute",
    bottom: 0
  }
}))
export default function Search() {
  const classes = useStyles()
  const elems = [1, 2, 3]
  const matchedUsers = [
    {
      'user_id': 1,
      'user_name': 'Joe Biden'
    },
    {
      'user_id': 2,
      'user_name': 'Barrack Obama'
    },
    {
      'user_id': 3,
      'user_name': 'Donald Trump'
    }
  ]
  
  return (
    <div>
      {
        matchedUsers.map(user =>
          <Card className={classes.card} key={user.user_id} raised>
            <CardContent>
              <Typography variant="h5">{user.user_name}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button variant="contained" color="primary">Request to chat</Button>
            </CardActions>
          </Card>  
          
        )
      }
    </div>
  )
}

// export default function Search() {
//   const classes = useStyles();

//   function search () {
//     fetch("/api/search_availabilities")
//       .then(payload => payload.json())
//       .then(results => {
//         console.log("hello")
//         console.log(JSON.stringify(results))
//       })
//   }


//   return (
//     <React.Fragment>
//       <CssBaseline />
//       <main className={classes.layout}>
//         <Paper className={classes.paper}>
//           <Typography component="h1" variant="h4" align="center">
//             Search
//           </Typography>
//           <br />
//           <br />
//           <br />
//           <React.Fragment>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={12}>
//                 <center>
//                 <Button variant="contained"
//                         color="primary"
//                         className={classes.button}
//                         onClick={search}>
//                   Search for other users
//                 </Button>
//                 </center>
//               </Grid>
//             </Grid>
//           </React.Fragment>
//         </Paper>
//       </main>
//     </React.Fragment>
//   );
// }
