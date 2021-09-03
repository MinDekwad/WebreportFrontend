import logo from './logo.svg';
//import './App.css';
import Header from './components/Header';
import Menu from './components/Menu';
import Content from './components/Content';
import Footer from './components/Footer';

import Micropaydailyreport from './components/Micropaydailyreport';
import Test from './components/Test';
import Home from './components/Home';
import Createstatementending from './components/Createstatementending';
import Editstatementending from './components/Editstatementending';
import Liststatementending from './components/Liststatementending';
import Createbulktransaction from './components/Createbulktransaction'
import Listbulktransaction from './components/Listbulktransaction';
import Editbulktransaction from './components/Editbulktransaction';
import Ekycmonthlyreport from './components/Ekycmonthlyreport';
import Import from './components/Import';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import BootstrapDate from './components/BootstrapDate';

function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
        <Menu/>
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/Micropaydailyreport" exact component={() => <Micropaydailyreport />} />
          <Route path="/Createstatementending" exact component={() => <Createstatementending/>} />
          <Route path="/Liststatementending" exact component={() => <Liststatementending/>} />
          <Route path="/Editstatementending" exact component={() => <Editstatementending/>} />
          <Route path="/Createbulktransaction" exact component={() => <Createbulktransaction/> }/>
          <Route path="/Listbulktransaction" exact component={() => <Listbulktransaction/>} />
          <Route path="/Editbulktransaction" exact component={() => <Editbulktransaction/>} />
          <Route path="/Ekycmonthlyreport" exact component={() => <Ekycmonthlyreport/>} />
          <Route path="/Import" exact component={() => <Import/>} />
          {/* <Route path="/Import" exact component={() => <Import/>} /> */}
          <Route path="/Test" exact component={() => <Test />} />
        </Switch>
        {/* <Content/> */}
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
