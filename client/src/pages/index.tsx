import { ProfileFull } from '@/components/users/ProfileFull';
import UserLogin from '@/components/users/UserLogin';

const Index = () => {
  return (
    <>
      <div>
        <title>RoadRunner</title>
      </div>
      <div className="space-y-4">
        <div>
          <h2>RoadRunner</h2>
          <p>Welcome To RoadRunner, a peer-2-peer ride sharing service.</p>
        </div>
        <UserLogin />
        <ProfileFull />
      </div>
    </>
  );
};

export default Index;
