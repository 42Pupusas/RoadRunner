import { ProfileFull } from "@/components/users/ProfileFull";
import UserLogin from "@/components/users/UserLogin";
import { UserContext } from "@/components/utils/contextproviders/UserContext";
import Link from "next/link";
import { useContext } from "react";
import { ReactSVG } from "react-svg";

const Index = () => {
    const { user, logout } = useContext(UserContext)!;

    return (
        <div className="flex flex-col items-center justify-center">
            <div>
                <title>RoadRunner</title>
            </div>
            <div className="space-y-4 text-center">
                {!user ? (
                    <>
                        <img
                            className="h-56 w-56 rounded-full object-cover object-center mx-auto"
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
                    <div className="space-y-10 text-center flex flex-col items-center justify-center">
                        <ProfileFull />

                        <div className="flex flex-row space-x-10">
                            <div>
                                <Link href="/passenger">
                                    <ReactSVG
                                        className="h-28 w-28"
                                        src="/buttons/find-a-ride.svg"
                                    />
                                </Link>
                            </div>
                            <div>
                                <Link href="/drivers">
                                    <ReactSVG
                                        className="h-28 w-28"
                                        src="/buttons/offer-a-ride.svg"
                                    />
                                </Link>
                            </div>
                        </div>

                        <div className="flex flex-row space-x-8">
                            <div>
                                <Link href="/settings">
                                    <ReactSVG
                                        className="h-28 w-28"
                                        src="/buttons/edit-profile.svg"
                                    />
                                </Link>
                            </div>
                            <div>
                                <Link href="/about">
                                    <ReactSVG
                                        className="h-28 w-28"
                                        src="/buttons/learn-more.svg"
                                    />
                                </Link>
                            </div>
                        </div>
                        <div>
                            <ReactSVG
                                className="h-16 w-16"
                                src="/buttons/log-out.svg"
                                onClick={logout}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Index;
