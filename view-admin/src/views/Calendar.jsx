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
import { getAllAppointments, deleteAppointment } from '../apiservice/CalendarService'; 
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
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await getUserByEmail(loggedInUser);  
        setUser(userData); 
      } catch (error) {
        console.error(error);
      }
    };
    getUser();
  }, []);  
  
  useEffect(() => { 
    
    const getAllAppointments = async () => { 
      setLoading(true); // Set loading before fetching
      try {  
        const appointments = await getAllAppointments(user.user_id); 
        setEvents(appointments);  // Update events instead of currentEvent
      } catch (error) {
        tokenExpired(error.detail); // Ensure this function handles error appropriately
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    const intervalId = setInterval(() => {
      getAllAppointments(); 
    }, 1000);  // Adjusted interval to 5 seconds
  
    return () => clearInterval(intervalId);
  }, [user]);  
  


  // const handleUpdateAppointment = async (e) => {
  //   e.preventDefault();
  //   if (formData.startTime >= formData.endTime) {
  //       alert('End time must be after start time.');
  //       return;
  //   }
  //   try {
  //       const updatedData = {
  //           date: formData.date,
  //           start_time: formData.startTime,
  //           end_time: formData.endTime,
  //           reason: formData.description,
  //       };
  
  //       const updatedAppointment = await updateAppointment(currentEvent.aptid, updatedData);  // Ensure aptid is defined.
  //       setVisible(false);
  //       setEvents(prevEvents => 
  //           prevEvents.map(event => 
  //               event.aptid === currentEvent.aptid 
  //                   ? { ...event, ...updatedData }
  //                   : event
  //           )
  //       );
  //   } catch (error) {
  //       console.error("Error updating appointment:", error);
  //   }
  // };

  const handleDeleteAppointment = async (appointment_id) => {
    setLoading(true);
    try { 
      await deleteAppointment(appointment_id);
      setEvents(prevEvents => prevEvents.filter(event => event.aptid !== appointment_id));  
      handleCloseModal(); // Close the modal after deletion
    } catch (error) { 
      console.error("Error deleting appointment:", error);
    } finally {
      setLoading(false);
    }  
  };

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
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
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
    setSelectedDate(selectionInfo.start);
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
              <CCol xs={12} md={3} lg={3} className="d-flex justify-content-center justify-content-md-start gap-2 mb-2 mb-md-0">
                <CButton color="outline" onClick={goprev}>{'<'}</CButton>
                <CButton color="outline" onClick={gonext}>{'>'}</CButton>
                <CButton color="outline" onClick={gotoday}>Today</CButton>
              </CCol>
              <CCol xs={12} md={3} lg={4} className="my-2 my-md-0">
                <h5 className="m-0">{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h5>
              </CCol>
              <CCol xs={12} md={4} lg={3} className="d-flex justify-content-center justify-content-md-end gap-2 mt-2 mt-md-0">
                <CButton color="outline" onClick={gomonth}>Month</CButton>
                <CButton color="outline" onClick={goweek}>Week</CButton>
                <CButton color="outline" onClick={goday}>Day</CButton>
                <CButton color="outline" onClick={listview}>Agenda</CButton>
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
        <form>
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
            <CButton color="danger" onClick={() => handleDeleteAppointment(currentEvent?.aptid)}>Delete</CButton>
            <CButton color="secondary" onClick={handleCloseModal}>Close</CButton>
          </div>
        </form>
      </CModal>
    </>
  );
}
