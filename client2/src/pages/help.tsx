import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

const Help = () => {
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState('New User');
  const [image, setImage] = useState('user.png');

  const titles = ['Passenger', 'Driver', 'New User'];

  const images = ['passenger.png', 'driver.png', 'user.png'];

  const nextHelpPage = () => {
    const nextIndex = (index + 1) % images.length;
    setIndex(nextIndex);
    setTitle(titles[nextIndex]!);
    setImage(images[nextIndex]!);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row">
        <h2 className="mr-8">Helpful Views</h2>
        <FontAwesomeIcon
          icon={faArrowRight}
          className="h-6 w-6 rounded-full bg-dark p-1  text-white hover:bg-light"
          onClick={nextHelpPage}
        />
      </div>

      <h3 className="text-base">{title}</h3>
      <img
        src={`/help/${image}`}
        alt="View of help pages with tags"
        className="h-max object-contain"
      />
    </div>
  );
};

export default Help;
