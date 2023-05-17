import { useEffect, useState } from 'react';

import { findRatingByPublicKey } from '@/models/relays/RideFinder';
import type { Profile } from '@/models/roadrunner/Profile';

interface ProfileCardProps {
  className?: string;
  profile: Profile;
}

export const DriverProfileCard = (props: ProfileCardProps) => {
  const { profile, className } = props;
  const [rating, setRating] = useState<string | null>(null);
  useEffect(() => {
    findRatingByPublicKey(profile.getPublicKey()).then((rate) => {
      setRating(rate);
    });
  }, [profile]);
  return (
    <>
      <div className={className}>
        <div className="flex flex-row rounded-lg bg-light p-2 opacity-90">
          <div>
            <h3 className="font-nexab text-base">{profile.getUsername()}</h3>
            <h4 className="">{profile.getCar()}</h4>
            {rating ? <h4>{rating}</h4> : <h4>Loading...</h4>}
          </div>
        </div>
        <img
          className="m-2 h-24 w-24 rounded-full"
          src={profile.getCarAvatar()!}
          alt="Profile Image"
        />
      </div>
    </>
  );
};

export const PassengerProfileCard = (props: ProfileCardProps) => {
  const { profile, className } = props;
  const [rating, setRating] = useState<string | null>(null);
  useEffect(() => {
    findRatingByPublicKey(profile.getPublicKey()).then((rate) => {
      setRating(rate);
    });
  }, [profile]);

  return (
    <>
      <div className={className}>
        <div className="space-y-2 rounded-lg bg-light p-2 opacity-90">
          <h3 className="font-nexab text-base">{profile.getUsername()}</h3>
          {rating ? <h4>{rating}</h4> : <h4>Loading...</h4>}
          <img
            className="h-24 w-24 rounded-full"
            src={profile.getAvatar()!}
            alt="Profile Image"
          />
        </div>
      </div>
    </>
  );
};
