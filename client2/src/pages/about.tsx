const About = () => {
  return (
    <>
      <div>
        <title>About - RoadRunner</title>
      </div>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2>Our Mission</h2>
          <p>
            RoadRunner leverages decentralized technologies like Nostr and BTC
            as a first step to decentralize ride sharing services.
          </p>

          <p>
            Our mission is NOT to become the largest ride sharing service out
            there.
          </p>
          <p>
            Our goal is to allow ANYONE in the world to run their own ride
            sharing service.
          </p>
          <p className="font-bold">
            Keep in mind this site is still under contruction!
          </p>
        </div>
        <div className="space-y-2">
          <h2>Support Us</h2>
          <p>
            We are a very small, independent team from El Salvador, with no
            backing yet.
          </p>
          <p>
            If you like this project, you can donate to the following BTC
            address:
          </p>
          <span className="select-all text-xs uppercase text-black sm:text-sm">
            bc1qrzsuac0n0kkwzs24rq5p3nf0uh2zpq86er55cs
          </span>
        </div>
      </div>
    </>
  );
};

export default About;
