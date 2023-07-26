import { faIdCard } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useRef } from 'react';

import { Profile } from '@/models/roadrunner/Profile';

import { UserContext } from '../utils/contextproviders/UserContext';

export const ProfileForm = () => {
  const { user } = useContext(UserContext)!;
  const username = useRef<HTMLInputElement>(null);
  const avatar = useRef<HTMLInputElement>(null);
  const car = useRef<HTMLInputElement>(null);
  const carAvatar = useRef<HTMLInputElement>(null);

  const createProfile = () => {
    if (!user) return;
    if (!username.current) return;
    const newProfile = new Profile(
      user.getPublicKey(),
      username.current.value,
      car.current?.value!,
      avatar.current?.value!,
      carAvatar.current?.value!,
      null
    );
    newProfile.publishProfileEvent(user);
  };

  return (
    <div className="flex flex-col items-center justify-center m-4 space-y-4">
      <h2>Edit Profile</h2>
      <p className="">
        Keep in mind a new profile event is created every time, no data is
        persisted from the old one!
      </p>
      <br />
      <div className="flex flex-row space-x-4">
        <div className="space-y-8">
          <input
            className="text-black border border-black border-t-transparent border-l-transparent border-r-transparent outline outline-0 placeholder:text-black"
            type="text"
            placeholder='Username'
            ref={username}
          />
          <input
            type="text"
            placeholder='Avatar URL'
            ref={avatar}
            className="text-black border border-black border-t-transparent border-l-transparent border-r-transparent outline outline-0 placeholder:text-black"
          />
          <input
            className="text-black border border-black border-t-transparent border-l-transparent border-r-transparent outline outline-0 placeholder:text-black"
            type="text"
            placeholder='Car Model'
            ref={car}
          />
          <input
            className="text-black border border-black border-t-transparent border-l-transparent border-r-transparent outline outline-0 placeholder:text-black"
            type="text"
            placeholder='Car Avatar URL'
            ref={carAvatar}
          />
        </div>
        <FontAwesomeIcon
          className="h-8 w-8 cursor-pointer rounded-full bg-dark p-2 text-white hover:bg-light"
          icon={faIdCard}
          onClick={createProfile}
        />
      </div>
    </div>
  );
};
