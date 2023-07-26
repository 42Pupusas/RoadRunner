import { ProfileFull } from "@/components/users/ProfileFull";
import UserLogin from "@/components/users/UserLogin";
import { UserContext } from "@/components/utils/contextproviders/UserContext";
import {
  faPersonWalkingLuggage,
  faCarSide,
  faGear,
  faXmark,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useContext } from "react";

const Index = () => {
  const {user, logout} = useContext(UserContext)!;

  return (
    <div className="flex flex-col items-center justify-center m-8 mt-20">
      <div>
        <title>RoadRunner</title>
      </div>
      <div className="space-y-4 text-center">
        {!user ? (
          <>
            <img
              className="h-48 w-48 rounded-full object-cover object-center mx-auto"
              src="/logo/logorr.png"
              alt="RoadRunner Logo"
            />
            <div>
              <p>RoadRunner</p>
              <p>A peer-2-peer Ride Sharing Service</p>
              <br />
              <UserLogin />
            </div>
          </>
        ) : (
          <div className="space-y-8 text-center flex flex-col items-center justify-center m-4">
            <ProfileFull />
            <div className="flex flex-row space-x-8">
              <div>
                <p>Find a Ride</p>

                <Link href="/passenger/">
                  <FontAwesomeIcon
                    className="h-8 w-8 cursor-pointer rounded-full bg-dark p-2 text-white hover:bg-light"
                    icon={faPersonWalkingLuggage}
                  />
                </Link>
              </div>
              <div>
                <p>Offer a Ride</p>
                <Link href="/drivers/">
                  <FontAwesomeIcon
                    className="h-8 w-8 cursor-pointer rounded-full bg-dark p-2 text-white hover:bg-light"
                    icon={faCarSide}
                  />
                </Link>
              </div>
            </div>
            <div className="flex flex-row space-x-8">
              <div>
                <p>Edit Profile</p>
                <Link href="/settings/">
                  <FontAwesomeIcon
                    className="h-8 w-8 cursor-pointer rounded-full bg-dark p-2 text-white hover:bg-light"
                    icon={faGear}
                  />
                </Link>
              </div>
              <div>
                <p>Learn More</p>
                <Link href="/about/">
                  <FontAwesomeIcon
                    className="h-8 w-8 cursor-pointer rounded-full bg-dark p-2 text-white hover:bg-light"
                    icon={faBookOpen}
                  />
                </Link>
              </div>
            </div>
            <div>
              <p>Log Out</p>
              <FontAwesomeIcon
                className="h-6 w-6 cursor-pointer rounded-full bg-red-700 p-2 text-white hover:bg-red-800"
                icon={faXmark}
                onClick={() => {logout();}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
