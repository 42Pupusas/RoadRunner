import React, { useEffect, useState } from 'react';
import QRCode from "qrcode.react";

interface PaymentProps {
    invoice: string;
    amount: number;
}
const PaymentScreen = (props: PaymentProps) => {
    const [timer, setTimer] = useState(120); // Initial value for timer is 120 seconds

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prevTimer) => prevTimer > 0 ? prevTimer - 1 : 0);
        }, 1000);

        // Clear the interval when the component is unmounted, or when timer reaches 0
        return () => clearInterval(countdown);
    }, []);

    return (
        <>
            <div className="fixed z-[1000001]">
                <div className="bg-dark mx-24 mt-56 min-h-fit w-fit rounded-lg  shadow-lg pt-4 border border-light">
                    <div className="">
                        <div className="mx-auto w-52 my-1">
                            <p className="text-xs text-center text-white">Prepay Your Driver:
                            </p>
                            <p className="text-xs text-center text-white">{timer} seconds</p>
                        </div>
                        <QRCode
                            className="mx-auto min-h-fit w-fit border border-light rounded-lg bg-white p-1"
                            value={props.invoice!}
                            size={128}
                        />
                        <div>
                            <p className=" mt-2 text-center text-white font-bold">{props.amount!} sats</p>
                        </div>
                        <div className="mx-auto w-52">
                            <div className="flex w-full items-center justify-center">
                                <div className="flex h-14 w-full cursor-pointer flex-col ">
                                    <div className="flex items-center justify-center space-x-1">
                                        <p className="w-1/2 text-xs text-white select-all overflow-hidden whitespace-nowrap max-w-xs truncate ">{props.invoice!}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
export default PaymentScreen;
