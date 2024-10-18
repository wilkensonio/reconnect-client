import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import { CModal, CForm, CButton, CCard} from '@coreui/react';
import { CSSTransition } from 'react-transition-group';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Calendar() {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({ title: '', startTime: '', endTime: '', description: '' });
  const [events, setEvents] = useState([]); 
  // Handle date click to show form
  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setVisible(true);
     
  };

  const getDateTime = (date, time) => {
    const [hours, minutes] = time.split(':'); 
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes);
    return dateTime.toISOString(); 
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const start = getDateTime(selectedDate, formData.startTime); 
    const end = getDateTime(selectedDate, formData.endTime);

    const newEvent = {
      title: formData.title,
      start: start,
      end: end,
      description: formData.description,
      color: formData.color, 
    }; 

    setEvents([...events, newEvent]); 
    setFormData({title: '', startTime: '', endTime: '', description: '', color: 'ff9f00'})
    setVisible(false); 
  };

  const handleCloseForm = () => {
    setVisible(false);
  };

  return (
    <>
      <CCard className='mb-3'>
        <div className='container'>
          <div className="row justify-content-center">
            <div className='col-12 col-md-10 col-lg-8'> 
            <FullCalendar
              plugins={[dayGridPlugin,timeGridPlugin,bootstrapPlugin,interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth timeGridWeek timeGridDay',
              }}
              buttonText={{
                prev: '<', 
                next: '>',
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
                
              }}
              
              themeSystem="bootstrap"
              dateClick={handleDateClick}
              events={events}
              eventContent={renderEventContent}
              
            />
            </div>
          </div>
        </div>
      </CCard>
        <CModal onClose={handleCloseForm} visible={visible} fade>
          <div className="row justify-content-center">
            <form onSubmit={handleFormSubmit} className="col-md-6">
              <h3>{selectedDate ? selectedDate.toDateString() : ''}</h3>

              <div className="form-group">
                <label>Event Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="form-group mt-2">
                <label>Start Time:</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group mt-2">
                <label>End Time:</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>

              <div className="form-group mt-2">
                <label>Event Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter event description"
                />
              </div>

              <div className="mt-3">
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary ml-2" onClick={handleCloseForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </CModal>
    </>
  );
}

const renderEventContent = (eventInfo) => {
  return (
    <div style={{backgroundColor: eventInfo.event.extendedProps.color, padding: '5px', borderRadius: '5px'}}>
      <strong>{eventInfo.event.title}</strong>
      <div>{eventInfo.event.extendedProps.description}</div>
    </div>

  )
}
