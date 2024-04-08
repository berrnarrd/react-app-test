import React from 'react';

const ActionButtons = ({
    isClockedIn,
    isOnBreak,
    handleClockIn,
    handleClockOut,
    handleTakeLunch,
    handleEndLunch,
    handleAddNotes,
}) => {
    return (
        <div className="bottom-section">
            <div className="separator actions-separator">
                <span className="actions-header">Actions</span>
            </div>
            <div className="action-buttons">
                <div className="action-buttons-row">
                    <button
                        className={`add-notes-btn ${isClockedIn || isOnBreak ? '' : 'hidden'}`}
                        onClick={handleAddNotes}
                    >
                        Add Notes
                    </button>
                    <button className="start-travel-btn">Start Travel</button>
                </div>
                <div className="action-buttons-row">
                    <button
                        className={`end-lunch-btn ${isOnBreak ? '' : 'hidden'}`}
                        onClick={handleEndLunch}
                    >
                        End Lunch
                    </button>
                    <button
                        className={`take-lunch-btn ${isClockedIn && !isOnBreak ? '' : 'hidden'}`}
                        onClick={handleTakeLunch}
                    >
                        Take Lunch
                    </button>
                    <button
                        className={`clock-out-btn ${isClockedIn ? '' : 'hidden'}`}
                        onClick={handleClockOut}
                    >
                        Clock Out
                    </button>
                    <button className="callback-out-btn hidden">Callback Out</button>
                </div>
            </div>
        </div>
    );
};

export default ActionButtons;