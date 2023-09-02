import { useContext, useEffect, useState } from "react";

import { findProfileByPublicKey } from "@/models/relays/RideFinder";
import type { Profile } from "@/models/roadrunner/Profile";

import { UserContext } from "../utils/contextproviders/UserContext";

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
      <div className="relative flex max-w-[16rem] flex-col rounded-xl bg-white bg-clip-border  shadow-md">
        <div className="relative m-0 overflow-hidden rounded-none bg-transparent bg-clip-border shadow-none">
          <img src={profile?.getAvatar()!} alt="car avatar" />
        </div>
        <div className="p-2">
          <p className="mt-3 block text-sm text-dark leading-relaxed antialiased">
            Welcome back {profile?.getUsername()!}!
          </p>
        </div>
        {profile?.getCar() ? (
          <div className="flex items-center justify-evenly p-2">
            <div className="flex items-center space-x-3">
              <img
                alt="profile picture"
                src={profile.getCarAvatar()!}
                className="h-9 w-9 rounded-full border-2 border-light object-cover object-center hover:z-10"
                data-tooltip-target="author-1"
              />
              <p className="text-sm font-medium text-dark">
                {profile?.getCar()!}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};
