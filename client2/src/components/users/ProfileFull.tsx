import { useContext, useEffect, useState } from 'react';

import { findProfileByPublicKey } from '@/models/relays/RideFinder';
import type { Profile } from '@/models/roadrunner/Profile';

import { UserContext } from '../utils/contextproviders/UserContext';

export const ProfileFull = () => {
  const { user } = useContext(UserContext)!;
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user)
      return () => {
        setProfile(null);
      };
    findProfileByPublicKey(user.getPublicKey()).then((event) => {
      setProfile(event);
    });
    return () => {
      setProfile(null);
    };
  }, [user]);

  return (
    <>
      {profile ? (
        <>
          <div className="flex flex-row">
            <h2 className="mr-4 w-36 text-base">
              Welcome back {profile.getUsername()}!
            </h2>
            {profile.getAvatar() ? (
              <img
                className="h-12 w-12 rounded-full"
                src={profile.getAvatar()!}
                alt="Profile Image"
              />
            ) : null}
          </div>
          <div className="flex flex-row">
            <h2 className="mr-4 w-36 text-base">{profile.getCar()}</h2>

            {profile.getCarAvatar() ? (
              <img
                className="h-12 w-12 rounded-full"
                src={profile.getCarAvatar()!}
                alt="Car Image"
              />
            ) : null}
          </div>
        </>
      ) : null}
    </>
  );
};
