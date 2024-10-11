import React, { useState }  from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css'
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles

export default function Calendar() {
  const [events, setEvents] = useState([]);

  const handleDateClick = (arg) => {
    const title = prompt('Enter event title:'); 
    if (title) {
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: String(prevEvents.length + 1), 
          title,
          start: arg.dateStr, 
          end: arg.dateStr,
          
        },
      ]);
    }
  };

  return (
    <div className="container mt-4">
    <div className="row justify-content-center">
        <FullCalendar
          plugins={[dayGridPlugin, bootstrapPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
          }}

          buttonText= {{
            prev: '<',
            next:  '>',
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day'
          }}

   
          themeSystem="bootstrap" // Use Bootstrap theme for FullCalendar
          dateClick={handleDateClick} 
        />
      </div>
    </div>

  )
}