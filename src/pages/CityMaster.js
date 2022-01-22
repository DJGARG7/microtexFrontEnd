import React from 'react';
import SideBar from '../components/Admin_components/SideBar';
import { CityMasterData } from './CityMasterData';
function CityMaster(props) {
  return (
  <div>
    <h1>This is city </h1>
      {/* <SideBar SideBarData={CityMasterData} userDetails={props.userDetails} /> */}
  </div>
  );
}

export default CityMaster;
