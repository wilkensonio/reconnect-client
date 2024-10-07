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
      weekStartsOn={1} // Monday
      // If you want additional customization, uncomment the code and make the appropriate changes
      // renderItem={(data, isHovered) => {
        // Custom rendering of event element
        // return (
              // <>
                // <div>{data.title}</div>
                // <div>{data.id}</div>
              // </>
          // )
        // console.log(data, isHovered);
      // }}
      // renderItemText={(data) => {
        // Custom rendering of event element text
        // return <p>{data.title}</p>;
      // }}
      // renderHeaderItem={(data, extras) => {
        // Custom rendering of header element
        // return <div>{data.startTime}-{date.endTime}</div>;
      // }}
      // renderHeaderItemText={(data) => {
        // Custom rendering of header element text
        // return <p>{data.title}</p>;
      // }}
      enableHoverEffect={true}
      colorDots={[
        {
          color: 'red',
          text: 'Busy day',
          date: '2023-06-02',
        },
      ]}
      timeDateFormat={{
        day: 'EEEE',
        hour: 'hh a',
        monthYear: 'LLLL yyyy',
      }}
      onDayNumberClick={(day) => {
        // Handle day number click
        console.log(day);
      }}
      onDayStringClick={(day) => {
        // Handle day text click
        console.log(day);
      }}
      onHourClick={(value) => {
        // Handle hour click
        console.log(value);
      }}
      onColorDotClick={(value) => {
        // Handle color dot click
        console.log(value);
      }}
      onItemClick={(item) => {
        // Handle event item click
        console.log(item);
      }}
      onCellClick={(value) => {
        // Handle cell click
        console.log(value);
      }}
      cellDisplayMode={{
        WEEK_TIME: {
          inactiveCells: ['2023-05-29'],
          state: 'CUSTOM',
        },
      }}
    />
  );
};
      
export default MyCalendar;