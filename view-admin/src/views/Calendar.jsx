import React from 'react';
import Calendar from 'react-lightweight-calendar';
 
const MyCalendar = () => {
  const [currentDate, setCurrentDate] = React.useState('2023-06-02');
  return (
    <Calendar
      data={[
        {
          id: '1',
          startTime: '2023-06-02T01:10:00Z',
          endTime: '2023-06-02T03:10:00Z',
          title: 'Conference',
        },
        {
          id: '2',
          startTime: '2023-06-02T01:00:00Z',
          endTime: '2023-06-02T02:00:00Z',
          title: 'Meet up',
        },
        {
          id: '3',
          startTime: '2023-06-02T04:20:00Z',
          endTime: '2023-06-02T05:20:00Z',
          title: 'Codefair',
          bgColor: 'rgb(129, 205, 242)',
          textColor: 'white',
        },
      ]}
      currentView='WEEK_TIME'
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      activeTimeDateField='startTime-endTime' // Or just startTime or just endTime
      weekStartsOn={0} // Sunday
      timeRange = {{
        star: '00:00', 
        end: '23:00'
      }}
    />
  );
};
      
export default MyCalendar;