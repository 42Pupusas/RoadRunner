import { useEffect, useState } from "react";

import { findRatingByPublicKey } from "@/models/relays/RideFinder";
import type { Profile } from "@/models/roadrunner/Profile";

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
        <div className="relative p-2 flex w-full max-w-[26rem] flex-col rounded-xl bg-light bg-clip-border shadow-none">
          <div className="relative flex items-center gap-4 overflow-hidden rounded-xl bg-transparent bg-clip-border shadow-none">
            <img
              src={profile.getAvatar()!}
              alt="tania andrew"
              className="relative inline-block h-[58px] w-[58px] !rounded-full object-cover object-center"
            />
            <div className="flex w-full flex-col gap-0.5">
            <h2 className="mb-2 block font-semibold leading-snug tracking-normal text-white text-base antialiased">
                {profile.getUsername()}
              </h2>
              <div className="flex items-center justify-between">
                <h5 className="block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                  {rating ? <h4>{rating} stars</h4> : <h4>Loading...</h4>}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
