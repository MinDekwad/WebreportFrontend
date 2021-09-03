import { React } from 'react'
// import { BrowserRouter as Router, Switch, Route, Link, withRouter, } from 'react-router-dom'

import { Link, withRouter, } from 'react-router-dom'

function Menu(props) {
  //const pathName = props.location.pathname

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4" style={{position:'fixed'}}>
      <a href="index3.html" className="brand-link">
        <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }}/>
        <span className="brand-text font-weight-light">Admin Panel</span>
      </a>
      <div className="sidebar">
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="image">
            <img src="dist/img/anon2.png" className="img-circle elevation-2" alt="" />
          </div>
          <div className="info">
            <a href="/#" className="d-block">
              Administrator
            </a>
          </div>
        </div>

        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            {/* <li className="nav-item has-treeview menu-open"> */}
            <li className={`nav-item has-treeview ${props.location.pathname === '/Micropaydailyreport' ? 'menu-is-opening menu-open' : ''}`}>
              <a href="/#" className={`nav-link ${ props.location.pathname === '/Micropaydailyreport' ? 'active': ''}`}>
                <i className="nav-icon far fa-file-alt" />
                <p>
                  TMDS Report
                  <i className="right fas fa-angle-left" />
                </p>
              </a>
              {/* <ul className="nav nav-treeview"> */}
              <ul className="nav nav-treeview" style={{display: `${props.location.pathname === '/Micropaydailyreport' ? 'block' : 'none' }`}}>
                <li className="nav-item">
                  <Link to="/Micropaydailyreport"className={`nav-link ${props.location.pathname === '/Micropaydailyreport'? 'active' : ''}`}>
                    <i className="far fa-circle nav-icon" />
                    <p className="nav-sub-menu">Micro pay daily summary</p>
                  </Link>
                </li>
              </ul>
            </li>
            {/* <li className="nav-item has-treeview"> */}
            <li className={`nav-item has-treeview ${props.location.pathname === '/Createstatementending' || props.location.pathname === '/Liststatementending' || props.location.pathname === '/Editstatementending' ? 'menu-is-opening menu-open' : ''}`}>
              <a href="/#" className={`nav-link ${props.location.pathname === '/Createstatementending' || props.location.pathname === '/Liststatementending' || props.location.pathname === '/Editstatementending' ? 'active' : ''}`}>
                <i className="nav-icon fas fa-money-check-alt" />
                <p>
                  STATEMENT ENDING BALANCE
                  <i className="right fas fa-angle-left" />
                </p>
              </a>
              {/* <ul className="nav nav-treeview"> */}
              <ul className="nav nav-treeview" style={{display: `${props.location.pathname === '/Createstatementending' || props.location.pathname === '/Liststatementending' || props.location.pathname === '/Editstatementending' ? 'block' : 'none' }`}}>
                <li className="nav-item">
                  <Link to="/Createstatementending" className={`nav-link ${props.location.pathname === '/Createstatementending' ? 'active' : ''}`}>
                    <i className="far fa-circle nav-icon" />
                    <p>Create</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Liststatementending" className={`nav-link ${props.location.pathname === '/Liststatementending' || props.location.pathname === '/Editstatementending' ? 'active' : ''}`}>
                    <i className="far fa-circle nav-icon" />
                    <p>Edit</p>
                  </Link>
                </li>
              </ul>
            </li>

            <li className={`nav-item has-treeview ${props.location.pathname === '/Createbulktransaction' || props.location.pathname === '/Listbulktransaction' || props.location.pathname === '/Editbulktransaction' ? 'menu-is-opening menu-open' : ''}`}>
              <a href="/#" className={`nav-link ${props.location.pathname === '/Createbulktransaction' || props.location.pathname === '/Listbulktransaction' || props.location.pathname === '/Editbulktransaction' ? 'active' : ''}`}>
                <i className="nav-icon fas fa-money-check-alt" />
                <p>
                  BULK TRANSACTION
                  <i className="right fas fa-angle-left" />
                </p>
              </a>
              <ul className="nav nav-treeview" style={{display: `${props.location.pathname === '/Createbulktransaction' || props.location.pathname === '/Listbulktransaction' || props.location.pathname === '/Editbulktransaction' ? 'block' : 'none' }`}}>
                <li className="nav-item">
                  <Link to="/Createbulktransaction" className={`nav-link ${props.location.pathname === '/Createbulktransaction' ? 'active' : ''}`}>
                    <i className="far fa-circle nav-icon" />
                    <p>Create</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/Listbulktransaction" className={`nav-link ${props.location.pathname === '/Listbulktransaction' || props.location.pathname === '/Editbulktransaction' ? 'active' : ''}`}>
                    <i className="far fa-circle nav-icon" />
                    <p>Edit</p>
                  </Link>
                </li>
              </ul>
            </li>

            <li className={`nav-item has-treeview ${props.location.pathname === '/Ekycmonthlyreport' ? 'menu-is-opening menu-open' : ''}`}>
              <a href="/#" className={`nav-link ${ props.location.pathname === '/Ekycmonthlyreport' ? 'active': ''}`}>
                <i className="nav-icon fas fa-download" />
                <p>
                  eKYC MONTHLY REPORT
                  <i className="right fas fa-angle-left" />
                </p>
              </a>
              {/* <ul className="nav nav-treeview"> */}
              <ul className="nav nav-treeview" style={{display: `${props.location.pathname === '/Ekycmonthlyreport' ? 'block' : 'none' }`}}> 
                <li className="nav-item">
                  <Link to="/Ekycmonthlyreport"className={`nav-link ${props.location.pathname === '/Ekycmonthlyreport'? 'active' : ''}`}>
                    <i className="far fa-circle nav-icon" />
                    <p className="nav-sub-menu">Download report (excel)</p>
                  </Link>
                </li>
              </ul>
            </li>

            <li className={`nav-item has-treeview ${props.location.pathname === '/Import' ? 'menu-is-opening menu-open' : ''}`}>
              <a href="/#" className={`nav-link ${ props.location.pathname === '/Import' ? 'active': ''}`}>
                <i className="nav-icon fas fa-file-import" />
                <p>
                  IMPORT
                  <i className="right fas fa-angle-left" />
                </p>
              </a>
              {/* <ul className="nav nav-treeview"> */}
              <ul className="nav nav-treeview" style={{display: `${props.location.pathname === '/Import' ? 'block' : 'none' }`}}> 
                <li className="nav-item">
                  <Link to="/Import"className={`nav-link ${props.location.pathname === '/Import'? 'active' : ''}`}>
                    <i className="far fa-circle nav-icon" />
                    <p className="nav-sub-menu">Import file (csv)</p>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item has-treeview">
              <a href="/#" className={`nav-link ${props.location.pathname === '/Test' ? 'active' : ''}`}>
                <i className="nav-icon far fa-file-alt" />
                <p>
                  TEST
                  <i className="right fas fa-angle-left" />
                </p>
              </a>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="/Test" className={`nav-link ${props.location.pathname === '/Test' ? 'active' : ''}`}>
                    <i className="far fa-circle nav-icon" />
                    <p>Test</p>
                  </Link>
                </li>
              </ul>
            </li>
            
          </ul>
        </nav>
      </div>
    </aside>
  )
}

// export default Menu;
export default withRouter(Menu)
