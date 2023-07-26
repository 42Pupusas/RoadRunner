const About = () => {
    return (
        <>
            <div className="m-12 mt-20 flex flex-col items-center justify-center">
                <div>
                    <title>About - RoadRunner</title>
                </div>
                <div className="p-2">
                    <div className="space-y-2">
                        <h2>Mission</h2>
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
                    <br />
                    <h2>Backers</h2>
                    <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
                        <div className="relative flex w-72 flex-col rounded-xl bg-white bg-clip-border text-dark shadow-md">
                            <div className="relative mx-4 mt-4 h-32 overflow-hidden rounded-xl bg-white bg-clip-border text-dark">
                                <img
                                    src="/sponsors/yakihonne.jpg"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="mb-2 flex items-center justify-between">
                                    <a
                                        href="https://yakihonne.com/"
                                        className="block font-sans text-sm font-medium leading-relaxed text-blue-gray-900 antialiased"
                                    >
                                        YakiHonne
                                    </a>
                                </div>
                                <p className="block font-sans text-xs font-normal leading-normal text-black antialiased opacity-75">
                                    Second place winner of the Nostr Hackathon
                                </p>
                            </div>
                        </div>
                        <div className="relative flex w-72 flex-col rounded-xl bg-white bg-clip-border text-dark shadow-md">
                            <div className="relative mx-4 mt-4 h-32 overflow-hidden rounded-xl bg-white bg-clip-border text-dark">
                                <img
                                    src="/sponsors/baltic.jpeg"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <div className="mb-2 flex items-center justify-between">
                                    <a
                                        href="https://twitter.com/cercatrova_21/status/1675940788541222918"
                                        className="block font-sans text-sm font-medium leading-relaxed text-blue-gray-900 antialiased"
                                    >
                                        Daktari and Cercatrova
                                    </a>
                                </div>
                                <p className="block font-sans text-xs font-normal leading-normal text-black antialiased opacity-75">
                                    Baltic Sea Circle Fundraiser donation.{" "}
                                </p>
                                <br />
                                <p className="block font-sans text-xs font-normal leading-normal text-black antialiased opacity-75">
                                    Full Sponsor List:{" "}
                                </p>
                                <ul className="overflow-scroll h-12 text-xs">
                                    <li>
                                        <a href="https://coinpages.io/">Coinpages</a>
                                    </li>
                                    <li>
                                        <a href="https://coinfinity.co/">Coinfinity</a>
                                    </li>
                                    <li>
                                        <a href="https://www.lesfemmesorange.work/">
                                            Les Femmes Orange
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://terahash.space/">Terahash</a>
                                    </li>
                                    <li>
                                        <a href="https://the-burgery.de/">The Burgery</a>
                                    </li>
                                    <li>
                                        <a href="https://business-bitcoin.de/">Business Bitcoin</a>
                                    </li>
                                    <li>
                                        <a href="https://www.lilienschaenke-sportsbar.de">
                                            Lilienschaenke Sportsbar
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://www.seedor.io/">Seedor</a>
                                    </li>
                                    <li>
                                        <a href="https://hotel-princess.de/">Hotel Princess</a>
                                    </li>
                                    <li>
                                        <a href="https://pocketbitcoin.com/">Pocket Bitcoin</a>
                                    </li>
                                    <li>
                                        <a href="https://bitbox.swiss/es/">BitBox</a>
                                    </li>
                                    <li>
                                        <a href="https://einundzwanzig.space/">Einundzwanzig</a>
                                    </li>
                                    <li>
                                        <a href="https://copiaro.de/">Copiaro</a>
                                    </li>
                                    <li>
                                        <a href="https://konsensus.network/">Konsensus Network</a>
                                    </li>
                                    <li>
                                        <a href="https://einundzwanzig.space/gesundes-geld/">
                                            Gesundes Geld
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://bitcoin-mentoring.me/">
                                            Bitcoin Mentoring
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <br />
                    <h2>Support Us</h2>
                    <p>
                        We are a very small, independent team from El Salvador.
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
