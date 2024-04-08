import React from 'react';

const AddNotesModal = ({ isOpen, notes, setNotes, onAddNotes, onClose }) => {
    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };

    const handleAddNotes = () => {
        onAddNotes();
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="add-notes-modal">
            <div className="modal-content">
                <h2>Add Notes</h2>
                <textarea
                    className="notes-textarea"
                    placeholder="Type your notes here..."
                    value={notes}
                    onChange={handleNotesChange}
                />
                <div className="modal-buttons">
                    <button className="add-note-btn" onClick={handleAddNotes}>
                        Add
                    </button>
                    <button className="cancel-notes-btn" onClick={handleClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNotesModal;