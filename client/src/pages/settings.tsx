import React from "react";

import { ProfileForm } from "@/components/users/ProfileForm";
import Link from "next/link";
import { ReactSVG } from "react-svg";

function Settings() {
    return (
        <>
            <div>
                <title>Settings - RoadRunner</title>
            </div>
            <div className="flex flex-col items-center justify-center m-4 space-y-8">
                <ProfileForm />
                <Link href="/">
                    <ReactSVG
                        src="/buttons/simple/home-white.svg"
                        className="m-2 h-12 w-12 cursor-pointer rounded-full bg-light p-2 border border-white text-white hover:bg-dark"
                    />
                </Link>

            </div>
        </>
    );
}

export default Settings;
