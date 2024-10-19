import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import { CModal, CForm, CButton, CCard} from '@coreui/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Calendar() {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({ title: '', startTime: '', endTime: '', description: '' });
  const [events, setEvents] = useState([]); 
  const calendarRef = useRef(null);
  // Handle date click to show form
  const handleDateClick = (arg) => {
    const today = new Date();
    today.setHours(0,0,0,0); 

    if (arg.date < today) {
      alert('You can only schedule events for today or later.');
      return; 
    }

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

  const goprev = () => {
    const calenderApi = calendarRef.current.getApi(); 
    calenderApi.prev(); 
  }

  const gonext = () => {
    const calenderApi = calendarRef.current.getApi(); 
    calenderApi.next(); 
  } 

  const gotoday = () => {
    const calenderApi = calendarRef.current.getApi(); 
    calenderApi.today(); 
  } 

  const gomonth = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('dayGridMonth');
  } 

  const goweek = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('dayGridWeek');
  } 

  const goday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('dayGridDay');
  } 

  return (
    <>
      <CCard className='p-5 mt-5'>
          <div className="row justify-content-center">
            <div className='col-12 col-md-10 col-lg-8'> 
              <div className="container mb-4">
                <div className="row">
                  <div className="col-1">
                    <button className="btn btn-primary" onClick={goprev}>
                      {'<'}
                    </button>
                  </div>

                  <div className="col-1">
                    <button className="btn btn-primary" onClick={gonext}>
                      {'>'}
                    </button>
                  </div>
                  <div className="col-2">
                    <button className="btn btn-primary" onClick={gotoday}>
                      Today
                    </button>
                  </div>
                  <div className='col-2'>
                    <h5>
                      {calendarRef.current ? calendarRef.current.getApi().getCurrentData().currentDate.toLocaleString('default', { month: 'long' }) + ' ' + calendarRef.current.getApi().getCurrentData().currentDate.getFullYear() : ''}
                    </h5>
                  </div>
                  <div className="col-2 ">
                    <button className="btn btn-primary" onClick={gomonth}>
                      Month
                    </button>
                  </div>
                  <div className="col-2 ">
                    <button className="btn btn-primary" onClick={goweek}>
                      Week
                    </button>
                  </div>
                  <div className="col-2 ">
                    <button className="btn btn-primary" onClick={goday}>
                      Day
                    </button>
                  </div>
                </div>
              </div>
            <FullCalendar
              ref={calendarRef} 
              plugins={[dayGridPlugin, timeGridPlugin, bootstrapPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              dateClick={handleDateClick}
              events={events}
              eventContent={renderEventContent}
              themeSystem="bootstrap"
              headerToolbar={{
                left: '',
                center: '',
                right: ''
              }}
            />
            
        </div>
      </div>
      </CCard>
      <CModal onClose={handleCloseForm} visible={visible} fade>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-14 col-md-12 col-lg-10"> 
              <form onSubmit={handleFormSubmit} className='p-5'>
                <h3 className="text-center">{selectedDate ? selectedDate.toDateString() : ''}</h3>

                <div className="form-group">
                  <label>Event Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-control w-100"
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
                    className="form-control w-100"
                  />
                </div>

                <div className="form-group mt-2">
                  <label>End Time:</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="form-control w-100"
                  />
                </div>

                <div className="form-group mt-2">
                  <label>Event Description:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-control w-100"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="form-group mt-2"> 
                  <button type="submit" className="btn btn-primary w-100 mb-2">Submit</button>
                  <br></br>
                  <button type="button" className="btn btn-primary w-100" onClick={handleCloseForm}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
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
