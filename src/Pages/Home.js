import React from 'react'

function Home() {
  return (
    <div>
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-12">
            <img src="logo.svg" alt="" style={{ width: '85%' }} />
            <br />
            <h1 className="m-0" style={{ color: '#1890ff' }}>
              WELCOME TO WEB REPORT
            </h1>
            {/* {process.env.REACT_APP_PUBLIC_URL} */}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home
