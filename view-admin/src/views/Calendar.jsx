import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import './Calendar.css'
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles

export default function Calendar() {
  return (
    <div className="container mt-4">
    <div className="row justify-content-center">
        <FullCalendar
          plugins={[dayGridPlugin, bootstrapPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
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
        />
      </div>
    </div>

  )
}