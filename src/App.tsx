import React, {useState} from 'react';
import axios from 'axios';
import LaunchCard from './components/LaunchCard';
import SpaceXLogo from './components/SpaceXLogo';


import './App.css';

interface Launch {
  flight_number: number;
  name: string;
  rocket: string;
  details: string;
  date_utc: Date;
  id: string;
  //lots of presskit links are combing back empty and currently redirecting to spaceX website, although the urls are valid
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
  const [sortOrder, setSortOrder] = useState<string>("asc");


  //ideally this function would come from a file like Api.tsx where all the api requests are held, and then imported here

  const getNextPage = (page: number, keyword: string ) => {
    axios
      .post<SpaceXResponse>('https://api.spacexdata.com/v5/launches/query/', {
        headers: {
          'Content-Type': 'application/json',
        },
          options: {
            page: page,
            "sort": {
                "flight_number": keyword
            }
          }
      })
      .then((response) => {
        setLaunches(response.data.docs);
        setPreviousPage(response.data.hasPrevPage);
        setCurrentPage(response.data.page);
        setNextPage(response.data.hasNextPage);
        setSortOrder(keyword);
        setShowResults(true);
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
        <div className="innerNav">
          {sortOrder == "asc" ? <button className="navButton" onClick={() => getNextPage(1, "desc")}> Sort by DESCENDING</button> : <button className="navButton" onClick={() => getNextPage(1, "asc")}>Sort by Ascending</button> }
        </div>
        <div className="innerNav">

        {PreviousPage && <button className="navButton" onClick={() => getNextPage(currentPage - 1, sortOrder)}>{loading? "Loading..." : "Previous Page"}</button>}
        {NextPage && <button className="navButton" onClick={() => getNextPage(currentPage + 1, sortOrder)}>{loading? "Loading..." : "Next Page"}</button>}
        </div>
      </div>
      <div className="launchesWrapper">
        {launches.map((launch: Launch, i: number) => (
              <LaunchCard
                  key={i}
                  flightNumber={launch.flight_number}
                  name={launch.name}
                  rocketName={launch.rocket}
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
            <button className="showResultsBtn" onClick={()=> getNextPage(1, sortOrder) }>{loading? "Loading..." : "View All Launches"}</button>
          </div>
      </div>
    }
  </div>

  );
}

export default App;
