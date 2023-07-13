import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

interface AddressInputProps {
  onTextChange: (text: string) => void;
  title: string;
}

const AddressInputComponent: React.FC<AddressInputProps> = ({
  title,
  onTextChange,
}) => {
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
    <div className="flex flex-row space-x-4 items-center">
      <div className="relative">
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          className="peer font-nexa h-full w-full rounded-md border border-white border-t-transparent bg-transparent px-3 py-3 text-sm font-normal text-white outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-white focus:border-2 focus:border-dark focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-white"
        />
        <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-white transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-white before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-white after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-dark peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-white peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-dark peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-dark peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-dark">
          {title}
        </label>
      </div>

      <FontAwesomeIcon
        icon={faQuestion}
        onClick={handleTextChange}
        className="h-6 w-6 cursor-pointer rounded-full bg-white p-1 text-dark hover:bg-dark hover:text-white"
      />
      {error && (
        <p className="text-red-500">Error occurred. Please try again.</p>
      )}
    </div>
  );
};

export default AddressInputComponent;
