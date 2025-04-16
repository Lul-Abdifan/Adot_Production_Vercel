import { CustomizingCalendar } from "../HospitalAdmin";
import { useState } from "react";
interface props{
  doctorId : string
}

function CalendarToShow({doctorId} : props) {
  return (
    <div>
      <CustomizingCalendar id = {doctorId as string} />
     
    </div>
  );
}

export default CalendarToShow;