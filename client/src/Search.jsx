import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';

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

function RequestChatDialog(props) {
  const { availabilities, onClose, onSubmit, open,  selectedUserId } = props
  const [chatDate, setChatDate] = useState(new Date())
  const [dateDialog, setDateDialog] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [filteredAvail, setFilteredAvail] = useState([])
  const [availDays, setAvailDays] = useState(new Set())


  useEffect(() => {
    let avails = availabilities.filter(item => item.user_id === selectedUserId)
    let days = avails.map(item => item.day_of_week)
    setFilteredAvail(avails)
    setAvailDays(new Set(days))
  }, [selectedUserId])

  const handleChatDateChange = date => {
    setChatDate(date)
    setDateDialog(false)
  }

  const openDateDialog = () => {
    setDateDialog(true)
  }

  const closeDateDialog = () => {
    setDateDialog(false)
  }

  const shouldDisableDate = date => {
    let day = (date.getDay()+1) % 7
    return !availDays.has(day)
  }

  return(
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Make Chat Request</DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            value={chatDate}
            disablePast
            onChange={handleChatDateChange}
            open={dateDialog}
            onOpen={openDateDialog}
            onClose={closeDateDialog}
            variant="inline" 
            format="MM/dd/yyyy" 
            disableToolbar 
            shouldDisableDate={shouldDisableDate}
            label="Chat date"/>
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

export default function Search() {
  const [availabilities, setAvailabilities] = useState([])
  const [matchedUsers, setMatchedUsers] = useState([])
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const classes = useStyles()

  const closeRequestDialog = () => {
    setRequestDialogOpen(false)
  }

  const requestButtonClick = (userId) => {
    setSelectedUserId(userId)
    // console.log(userId)
    setRequestDialogOpen(true)
  }
  
  useEffect(() => {
    fetch("/api/search_availabilities", {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "bearer: " + localStorage.getItem("auth")
      }
    })
      .then(response => response.json())
      .then(data => {
        setAvailabilities(data.availabilities)
        let userIds = new Set()
        let users = []
        data.availabilities.forEach(item => {
          if(!userIds.has(item.user_id)) {
            userIds.add(item.user_id)
            users.push({
              'id': item.user_id,
              'user_name': item.user_name
            })
          }
        })
        setMatchedUsers(users)
      });
  }, [])
  
  return (
    <div>
      {
        matchedUsers.map(user =>
          <Card className={classes.card} key={user.id} raised>
            <CardContent>
              <Typography variant="h5">{user.user_name}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
              <Button onClick={() => requestButtonClick(user.id)} variant="contained" color="primary">Request to chat</Button>
            </CardActions>
          </Card>  
        )
      }
      <RequestChatDialog 
        availabilities={availabilities}
        onClose={closeRequestDialog} 
        open={requestDialogOpen} 
        selectedUserId={selectedUserId}/>
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
