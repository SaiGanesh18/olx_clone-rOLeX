import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function NumberDialogBox({ isOpen, onClose, onSave }) {
    const [inputNumber, setInputNumber] = useState('');

    const handleInputChange = (event) => {
        setInputNumber(event.target.value);
    };

    const handleSave = () => {
        const numberValue = parseFloat(inputNumber);
        if (!isNaN(numberValue)) {
            onSave(numberValue);
        }
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Number Dialog Box"
        >
            <h2>Enter a Number</h2>
            <input
                type="number"
                value={inputNumber}
                onChange={handleInputChange}
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
        </Modal>
    );
}

export default NumberDialogBox;
