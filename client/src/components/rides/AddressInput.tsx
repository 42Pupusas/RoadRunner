import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

interface AddressInputProps {
  onTextChange: (text: string) => void;
  title: string;
}

const AddressInputComponent: React.FC<AddressInputProps> = ({ title, onTextChange }) => {
    const [text, setText] = useState("");
    const [error, setError] = useState(false);
  
    const handleTextChange = () => {
      try {
        onTextChange(text); // Pass the current text as props to the higher-level components
        setError(false); // Reset the error state if there was no error
      } catch (error) {
        console.error("Error handling address input:", error);
        setError(true); // Set the error state to true if an error occurred
      }
    };
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newText = event.target.value;
      setText(newText);
    };
  
    return (
      <div>
        <h3 className="text-black">{title}</h3>
        <input type="text" value={text} onChange={handleInputChange} />
        <FontAwesomeIcon
          icon={faBoltLightning}
          onClick={handleTextChange}
          className="inline-block h-4 w-4 cursor-pointer rounded-full bg-white p-1 text-light hover:bg-dark"
        />
        {error && <p className="text-red-500">Error occurred. Please try again.</p>}
      </div>
    );
  };
  
export default AddressInputComponent;
