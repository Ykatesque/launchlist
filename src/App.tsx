import React, {useState} from 'react';
import axios from 'axios';
import LaunchCard from './components/LaunchCard';
import SpaceXLogo from './components/SpaceXLogo';


import './App.css';

interface Launch {
  flight_number: number;
  name: string;
  details: string;
  date_precision: string;
  links: {
    presskit: string;
    wikipedia: string;
  }
}

interface SpaceXResponse {
  docs: Launch[];
  hasNextPage: true;
  hasPrevPage: false;
}

const App = () => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showResults, setShowResults]  = useState<boolean>(false);


  const getLaunchesQuery = () => {
    axios
      .post<SpaceXResponse>('https://api.spacexdata.com/v5/launches/query', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          "options": {
            "limit": 200,
            "page": 1,
            "select": {
                "name": 1,
                "id": 1,
                "date_local": 1,
                "flight_number": 1,
                "details": 1,
                "links": 1,
                "date_precision": 1
            },
            "sort": {
                "flight_number": "asc"
            }
          }
        },
        timeout: 10000,
      })
      .then((response) => {
        setLaunches(response.data.docs);
        setShowResults(true)
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div className="App">
      {showResults ? 
      <>
       {launches.map((launch: Launch, i: number) => (
            <LaunchCard
                flightNumber={launch.flight_number}
                rocketName={launch.name}
                details={launch.details}
                links={launch.links}
                launchYear={launch.date_precision}
            />
        ))
        }
      </>
      :
      <div className="entryScreen">
          <div className="title">
            <SpaceXLogo/>
            <button className="showResultsBtn" onClick={()=> getLaunchesQuery() }>View All Launches</button>
          </div>
      </div>
    }
  </div>

  );
}

export default App;
