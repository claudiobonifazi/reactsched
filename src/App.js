import React from 'react';
import Scheduler from "./components/Scheduler.js";
import SchedulerTop from "./components/SchedulerTop.js";
import SchedulerBottom from "./components/SchedulerBottom.js";

class App extends React.Component{

  render(){
    return (<>
      <SchedulerTop />
      <Scheduler />
      <SchedulerBottom />
    </>);
  }
}

export default App;
