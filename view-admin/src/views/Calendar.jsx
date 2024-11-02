import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import { CModal, CButton, CCard, CCol, CRow, CContainer } from '@coreui/react';
import Select from 'react-select';
import timeGridPlugin from '@fullcalendar/timegrid';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './Calendar.css';
import { getAllAppointments, updateAppointment, deleteAppointment } from '../apiservice/CalendarService'; 
import { getUserByEmail } from '../apiservice/UserService'; 

export default function Calendar() {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({ title: '', startTime: '', endTime: '', description: '' });
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [user, setUser] = useState('');
  const [currentEvent, setCurrentEvent] = useState(null);
  const calendarRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('reconnect_signin_email');
    const getUser = async () => {
      try {
        const user = await getUserByEmail(loggedInUser);  
        setUser(user); 
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, []);  

  useEffect(() => { 
    const fetchAppointments = async () => {
      if (user) {
        try { 
          const appointments = await getAllAppointments(user.user_id); 
          const formattedEvents = appointments.map(app => ({
            aptid: app.id,
            date: app.date,
            title: app.reason,
            start: app.date + 'T' + app.start_time,
            end: app.date + 'T' + app.end_time,
            extendedProps: {
              date: app.date,
              start_time: app.start_time,
              end_time: app.end_time,
              reason: app.reason,
            },
            color: '#ff9f00',
          }));
          setEvents(formattedEvents);  
        } catch (error) {
          console.error(error);
        }
      }
    };

    if (user) {
      fetchAppointments(); 
      const intervalId = setInterval(fetchAppointments, 10000);
      return () => clearInterval(intervalId);
    }  
  }, [user]);

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        reason: formData.description,
      };

      const updatedAppointment = await updateAppointment(currentEvent.aptid, updatedData);
      setVisible(false);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.aptid === updatedAppointment.id 
            ? { ...event, ...updatedData } 
            : event
        )
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleDeleteAppointment = async (appointment_id) => {
    setLoading(true);
    try { 
      await deleteAppointment(appointment_id);
      setEvents(prevEvents => prevEvents.filter(event => event.aptid !== appointment_id));  
    }
    catch (error) { 
      console.error(error);
    } finally {
      setLoading(false);
    }  
  } 
  
  const handleEventClick = (info) => {
    const { event } = info;
    setFormData({
      title: event.title,
      date: event.start.toISOString().split('T')[0], 
      startTime: event.extendedProps.start_time,
      endTime: event.extendedProps.end_time,
      description: event.extendedProps.reason,
    });
    setCurrentEvent(event); 
    setVisible(true); 
  };

  const handleCloseModal = () => {
    setVisible(false);
    setFormData({ title: '', date: '', startTime: '', endTime: '', description: '' });
    setCurrentEvent(null); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generateTimeOptions = () => {
    const options = [];
    const interval = 15;
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const formattedHour = String(hour).padStart(2, '0');
        const formattedMinute = String(minute).padStart(2, '0');
        const time = `${formattedHour}:${formattedMinute}`;
        options.push({ value: time, label: time });
      }
    }
    return options;
  };

  const handleSelect = (selectionInfo) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (selectionInfo.start < today) {
      return; 
    }
    setVisible(true); 
  };

  const updateCurrentDate = () => {
    const calendarApi = calendarRef.current.getApi();
    setCurrentDate(calendarApi.getDate());
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

  const listview = () => {
    const calendarApi = calendarRef.current.getApi(); 
    calendarApi.changeView('listYear');
  }

  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol lg={10} className="mx-auto">
            <CCard className="p-4 mb-3 mt-3 mx-auto">
              <CRow className="align-items-center justify-content-between text-center text-md-start">
                <CCol xs={12} md={3} lg={3} className="d-flex justify-content-center justify-content-md-start gap-2">
                  <button className="btn btn-outline-dark" onClick={goprev}>{'<'}</button>
                  <button className="btn btn-outline-dark" onClick={gonext}>{'>'}</button>
                  <button className="btn btn-outline-dark" onClick={gotoday}>Today</button>
                </CCol>
                <CCol xs={12} md={3} lg={4} className="my-2 my-md-0 text-center">
                  <h5>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h5>
                </CCol>
                <CCol xs={12} md={4} lg={3} className="d-flex justify-content-center justify-content-md-end gap-2 mt-2 mt-md-0">
                  <button className="btn btn-outline-dark" onClick={gomonth}>Month</button>
                  <button className="btn btn-outline-dark" onClick={goweek}>Week</button>
                  <button className="btn btn-outline-dark" onClick={goday}>Day</button>
                  <button className='btn btn-outline-dark' onClick={listview}>Agenda</button>
                </CCol>
              </CRow>
              <CRow className="mt-4">
                <CCol>
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, bootstrapPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    selectable
                    events={events}
                    eventClick={handleEventClick}
                    eventContent={(eventInfo) => (
                      <div style={{ cursor: 'pointer' }}>
                        <span>{eventInfo.event.extendedProps.reason}</span>
                        <br />
                        <span>{eventInfo.event.extendedProps.start_time} - </span>
                        <span>{eventInfo.event.extendedProps.end_time}</span>
                      </div>
                    )}
                    eventDisplay="block"
                    dayHeaderFormat={{
                      weekday: 'short'
                    }}
                    themeSystem="bootstrap"
                    headerToolbar={false} 
                  />
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
      <CModal visible={visible} onClose={handleCloseModal}>
        <form onSubmit={handleUpdateAppointment}>
          <div className="modal-header">
            <h5 className="modal-title">Appointment Details</h5>
            <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input 
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <Select
                options={generateTimeOptions()}
                name="startTime"
                value={generateTimeOptions().find(option => option.value === formData.startTime)}
                onChange={(option) => setFormData({ ...formData, startTime: option.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <Select
                options={generateTimeOptions()}
                name="endTime"
                value={generateTimeOptions().find(option => option.value === formData.endTime)}
                onChange={(option) => setFormData({ ...formData, endTime: option.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <CButton type="submit" color="primary">Save Changes</CButton>
            <CButton color="danger" onClick={() => handleDeleteAppointment(currentEvent.aptid)}>Delete</CButton>
            <CButton color="secondary" onClick={handleCloseModal}>Close</CButton>
          </div>
        </form>
      </CModal>
    </>
  );
}
