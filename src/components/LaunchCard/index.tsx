import React, {useEffect, useState} from 'react';
import './style.css';
import axios from 'axios';


interface Props {
    flightNumber: number;
    rocketName: string;
    name: string;
    details: string;
    launchYear: Date;
    links: {
        presskit: string;
        wikipedia: string;
      }
      
}

const LaunchCard = ({ flightNumber, rocketName, details, launchYear, links, name }: Props) => {
  
  const [plainTextName, setPlainTextName ] = useState<string>();
  
  //simple useEffect to get rocketname based off of launch data
  useEffect(() => {
      //ideally this function would come from a file like Api.tsx where all the api requests are held, and then imported here to be utilized in the hook
    axios
        .get(  `https://api.spacexdata.com/v4/rockets/${rocketName}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          setPlainTextName(response.data.name)
        })
        .catch((error) => {
          console.log(error);
        });
 
  }, []);




  return (
    <div className="wrapper">
        <div className="flightNumber">
            <div className="headerCell">Flight Number</div>
            <div className="value">{flightNumber}</div>
            </div>
        <div className="rocketName">
            <div className="headerCell">Rocket Name</div>
            <div className="value">{plainTextName}</div>
        </div>
        <div className="launchName">
            <div className="headerCell">Launch Name</div>
            <div className="value">{name}</div>
        </div>
        <div className="launchYear">
        <div className="headerCell">Launch Year</div>
        <div className="value"> {launchYear ?  launchYear.toString().split("-")[0] : "Not Launched" }</div>
        </div>
        <div className="details">
            <div className="headerCell">Details</div>
            <div className="value"> {details ? details : "No Details Yet"} </div>
        </div>
        <div className="details">
            {/* not the cleanest or most readable expression = but I wanted to provide at least 1 fallback if the presskit wasn't available, ideally all of these calc would live in their own links component */}
            { (links.presskit  || links.wikipedia)  !== null && (links.presskit  || links.wikipedia)  !== '' && <div className="headerCell"> Links </div> }
            <div className="value"> 
              { links.wikipedia && <a href={links.wikipedia}>Wikipedia</a> } 
              { links.presskit && <a href={links.presskit}>PressKit</a> }
              </div>
        </div>
    </div>
  );
}

export default LaunchCard;