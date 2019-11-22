import React, { Component } from "react";
import HomeAppBar from "./HomeAppBar.jsx";
import Settings from "./Settings.jsx";
import Search from "./Search.jsx";
import Availability from "./Availability.jsx";
import { Switch, Route } from "react-router-dom";

// class Home extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { notifications: null };
//   }

//   componentDidMount() {
//     fetch("/api/notifications", {
//       method: "get",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: "bearer: " + localStorage.getItem("auth")
//       }
//     })
//       .then(response => response.json())
//       .then(data => {
//         this.setState({ notifications: data });
//       });
//   }
//   render() {
//     // let notifications = "hi";
//     // if (this.state) {
//     //   notifications = this.state.notifications;
//     //   console.log(notifications);
//     // }
//     return (
//       <div>
//         <HomeAppBar notifications={this.state.notifications} />
//         <Switch>
//           <Route exact path="/home/search" component={Search} />
//           <Route exact path="/home/settings" component={Settings} />
//           <Route exact path="/home/availability" component={Availability} />
//         </Switch>
//       </div>
//     );
//   }
// }

const Home = () => {
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/notifications", {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "bearer: " + localStorage.getItem("auth")
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("returned");
        setNotifications(data);
      });
  }, []);

  return (
    <div>
      <HomeAppBar notifications={notifications} />
      <Switch>
        <Route exact path="/home/search" component={Search} />
        <Route exact path="/home/settings" component={Settings} />
        <Route exact path="/home/availability" component={Availability} />
      </Switch>
    </div>
  );
};

export default Home;
