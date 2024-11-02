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
import {getUserByEmail} from '../apiservice/UserService'; 

export default function Calendar() {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({ title: '', startTime: '', endTime: '', description: '' });
  const [eventDetails, setEventDetails] = useState(null); // New state for event details
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAllDay, setIsAllDay] = useState(false); 
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  const [currentEvent, setCurrentEvent] = useState(null);

  
  useEffect(() => {
    const loggedInUser = localStorage.getItem('reconnect_signin_email');
    const getUser = async () => {
      try {
        const user = await getUserByEmail(loggedInUser);  
        setUser(user); 
      } catch (error) {
        console.error(error);
        tokenExpired(error.detail);
        console.error(error);
      }
    };
    getUser();
  }, []);  

  useEffect(() => { 
    const fetchAppointments = async () => {
      try { 
        const appointments = await getAllAppointments(user.user_id); 
        console.log(appointments, "appointments");

        const formattedEvents = appointments.map(app => ({
          aptid: app.id,
          date: app.date,
          start_time: app.start_time, 
          end_time: app.end_time, 
          reason: app.reason, 
          color: '#ff9f00',
        }));
        setEvents(formattedEvents);  
      } catch (error) {
        tokenExpired(error.detail);
        console.error(error);
      }
    };

    if (user.user_id) {
      const intervalId = setInterval(() => {
        fetchAppointments(); 
      }, 1000);  
      return () => clearInterval(intervalId);
    }  
  }, [user]);

  const handleUpdateAppointment = async () => {
    try {
      await updateAppointment({
        user_id: user.user_id,
        ...currentEvent,
      });
      setVisible(false);
      fetchAppointments(); // Refresh appointments
    } catch (error) {
      console.error(error);
    }
  };

  // Handle delete appointment
  const handleDeleteAppointment = async () => {
    if (currentEvent) {
        const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
        if (!confirmDelete) return; // If user cancels, do nothing

        setLoading(true);
        try {
            console.log("Attempting to delete appointment with ID:", currentEvent.aptid);
            await deleteAppointment(currentEvent.aptid); // Make sure deleteAppointment accepts aptid
            setEvents(prevEvents => prevEvents.filter(event => event.aptid !== currentEvent.aptid)); // Update events state
            console.log("Appointment deleted successfully.");
        } catch (error) {
            console.error("Error deleting appointment:", error); // Log error details
            alert("Failed to delete appointment. Please try again.");
        } finally {
            setLoading(false);
        }
    }
    setVisible(false);
};
  // Update event click handler
  const handleEventClick = (info) => {
    const { event } = info;

    if (event.extendedProps) {
        setEventDetails({
            start_time: event.extendedProps.start_time,
            end_time: event.extendedProps.end_time,
            description: event.extendedProps.reason,
        });

        // Set the formData with the clicked event details
        setFormData({
            title: event.title,
            startTime: event.extendedProps.start_time,
            endTime: event.extendedProps.end_time,
            description: event.extendedProps.reason,
        });

        // Show the modal to edit the appointment
        setVisible(true);

        // Store the current event for potential deletion
        setCurrentEvent(event);
    }
};

  // Function to close the modal
  const handleCloseModal = () => {
    setVisible(false);
    setEventDetails(null); // Clear event details
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

  const generateTimeOptions = () => {
    const options = [];
    const interval = 15;
    for (let hour = 1; hour < 24; hour++) {
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
  };

  useEffect(() => {
    updateCurrentDate(); 
  }, [])

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
                <CCol xs={12} md={3}  lg={4} className="my-2 my-md-0 text-center">
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
                    select={handleSelect}
                    events={events}
                    eventClick={handleEventClick}
                    eventContent={(eventInfo) => {
                      return (
                        <>
                          <div style={{ cursor: 'pointer' }}> {/* Set cursor style inline */}
                            <span>{eventInfo.event.extendedProps.reason}</span>
                            <br />
                            <span>{eventInfo.event.extendedProps.start_time} - </span>
                            <span>{eventInfo.event.extendedProps.end_time}</span>
                          </div>
                        </>
                      );
                    }}
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

      <CModal onClose={() => setVisible(false)} visible={visible} fade>
            <div className="container">
                <form onSubmit={handleUpdateAppointment} className="p-5">
                    <h3 className="text-center">Edit Appointment</h3>
                    <div className="form-group mt-2">
                        <label>Start Time:</label>
                        <Select
                            options={generateTimeOptions()}
                            value={formData.startTime ? { value: formData.startTime, label: formData.startTime } : null}
                            onChange={(selected) => setFormData({ ...formData, startTime: selected.value })}
                            className="form-control"
                            placeholder={formData.startTime}
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
                            placeholder={formData.endTime}
                            required
                        />
                    </div>
                    <div className="form-group mt-2">
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="form-control w-100"
                            placeholder={formData.reason}
                        />
                    </div>
                    <div className="form-group mt-2">
                        <button type="submit" className="btn btn-primary w-100 mb-2">Update</button>
                        <button type="button" className="btn btn-danger w-100" onClick={handleDeleteAppointment}>Delete</button>
                    </div>
                </form>
            </div>
        </CModal>
        
    </>
  );
}
