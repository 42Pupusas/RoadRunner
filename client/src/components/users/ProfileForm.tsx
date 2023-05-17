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
    <>
      <h2>Edit Profile</h2>
      <p>
        Keep in mind a new profile event is created every time, no data is
        persisted from the old one!
      </p>
      <br />
      <div className="flex flex-row">
        <div className="mr-4">
          <h3>Username</h3>
          <input
            className="text-black placeholder:text-black"
            type="text"
            ref={username}
          />
          <h3>Avatar</h3>
          <input
            type="text"
            ref={avatar}
            className="text-black placeholder:text-black"
          />
          <h3>Car</h3>
          <input
            type="text"
            ref={car}
            className="text-black placeholder:text-black"
          />
          <h3>Car Avatar</h3>
          <input
            type="text"
            ref={carAvatar}
            className="text-black placeholder:text-black"
          />
        </div>
        <FontAwesomeIcon
          className="h-8 w-8 cursor-pointer rounded-full bg-dark p-2 text-white hover:bg-light"
          icon={faIdCard}
          onClick={createProfile}
        />
      </div>
    </>
  );
};
