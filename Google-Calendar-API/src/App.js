import React,{useState} from 'react';
import './App.css';

function App() {
  var ela={
    'summary': 'Name',
    'location': 'Allahabad',
    'description': 'Testing Google API',
    'start': {
      'dateTime': '2021-02-28T09:00:00-07:00',
      'timeZone': 'Asia/Kolkata'
    },
    'end': {
      'dateTime': '2021-02-28T17:00:00-07:00',
      'timeZone': 'Asia/Kolkata'
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=2'
    ],
    'attendees': [ 
      {'email': 'zuhakhalid@gmail.com'},
      {'email': 'zuhakk@gmail.com'}
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10}
      ]
    }
  }
  const [formDB,setFormDB]=useState(ela);
  var gapi = window.gapi
  var CLIENT_ID = "789217194925-mnhj9boaoi6bbjgsjlekv3pmrkeqdqao.apps.googleusercontent.com"
  var API_KEY = "AIzaSyB5oEqd5no-H37ePYJpl-hgeTBtCgCPJIw"
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
  var SCOPES = "https://www.googleapis.com/auth/calendar.events"

  const handleClick = (e) => {
    e.preventDefault();
    gapi.load('client:auth2', () => {
      console.log('loaded client')

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () => console.log('bam!'))

      gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        
       // var event=formDB;
        console.log(formDB);
        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': formDB,
        })

          request.execute(formDB => {
          console.log(formDB)
          window.open(formDB.htmlLink)
        })
        
    
        
        // get events
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(response => {
          const events = response.result.items
          console.log('EVENTS: ', events)
        })
        console.log(formDB);
    

      })
    })
  }
  // const onFormSubmit=(e)=>{
  //   e.preventDefault()
  //   console.log(e.target.name)
  // }
  // const myChangeHandler = (event) => {
  //   console.log(event.target.value);
  //  }

  // const emailChangeKaro=(e)=>{
  //   var {email}=e.target.value;
  //   var z ={'email':`${email}`}
  //   let attendyArray= formDB.attendees.slice();
  //   attendyArray.push(z)
  //   // e.preventDefault();
  //   //e=>setFormDB({ ...formDB, attendees: e.target.value })
    
  //  // var z ={'email':`${email}`}
  //   const newObj= { ...formDB, [e.target.value]:attendyArray};
  //  setFormDB(newObj);
  // }

  return (
    <div className="App">
     
        <form onSubmit={handleClick}>
      <input
        type="text"
        name="formDB[summary]"
        placeholder="Name"
        value={formDB.summary}
        onChange={e => setFormDB({ ...formDB, summary: e.target.value })}
      />
     

     <input
        type="email"
        name="formDB.attendees[0].email"
        value={formDB.attendees[0].email}
        onChange={e => setFormDB({
          ...formDB,
          attendees: formDB.attendees.map((el, i) => i === 0 ? { email: e.target.value } : el)
        })}  //fix this
      />
      <input
        type="text"
        name="formDB[location]"
        value={formDB.location}
        onChange={e => setFormDB({ ...formDB, location: e.target.value })}
      />
       <input
        type="text"
        name="formDB[description]"
        value={formDB.description}
        onChange={e => setFormDB({ ...formDB, description: e.target.value })}
      />

      <input type="submit" name="Confirm" />
    </form>     
    </div>
  );
}




export default App;
