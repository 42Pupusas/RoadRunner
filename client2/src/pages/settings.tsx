import React from 'react';

import CreateKeys from '@/components/users/CreateKeys';
import { ProfileForm } from '@/components/users/ProfileForm';

function Settings() {
  return (
    <>
      <div>
        <title>Settings - RoadRunner</title>
      </div>
      <div>
        <ProfileForm />
        <br />
        <br />
        <CreateKeys />
      </div>
    </>
  );
}

export default Settings;
