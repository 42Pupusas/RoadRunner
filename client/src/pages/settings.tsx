import React from 'react';

import { ProfileForm } from '@/components/users/ProfileForm';

function Settings() {
  return (
    <>
      <div>
        <title>Settings - RoadRunner</title>
      </div>
      <div className="flex flex-col items-center justify-center m-8">
        <ProfileForm />
      </div>
    </>
  );
}

export default Settings;
