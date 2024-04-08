import React, { useState, useEffect } from 'react';
import './App.css';

const formatTime = (time) => {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const formatClockInTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const App = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isCallbackIn, setIsCallbackIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [clockInTime, setClockInTime] = useState(null);
  const [lunchStartTime, setLunchStartTime] = useState(null);
  const [lunchBreakTimeRemaining, setLunchBreakTimeRemaining] = useState(1800000);
  const [timelineEntries, setTimelineEntries] = useState([]);
  const [showAddNotesModal, setShowAddNotesModal] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let clockInInterval;
    let lunchBreakInterval;

    if (isClockedIn || isCallbackIn) {
      clockInInterval = setInterval(() => {
        setElapsedTime(Date.now() - clockInTime.getTime());
      }, 1000);
    }

    if (isOnBreak) {
      lunchBreakInterval = setInterval(() => {
        setLunchBreakTimeRemaining((prevTime) => prevTime - 1000);
      }, 1000);
    }

    return () => {
      clearInterval(clockInInterval);
      clearInterval(lunchBreakInterval);
    };
  }, [isClockedIn, isCallbackIn, isOnBreak, clockInTime]);

  useEffect(() => {
    if (lunchBreakTimeRemaining <= 0) {
      setIsOnBreak(false);
      setLunchBreakTimeRemaining(1800000);
    }
  }, [lunchBreakTimeRemaining]);

  const clockIn = () => {
    setIsClockedIn(true);
    setClockInTime(new Date());
    setTimelineEntries([
      {
        time: formatClockInTime(new Date()),
        label: 'Clocked In',
        icon: 'images/Clock.svg',
      },
      ...timelineEntries,
    ]);
  };

  const clockOut = () => {
    setIsClockedIn(false);
    setIsOnBreak(false);
    setElapsedTime(0);
    setTimelineEntries([]);
  };

  const callbackIn = () => {
    setIsCallbackIn(true);
    setClockInTime(new Date());
    setTimelineEntries([
      {
        time: formatClockInTime(new Date()),
        label: 'Callback In',
        icon: 'images/Clock.svg',
      },
      ...timelineEntries,
    ]);
  };

  const callbackOut = () => {
    setIsCallbackIn(false);
    setIsOnBreak(false);
    setElapsedTime(0);
    setTimelineEntries([]);
  };

  const takeLunch = () => {
    setIsOnBreak(true);
    setLunchStartTime(new Date());
    setTimelineEntries([
      {
        time: formatClockInTime(new Date()),
        label: 'Started Lunch Break',
        icon: 'images/Lunch.svg',
      },
      ...timelineEntries,
    ]);
  };

  const endLunch = () => {
    setIsOnBreak(false);
    setTimelineEntries([
      {
        time: formatClockInTime(new Date()),
        label: 'Ended Lunch Break',
        icon: 'images/Lunch.svg',
      },
      ...timelineEntries,
    ]);
  };

  const addNotes = () => {
    if (notes.trim()) {
      setTimelineEntries([
        {
          time: formatClockInTime(new Date()),
          label: 'Notes:',
          text: notes,
          icon: 'images/Notes.svg',
        },
        ...timelineEntries,
      ]);
      setNotes('');
      setShowAddNotesModal(false);
    }
  };

  const disableCallbackInButton = () => {
    const currentHour = new Date().getHours();
    return currentHour < 12 && currentHour >= 6;
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <div className={`timer-container ${isClockedIn || isCallbackIn ? 'clocked-in' : ''} ${isOnBreak ? 'on-break' : ''}`}>
          <div className="timer-header">
            <span className="timer-status">
              {isClockedIn ? 'Working' : isCallbackIn ? 'Callback In' : isOnBreak ? 'On Break' : 'Ready To Work'}
            </span>
          </div>
          <div className="timer">
            <span className="time">
              {isOnBreak ? formatTime(lunchBreakTimeRemaining) : formatTime(elapsedTime)}
            </span>
          </div>
        </div>
        {(isClockedIn || isCallbackIn) && (
          <>
            <div className="separator">
              <span className="timeline-header">Timeline</span>
            </div>
            <div className="timeline-wrapper">
              <div className="timeline-container">
                <div className="timeline">
                  {timelineEntries.map((entry, index) => (
                    <div key={index} className="timeline-entry">
                      <div className="time-label-container">
                        <span className={`${entry.label.toLowerCase().replace(' ', '-')}-time`}>{entry.time}</span>
                        <span className="timeline-label">{entry.label}</span>
                        {entry.text && <span className="notes-text">{entry.text}</span>}
                      </div>
                      <img className="icon" src={entry.icon} alt="Icon" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="clock-actions">
        {!isClockedIn && !isCallbackIn && (
          <>
            <button className="clock-in-btn" onClick={clockIn}>
              Clock In
            </button>
            <button className="callback-in-btn" onClick={callbackIn} disabled={disableCallbackInButton()}>
              Callback In
            </button>
          </>
        )}
      </div>
      {(isClockedIn || isCallbackIn) && (
        <>
          <div className="bottom-section">
            <div className="separator actions-separator">
              <span className="actions-header">Actions</span>
            </div>
            <div className="action-buttons">
              <div className="action-buttons-row">
                <button className="add-notes-btn" onClick={() => setShowAddNotesModal(true)}>
                  Add Notes
                </button>
                <button className="start-travel-btn">Start Travel</button>
              </div>
              <div className={`action-buttons-row ${isOnBreak ? 'on-break' : ''}`}>
                {!isOnBreak ? (
                  <button className="take-lunch-btn" onClick={takeLunch}>
                    Take Lunch
                  </button>
                ) : (
                  <button className="end-lunch-btn" onClick={endLunch}>
                    End Lunch
                  </button>
                )}
                {isClockedIn ? (
                  <button className={`clock-out-btn ${isOnBreak ? 'full-width' : ''}`} onClick={clockOut}>
                    Clock Out
                  </button>
                ) : (
                  <button className={`callback-out-btn ${isOnBreak ? 'full-width' : ''}`} onClick={callbackOut}>
                    Callback Out
                  </button>
                )}
              </div>
            </div>
          </div>
          {showAddNotesModal && (
            <div className="add-notes-modal">
              <div className="modal-content">
                <h2>Add Notes</h2>
                <textarea
                  className="notes-textarea"
                  placeholder="Type your notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
                <div className="modal-buttons">
                  <button className="add-note-btn" onClick={addNotes}>
                    Add
                  </button>
                  <button className="cancel-notes-btn" onClick={() => setShowAddNotesModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;