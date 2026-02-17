import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BreakingNewsTicker = ({ headlines = [] }) => {
    const [width, setWidth] = useState(0);
    const tickerRef = useRef(null);

    // Allow for duplicated content to ensure smooth seamless loop
    const content = headlines.length > 0 ? headlines : ["BREAKING: NATIONAL STADIUM RENOVATION APPROVED", "ECONOMY: EXPORTS HIT RECORD HIGH", "WEATHER: MONSOON ALERTS ISSUED", "SPORTS: CRICKET TEAM ANNOUNCES SQUAD"];
    const displayHeadlines = [...content, ...content, ...content];

    useEffect(() => {
        if (tickerRef.current) {
            setWidth(tickerRef.current.scrollWidth - tickerRef.current.offsetWidth);
        }
    }, [headlines]);

    return (
        <div className="w-full bg-primary border-b border-red-700 overflow-hidden relative z-50 h-10 flex items-center shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 bg-red-800 px-4 flex items-center z-10 skew-x-[-10deg] ml-[-10px]">
                <span className="text-xs font-bold font-heading text-white tracking-widest skew-x-[10deg] pl-2 uppercase">
                    Breaking News
                </span>
            </div>

            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 25,
                        ease: "linear",
                    },
                }}
            >
                {displayHeadlines.map((item, index) => (
                    <span key={index} className="mx-8 text-sm font-medium text-white flex items-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full mr-3"></span>
                        {item}
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

export default BreakingNewsTicker;
