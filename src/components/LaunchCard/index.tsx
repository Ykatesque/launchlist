import React from 'react';
import './style.css';


interface Props {
    flightNumber: number;
    rocketName: string;
    details: string;
    launchYear: string;

    links: {
        presskit: string;
        wikipedia: string;
      }
}

const LaunchCard = ({ flightNumber, rocketName, details, launchYear, links }: Props) => {

  return (
    <div className="wrapper">
        <div className="flightNumber">
            <div className="headerCell">Flight Number</div>
            <div className="value">{flightNumber}</div>
            </div>
        <div className="rocketName">
            <div className="headerCell">Rocket Name</div>
            <div className="value">{rocketName}</div>
        </div>
        <div className="launchYear">
        <div className="headerCell">Launch Year</div>
        <div className="value"> {launchYear}</div>
        </div>
        <div className="details">
            <div className="headerCell">Details</div>
            <div className="value"> {details} </div>
        </div>
        {links.presskit === "" ? <a  className="link" onClick={() => window.open(links.wikipedia)}>Wikipedia Link</a> :<a  className="link" onClick={() => window.open(links.presskit)}>Presskit</a>}
    </div>
  );
}

export default LaunchCard;