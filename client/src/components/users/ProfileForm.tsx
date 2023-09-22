import { faIdCard } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useRef } from "react";

import { Profile } from "@/models/roadrunner/Profile";

import { UserContext } from "../utils/contextproviders/UserContext";

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

    const deleteProfile = () => {};

    return (
        <div className="space-y-4">
            <h2>Edit Profile</h2>
            <p>
                Keep in mind a new profile event is created every time, no data
                is persisted from the old one!
            </p>
            <br />
            <div className="p-4 flex-col space-y-12">
                    <input
                        className="w-full text-black border border-black border-t-transparent 
                        border-l-transparent border-r-transparent 
                        outline outline-0 placeholder:text-black"
                        type="text"
                        placeholder="Username"
                        ref={username}
                    />
                    <input
                        type="text"
                        placeholder="Avatar URL"
                        ref={avatar}
                        className="w-2/3 text-black border border-black border-t-transparent 
                        border-l-transparent border-r-transparent 
                        outline outline-0 placeholder:text-black"
                    />

                    <p>
                     Drivers should also fill out the following:
                    </p>
                    <input
                        className="w-full text-black border border-black border-t-transparent 
                        border-l-transparent border-r-transparent outline outline-0 
                        placeholder:text-black"
                        type="text"
                        placeholder="Car Model"
                        ref={car}
                    />
                    <input
                        className="w-2/3 text-black border border-black 
                        border-t-transparent border-l-transparent border-r-transparent 
                        outline outline-0 placeholder:text-black"
                        type="text"
                        placeholder="Car Avatar URL"
                        ref={carAvatar}
                    />
            </div>
            <button
                className="bg-dark text-white p-2 rounded-lg border-0 "
                onClick={createProfile}
            >
             Edit Profile
            </button>
            <button
                className="bg-red-500 text-white p-2 rounded-lg border-0"
                onClick={deleteProfile}
            >
                Delete Profile
            </button>


        </div>
    );
};
