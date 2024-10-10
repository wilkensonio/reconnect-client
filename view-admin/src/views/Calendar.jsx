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
            start: 'prevYear', 
            center: 'title',
            // left: 'today prev next', 
            end: 'nextYear', 
           
          }}
          
          themeSystem="bootstrap" // Use Bootstrap theme for FullCalendar
        />
      </div>
    </div>

  )
}