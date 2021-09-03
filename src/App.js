import React, { useContext } from 'react'

import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import DefaultLayout from './Layouts/Default'
import Dailyreport from './Pages/Dailyreport'
import Liststatementending from './Pages/Statement/Liststatementending'
import Createstatementending from './Pages/Statement/Createstatementending'
import Editstatementending from './Pages/Statement/Editstatementending'
import Listbulktransaction from './Pages/Bulk/Listbulktransaction'
import Createbulktransaction from './Pages/Bulk/Createbulktransaction'
import Editbulktransaction from './Pages/Bulk/Editbulktransaction'
import Ekycmonthlyreport from './Pages/Ekyc/Ekycmonthlyreport'
import Importcsv from './Pages/Importcsv'
import Home from './Pages/Home'
import Billpaytransaction from './Pages/Billpay/Billpaytransaction'
import Billpaysummary from './Pages/Billpay/Billpaysummary'
import Updatereportkyc from './Pages/Updatereportkyc'
import Pointhistory from './Pages/Point/Pointhistory'
import Pointgen from './Pages/Point/Pointgen'
import Pointtransactionlist from './Pages/Pointtransactionlist'
import Pointtransactioncreate from './Pages/Point/Pointtransactioncreate'
import Pointtransactionedit from './Pages/Point/Pointtransactionedit'
import Pointhistoryexport from './Pages/Point/Pointhistoryexport'
import Ranking from './Pages/Amlo/Ranking'
import Rankinghistory from './Pages/Amlo/Rankinghistory'
import Watchlist from './Pages/Amlo/Watchlist'
import Occupation from './Pages/Amlo/Occupation'
import Occupationcreate from './Pages/Amlo/Occupationcreate'
import Occupationedit from './Pages/Amlo/Occupationedit'
import Area from './Pages/Amlo/Area'
import Areaedit from './Pages/Amlo/Areaedit'
import Transactionfactor from './Pages/Amlo/Transactionfactor'
import Transactionfactorcreate from './Pages/Amlo/Transactionfactorcreate'
import Transactionfactoredit from './Pages/Amlo/Transactionfactoredit'
import Datecalculaterank from './Pages/Amlo/Datecalculaterank'
import Datecalculaterankedit from './Pages/Amlo/Datecalculaterankedit'
import Rankingcalculate from './Pages/Rankingcalculate'
import Reportcustomeramlo from './Pages/Amlo/Reportcustomeramlo'
import Watchlistupload from './Pages/Amlo/Watchlistupload'
import Occupationupload from './Pages/Amlo/Occupationupload'
import Waitinglist from './Pages/Amlo/Waitinglist'

import { OAuth2 } from './Pages/Login'
import { Success } from './Pages/Callback/Success'
import { UserProvider, UserContext } from './userContext'
import * as dayjs from 'dayjs'
import Kycpendingcsv from './Pages/Pointkyclb/Kycpendingcsv'
import Lbpendingcsv from './Pages/Pointkyclb/Lbpendingcsv'
import Pointimport from './Pages/Pointkyclb/Pointimport'
import Pointkyclbgen from './Pages/Pointkyclb/Pointkyclbgen'

const App = () => (
  <div className="App">
    <UserProvider>
      <Router basename={`${process.env.REACT_APP_PUBLIC_URL || ''}`}>
        <Switch>
          <Route path="/login">
            <OAuth2 />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/callback/success">
            <Success />
          </Route>
          <DefaultLayout>
            <PrivateRoute>
              {/* <Route path="/" exact component={() => <DefaultLayout />} /> */}
              <Route exact component={Home} path="/" />
              <Route component={Dailyreport} path="/Dailyreport" />
              <Route
                component={Liststatementending}
                path="/Statement/Liststatementending"
              />
              <Route
                component={Createstatementending}
                path="/Statement/Createstatementending"
              />
              <Route
                component={Editstatementending}
                path="/Statement/Editstatementending"
              />
              <Route
                component={Listbulktransaction}
                path="/Bulk/Listbulktransaction"
              />
              <Route
                component={Createbulktransaction}
                path="/Bulk/Createbulktransaction"
              />
              <Route
                component={Editbulktransaction}
                path="/Bulk/Editbulktransaction"
              />
              <Route
                component={Ekycmonthlyreport}
                path="/Ekyc/Ekycmonthlyreport"
              />
              <Route component={Importcsv} path="/Importcsv" />
              <Route
                component={Billpaytransaction}
                path="/Billpay/Billpaytransaction"
              />
              <Route
                component={Billpaysummary}
                path="/Billpay/Billpaysummary"
              />
              <Route component={Pointhistory} path="/Point/Pointhistory" />
              <Route component={Pointgen} path="/Point/Pointgen" />
              <Route
                component={Pointtransactionlist}
                path="/Pointtransactionlist"
              />
              <Route
                component={Pointtransactioncreate}
                path="/Point/Pointtransactioncreate"
              />
              <Route
                component={Pointtransactionedit}
                path="/Point/Pointtransactionedit"
              />
              <Route
                component={Pointhistoryexport}
                path="/Point/Pointhistoryexport"
              />

              <Route
                component={Pointkyclbgen}
                path="/Pointkyclb/Pointkyclbgen"
              />
              <Route component={Pointimport} path="/Pointkyclb/Pointimport" />
              <Route
                component={Kycpendingcsv}
                path="/Pointkyclb/Kycpendingcsv"
              />
              <Route component={Lbpendingcsv} path="/Pointkyclb/Lbpendingcsv" />

              <Route component={Updatereportkyc} path="/Updatereportkyc" />

              {/* AMLO */}
              <Route component={Ranking} path="/Amlo/Ranking" />
              <Route component={Rankinghistory} path="/Amlo/Rankinghistory" />
              <Route component={Watchlist} path="/Amlo/Watchlist" />
              <Route component={Watchlistupload} path="/Amlo/Watchlistupload" />
              <Route component={Occupation} path="/Amlo/Occupation" />
              <Route
                component={Occupationcreate}
                path="/Amlo/Occupationcreate"
              />
              <Route component={Occupationedit} path="/Amlo/Occupationedit" />
              <Route
                component={Occupationupload}
                path="/Amlo/Occupationupload"
              />
              <Route component={Area} path="/Amlo/Area" />
              <Route component={Areaedit} path="/Amlo/Areaedit" />
              <Route
                component={Transactionfactor}
                path="/Amlo/Transactionfactor"
              />
              <Route component={Waitinglist} path="/Amlo/Waitinglist" />
              <Route
                component={Transactionfactorcreate}
                path="/Amlo/Transactionfactorcreate"
              />
              <Route
                component={Transactionfactoredit}
                path="/Amlo/Transactionfactoredit"
              />
              <Route
                component={Datecalculaterank}
                path="/Amlo/Datecalculaterank"
              />
              <Route component={Rankingcalculate} path="/Rankingcalculate" />
              <Route
                component={Datecalculaterankedit}
                path="/Amlo/Datecalculaterankedit"
              />
              <Route
                component={Reportcustomeramlo}
                path="/Amlo/Reportcustomeramlo"
              />
            </PrivateRoute>
          </DefaultLayout>
        </Switch>
      </Router>
    </UserProvider>
  </div>
)

const Logout = () => {
  const { dispatch } = useContext(UserContext)
  dispatch({ type: 'logout' })
  return <Redirect to="/login" />
}

function PrivateRoute({ children, ...rest }) {
  const { user, dispatch } = useContext(UserContext)

  const { exp } = user
  //const { userData } = user
  //console.log('userData : ', userData)
  if (!exp) {
    dispatch({ type: 'logout' })
  } else {
    const expDate = dayjs(exp)
    const now = dayjs()

    if (now.isAfter(expDate)) {
      dispatch({ type: 'logout' })
    }
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user.login ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

export default App
