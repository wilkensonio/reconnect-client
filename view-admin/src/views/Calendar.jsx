import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import { CModal, CForm, CButton, CCard, CCol, CRow, CContainer } from '@coreui/react';
import Select from 'react-select';
import timeGridPlugin from '@fullcalendar/timegrid';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Calendar.css';

export default function Calendar() {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({ title: '', startTime: '', endTime: '', description: '' });
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateClick = (arg) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const newEvent = [
    {
    id: '1',
    title: 'Advising with Dr.Wilk',
    start: '2024-10-25T10:00:00',
    end: '2024-10-25T12:00:00',
    description: 'Wilkenson is the goat',
    color: '#ff9f00',
    },
    

    
      {
      id: '2',
      title: 'Meeting with Hacker Escobar',
      start: '2024-10-26T11:00:00',
      end: '2024-10-26T13:00:00',
      description: 'Jonny is the goat',
      color: '#ff9f00',
      }
  ];

  useEffect(() => {
    setEvents(newEvent); 
    updateCurrentDate(); 
  }, []); 

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      title: formData.title, 
      start: `${selectedDate.toISOString().split('T')[0]}T${formData.startTime}`,
      end: `${selectedDate.toISOString().split('T')[0]}T${formData.endTime}`, 
      description: formData.description, 
      color: '#ff9f00'
    }


    setEvents([...events, newEvent]);
    setFormData({ title: '', startTime: '', endTime: '', description: ''});
    setVisible(false);
  };




  const handleCloseForm = () => {
    setVisible(false);
  };

  const goprev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    updateCurrentDate();
  };

  const gonext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    updateCurrentDate();
  };

  const updateCurrentDate = () => {
    const calendarApi = calendarRef.current.getApi();
    setCurrentDate(calendarApi.getDate());
  };

  const listview = () => {
    const calendarApi = calendarRef.current.getApi(); 
    calendarApi.changeView('listYear');
  }

  useEffect(() => {
    updateCurrentDate();
  }, []);

  const gotoday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    updateCurrentDate();
  };

  const gomonth = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('dayGridMonth');
  };

  const goweek = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('timeGridWeek');
  };

  const goday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView('timeGridDay');
  };

  const generateTimeOptions = () => {
    const options = [];
    const interval = 15;
    for (let hour = 1; hour < 13; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const formattedHour = String(hour).padStart(2, '0');
        const formattedMinute = String(minute).padStart(2, '0');
        const time = `${formattedHour}:${formattedMinute}`;
        options.push({ value: time, label: time });
      }
    }
    return options;
  };

  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol lg={10} className="mx-auto">
            <CCard className="p-4 mb-3 mt-3 mx-auto">
              <CRow className="align-items-center justify-content-between text-center text-md-start">
                <CCol xs={12} md={4} lg={3} className="d-flex justify-content-center justify-content-md-start gap-2">
                  <button className="btn btn-outline-dark" onClick={goprev}>{'<'}</button>
                  <button className="btn btn-outline-dark" onClick={gonext}>{'>'}</button>
                  <button className="btn btn-outline-dark" onClick={gotoday}>Today</button>
                </CCol>
                <CCol xs={12} md={4} lg={6} className="mt-2 mt-md-0 text-center">
                  <h5>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h5>
                </CCol>
                <CCol xs={12} md={4} lg={3} className="d-flex justify-content-center justify-content-md-end gap-2 mt-2 mt-md-0">
                  <button className="btn btn-outline-dark" onClick={gomonth}>Month</button>
                  <button className="btn btn-outline-dark" onClick={goweek}>Week</button>
                  <button className="btn btn-outline-dark" onClick={goday}>Day</button>
                  <button className='btn btn-outline-dark' onClick={listview}>List</button>
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol>
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, bootstrapPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    dateClick={handleDateClick}
                    events={events}
                    eventContent={renderEventContent}
                    eventDisplay="block"
                    dayHeaderFormat={{
                      weekday: 'short'
                    }}
                    themeSystem="bootstrap"
                    headerToolbar={false} 
                    height="auto"
                    
                  />
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      <CModal onClose={handleCloseForm} visible={visible} fade>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-14 col-md-12 col-lg-10">
              <form onSubmit={handleFormSubmit} className="p-5">
                <h3 className="text-center">{selectedDate ? selectedDate.toDateString() : ''}</h3>

                <div className="form-group">
                  <label>Display Availability:</label>
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
                  <Select
                    options={generateTimeOptions()}
                    value={formData.startTime ? { value: formData.startTime, label: formData.startTime } : null}
                    onChange={(selected) => setFormData({ ...formData, startTime: selected.value })}
                    className="form-control"
                    placeholder="Select Start Time"
                    required
                  />
                </div>

                <div className="form-group mt-2">
                  <label>End Time:</label>
                  <Select
                    options={generateTimeOptions()}
                    value={formData.endTime ? { value: formData.endTime, label: formData.endTime } : null}
                    onChange={(selected) => setFormData({ ...formData, endTime: selected.value })}
                    className="form-control"
                    placeholder="Select End Time"
                    required
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
                  <button type="submit" className="btn ccolor w-100 mb-2">Submit</button>
                  <button type="cancel" className="btn ccolor w-100 mb-2">Cancel</button>
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
