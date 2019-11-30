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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
  const [chatFromTo, setChatFromTo] = useState("")
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

  const submitRequest = () => {
    console.log("submit chat request")
    console.log(chatFromTo, chatDate, selectedUserId)
    let date_string = chatDate.getFullYear() + "-" + chatDate.getMonth() + "-" + chatDate.getDate()
    fetch("/api/request", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "bearer: " + localStorage.getItem("auth")
      },
      body: JSON.stringify({
        "partner_id": selectedUserId,
        "date": date_string,
        "from_time": parseInt(chatFromTo.split(" ")[0]),
        "to_time": parseInt(chatFromTo.split(" ")[1])
      })
    })
      .then(response => response.json())
      .then(data => {
        if ("id" in data) {
          alert("Successfully made the request")
        }
      })
  }

  const handleChatTimeChange = evt => {
    setChatFromTo(evt.target.value)
  }

  const getOverlap = (ls, b) => {
    let overlapping = ls.find(a => {
      let day = (chatDate.getDay()+1) % 7
      if (a.day_of_week !== day || b.day_of_week !== day) {
        return false
      }

      if (!(a.from_time <= b.to_time && b.from_time <= a.to_time)) {
        return false
      }

      return true
    })

    if (typeof overlapping === 'undefined') {
      return false;
    }

    let convert_time = (minutes) => {
      let n_hours = (Math.ceil(minutes / 10) * 10- 8*60) / 60
      let ampm = minutes >= 720 ? "pm" : "am"
      return (n_hours + 7) % 12 + 1 + ":00" + " " + ampm
    }

    let new_from_time = Math.max(overlapping.from_time, b.from_time)
    let new_to_time = Math.min(overlapping.to_time, b.to_time)
    let new_title = convert_time(new_from_time) + " - " + convert_time(new_to_time)

    return {
      "title": new_title,
      "from_time": new_from_time,
      "to_time": new_to_time
    }
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

        <RadioGroup name="time_picker" value={chatFromTo} onChange={handleChatTimeChange}>
          {
            availabilities
              .filter(a => a.user_id == localStorage.getItem("id"))
              .map(a => getOverlap(filteredAvail, a))
              .filter(a => a)
              .map(a => <FormControlLabel
                          value={a.from_time + " " + a.to_time}
                          control={<Radio/>}
                          label={a.title}/>)
          }
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submitRequest} color="primary">Send</Button>
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
