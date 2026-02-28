import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const DigitalClock = (props) => {
    const [currentTime, setCurrentTime] = useState(() => new Date());
    // const [timeOffset, setTimeOffset] = useState(0)
    // const layoutSelector = createSelector(
    //     state => state.Layout,
    //     layout => ({
    //         timediffer: layout.timediffer,
    //     })
    // );
    // const {
    //     timediffer,
    // } = useSelector(layoutSelector);

    // useEffect(() => {
    //     setTimeOffset(timediffer)
    // }, [timediffer])

    // Update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date(Date.now()));
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='d-flex p-0 h-100 align-items-center px-4 text-white justify-content-between' style={{ minWidth: '400px', backgroundColor: 'rgb(34 39 54)' }}>
            {currentTime && (
                <>
                    <span className="fs-2 fw-bold me-2 w-40">
                        {currentTime.toLocaleTimeString('en-GB', { hour12: false })}
                    </span>
                    <span className="fs-5 w-60">
                        {currentTime
                            .toLocaleDateString('en-GB', {
                                weekday: 'long',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            }).replace(',', '')
                            .replace(/(\d{2})\/(\d{2})\/(\d{4})/, (_, d, m, y) => `${d}-${m}-${y}`)}
                    </span>
                </>
            )}
        </div>
    )
}

export default DigitalClock