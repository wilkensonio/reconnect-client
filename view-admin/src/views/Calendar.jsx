import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import interactionPlugin from '@fullcalendar/interaction';
import { CModal, CForm, CButton } from '@coreui/react';
import { CSSTransition } from 'react-transition-group';
import './Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Calendar() {
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({ title: '', startTime: '', endTime: '', description: '' });

  // Handle date click to show form
  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setVisible(true);
  };

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
    setVisible(false); // Hide the modal after form submission
  };

  const handleCloseForm = () => {
    setVisible(false);
  };

  return (
    <div>
      <div className="row justify-content-center">
        <FullCalendar
          plugins={[dayGridPlugin, bootstrapPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth dayGridWeek dayGridDay',
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
        />
      </div>

      {/* Modal transition */}
      <CSSTransition in={visible} timeout={1000} classNames="modal" unmountOnExit>
        <CModal visible={visible} onClose={handleCloseForm}>
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
      </CSSTransition>
    </div>
  );
}
