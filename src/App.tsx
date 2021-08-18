import React, {useState} from 'react';
import axios from 'axios';
import LaunchCard from './components/LaunchCard';
import SpaceXLogo from './components/SpaceXLogo';


import './App.css';

interface Launch {
  flight_number: number;
  name: string;
  details: string;
  date_utc: Date;
  links: {
    presskit: string;
    wikipedia: string;
  }
}

interface SpaceXResponse {
  docs: Launch[];
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const App = () => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showResults, setShowResults]  = useState<boolean>(false);
  const [NextPage, setNextPage] = useState<boolean>(false);
  const [PreviousPage, setPreviousPage] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1)

  const getNextPage = (page: number ) => {
    axios
      .post<SpaceXResponse>('https://api.spacexdata.com/v5/launches/query/', {
        headers: {
          'Content-Type': 'application/json',
        },
          options: {
            page: page,
            "sort": {
                "flight_number": "desc"
            }
          }
      })
      .then((response) => {
        setLaunches(response.data.docs);
        setPreviousPage(response.data.hasPrevPage);
        setCurrentPage(response.data.page);
        setNextPage(response.data.hasNextPage);
        setShowResults(true)
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };



  return (
    <div className="App">
      {showResults ? 
      <>
      <div className="fixedNav">
        {PreviousPage && <button className="navButton" onClick={() => getNextPage(currentPage - 1)}>{loading? "Loading..." : "Previous Page"}</button>}
        {NextPage && <button className="navButton" onClick={() => getNextPage(currentPage + 1)}>{loading? "Loading..." : "Next Page"}</button>}
      </div>
      <div className="launchesWrapper">
        {launches.map((launch: Launch, i: number) => (
              <LaunchCard
                  key={i}
                  flightNumber={launch.flight_number}
                  rocketName={launch.name}
                  details={launch.details}
                  links={launch.links}
                  launchYear={launch.date_utc}
              />
          ))
          }
      </div>
      </>
      :
      <div className="entryScreen">
          <div className="title">
            <SpaceXLogo/>
            <button className="showResultsBtn" onClick={()=> getNextPage(1) }>{loading? "Loading..." : "View All Launches"}</button>
          </div>
      </div>
    }
  </div>

  );
}

export default App;
