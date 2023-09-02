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
                    placeholder={title}
                    onChange={handleInputChange}
                    className="peer font-nexa h-full w-full  
                        border border-white border-t-transparent border-l-transparent border-r-transparent 
                        bg-transparent text-sm text-white outline outline-0 
                        px-1 placeholder:text-white"
                />
            </div>

            <FontAwesomeIcon
                icon={faQuestion}
                onClick={handleTextChange}
                className="h-6 w-6 cursor-pointer rounded-full border borde-white p-1 text-dark hover:bg-dark hover:text-white"
            />
            {error && (
                <p className="text-red-500">Error occurred. Please try again.</p>
            )}
        </div>
    );
};

export default AddressInputComponent;
