import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { getUserByEmail } from '../apiservice/UserService';
import { getAvailability } from '../apiservice/AvailabilityService';
import {
  updateAppointment,
  getAppointments,
  deleteAppointment,
  scheduleAppointment,
} from '../apiservice/AppointmentService';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
} from '@coreui/react';
import { Link } from 'react-router-dom';


function Calendar() {
  const [events, setEvents] = useState([]); // appointments
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const [success, SetSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false); 
  const [updateOrScheduleBtnClicked, setUpdateOrScheduleBtnClicked] = useState(false);  
 

  const [formData, setFormData] = useState({
    student_id: '',
    title: '',
    start: '',
    end: '',
  });

  useEffect(() => { 
    setError('');
    const loggedInUser = localStorage.getItem('reconnect_signin_email'); 
    const getUser = async () => {
      try {
        const user = await getUserByEmail(loggedInUser);
        setUser(user);
      } catch (error) {
        setError('Failed to get user');
        console.error(error);
      }
    }
    getUser();
  }, []);


  useEffect(() => {
    const fetchAvailability = async () => {
        try {
            const response = await getAvailability(user.user_id); 
            
            const formattedAvailability = response.data.map(entry => ({
                day: entry.day,
                startTime: entry.start_time,
                endTime: entry.end_time,
                userId: entry.faculty_id,
                id: entry.id,  
            }));
            if(user.user_id)
              setAvailability(formattedAvailability);
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };
    if (user) {
        fetchAvailability();
    }
}, []); 


  // Fetch appointments to display in the calendar
  useEffect(() => { 
    const fetchAppointments = async () => {
      if (!user) return;
      
      setError('');
      try {
        const appointments = await getAppointments(user.user_id);
  
        const formattedAppointments = appointments.map((appointment) => {
          const date = appointment.date;
          const startDateTime = new Date(`${date}T${appointment.start_time}`);
          const endDateTime = new Date(`${date}T${appointment.end_time}`); 
          if (isNaN(startDateTime) || isNaN(endDateTime)) {
            console.warn(`Invalid date format for appointment with id: ${appointment.id}`);
            return null;
          }
  
          return {
            id: appointment.id,                      
            title: appointment.reason || 'No Title',  
            start: startDateTime.toISOString(),      
            end: endDateTime.toISOString(),
            student_id: appointment.student_id,
          };
  
        }).filter(Boolean);   
        
        if((user.user_id != null) ||( user.user_id !=  undefined || user.user_id != ''))
          setEvents(formattedAppointments);
        setError(''); 
      } catch (error) {
        setError('Failed to get appointments');
        console.error('Failed to get appointments:', error);
        return;
      }
      
    }; 
    
    fetchAppointments();
  }, [user?.user_id]);
 
  

  const handleDateClick = (arg) => {
    setError(''); 
    const isAvailable = !availability.includes(arg.dateStr);
    if (isAvailable) {
      const date = new Date(arg.dateStr + 'T00:00:00');
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setSelectedDate(formattedDate);

      // Set start and end to the date clicked, defaulting to 16:00 (4 PM)
      const startDateTime = new Date(arg.dateStr + 'T10:00');
      const endDateTime = new Date(arg.dateStr + 'T10:15');  

      setFormData({
        student_id: '',
        title: '',
        start: startDateTime.toISOString().slice(0, 16),  
        end: endDateTime.toISOString().slice(0, 16),
      });
      setModalOpen(true);
    } else {
      alert('This date is unavailable.');
    }
  };

  const handleEventClick = (arg) => { 
    setError('');
    SetSuccess('');
    const appointment = events.find(event => event.id === Number(arg.event.id));

    if (appointment) {
      setCurrentAppointment(appointment);
      const date = new Date(appointment.start);

      setSelectedDate(date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }));
      setFormData({
        title: appointment.title,
        start: appointment.start.slice(0, 16),  
        end: appointment.end.slice(0, 16),
        student_id: appointment.student_id,
      }); 
      setModalOpen(true);
    } else {
      setError('Failed to find appointment');
    }
  };

  const handleModalClose = () => {
    setError('');
    SetSuccess('');
    setConfirmDelete(false);
    setModalOpen(false);
    setSelectedDate(null);
    setCurrentAppointment(null);
    setFormData({student_id:'', title: '', start: '', end: '' });
    setUpdateOrScheduleBtnClicked(false);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based, pad with 0
    const day = String(date.getDate()).padStart(2, '0');
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return {
        formattedDate: `${year}-${month}-${day}`,  
        formattedTime: `${hours}:${minutes}`  
    };
  }; 


  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('User not found');
      return;
    } 
    
    setError('');
    SetSuccess(''); 

    const start = new Date(formData.start);
    const end = new Date(formData.end);
    const now = new Date(); 
    
    if (start < now) {
      setError('Cannot schedule an appointment in the past.');
      return;
    }   
  
    if (end <= start) {
      setError('End time must be after start time.');
      return;
    }

    // Check for overlapping appointments
    const isOverlapping = events.some(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (
        (start >= eventStart && start < eventEnd) ||   
        (end > eventStart && end <= eventEnd) ||       
        (start <= eventStart && end >= eventEnd)       
      );
    });

    if (!updateOrScheduleBtnClicked && isOverlapping) {
      setError('This time slot is already taken. Please choose a different time.');
      return;
    } 
    
    const newAppt = { 
      "start_time": formatDateTime(formData.start).formattedTime,
      "end_time": formatDateTime(formData.end).formattedTime,
      "student_id": formData.student_id,
      "faculty_id": user.user_id, // faculty_id is the logged-in user's id 
      "reason": formData.title,
      "date": formatDateTime(formData.start).formattedDate
    } 
    
    if (currentAppointment) { 
      try { 
        
        if (formatDateTime(currentAppointment.start).formattedTime !== newAppt.start_time 
          || formatDateTime(currentAppointment.end).formattedTime !== newAppt.end_time 
           || currentAppointment.title !== newAppt.reason) {
          const newScheduledAppointment =  await updateAppointment(currentAppointment.id, newAppt);
          SetSuccess('Appointment updated'); 
          setEvents((prevEvents) => [
            ...prevEvents,
            {
              id: newScheduledAppointment.id,
              title: newAppt.reason,
              start: formData.start,
              end: formData.end,
              student_id: formData.student_id,
            },
          ]);
        } else {
          SetSuccess('No changes made');
        };
      } catch (error) {
        setError('Failed to update appointment');
        console.error('Failed to update appointment:', error);
      } 
    } else{ 
      try { 
        setError('');
        const newScheduledAppointment = await scheduleAppointment(newAppt);
        SetSuccess('Appointment scheduled');
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: newScheduledAppointment.id,
            title: newAppt.reason,
            start: formData.start,
            end: formData.end,
            student_id: formData.student_id,
          },
        ]);
      } catch (error) {
        const errMessage = error.detail; 
        if (errMessage.includes('pymysql.err.IntegrityError')){ 
          setError('Student not found check student ID');
        }else{
          setError('Failed to schedule appointment');
        }
      }
    } 
  };

  const handleDeleteAppointment = async () => {
    setError('');
    SetSuccess(''); 
    if(!confirmDelete){
      setConfirmDelete(true); 
    } else 
        if (currentAppointment) {
          try {
            await deleteAppointment(currentAppointment.id);
            SetSuccess('Appointment cancelled');

            setEvents((prevEvents) => 
              prevEvents.filter(event => event.id !== currentAppointment.id)
            );
            setConfirmDelete(false);
          } catch (error) {
            setError('Failed to cancel appointment'); 
          }
        }
  };

  return (
    <div>
      <h1 className="text-center text-white mt-3 mb2">Calendar</h1>
         <div className='mb-3'>
                <Link to='/faculty/dashboard'>
                    <span className='text-white'>Back to dashboard</span>
                </Link>
            </div>
      <div className="d-flex justify-content-center shadow">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
          initialView="dayGridMonth"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          editable={true}
          selectable={true}
          
        />
      </div>

      {/* Scheduling/updating appointments */}
      <CModal visible={modalOpen} onClose={handleModalClose}>
        <CModalHeader>
          <CModalTitle>{currentAppointment ? 'Update Appointment' : 'Schedule Appointment'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h5>{selectedDate}</h5> {/* Display the selected date */}
          <CForm onSubmit={handleSaveAppointment}>
            <CFormInput
              type="text"
              label="Student ID"
              name="student_id"
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
              required
            />
            <CFormInput
              type="text"
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <CFormInput
              type="datetime-local"
              label="Start"
              name="start"
              value={formData.start}
              onChange={(e) => setFormData({ ...formData, start: e.target.value })}
              required
            />
            <CFormInput
              type="datetime-local"
              label="End"
              name="end"
              value={formData.end}
              onChange={(e) => setFormData({ ...formData, end: e.target.value })}
            />
            <CModalFooter>
              <CButton className='ccolor' type="submit"
              onClick={() => { 
                currentAppointment && setUpdateOrScheduleBtnClicked(true)} 
              }>
                {currentAppointment ? 'Update' : 'Schedule'}
              </CButton>
              {currentAppointment && (
                <CButton color="danger" onClick={handleDeleteAppointment}>   
                  {!confirmDelete ? 'Delete' : 'confirm Delete'}
                </CButton>
              )} 
            </CModalFooter>
              <div className='text-center h5 mt-2 mb-5'>
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}
              </div>
          </CForm>
        </CModalBody>
      </CModal>
    </div>
  );
}

export default Calendar;
