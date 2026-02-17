import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ newsItems = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    // If no items, filter out empty ones
    const items = newsItems.length > 0 ? newsItems : [];

    useEffect(() => {
        if (items.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(interval);
    }, [items.length]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const goToArticle = (id) => {
        navigate(`/article/${id}`);
    };

    if (items.length === 0) return null;

    const currentItem = items[currentIndex];

    return (
        <div className="relative w-full h-[500px] mb-12 rounded-xl overflow-hidden shadow-xl group bg-gray-900">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentItem.id || currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                        style={{ backgroundImage: `url(${currentItem.image || 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=2574&auto=format&fit=crop'})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-white bg-primary rounded uppercase tracking-wider">
                                {currentItem.category || 'Featured'}
                            </span>
                            <h2
                                className="text-3xl md:text-5xl font-heading font-bold mb-4 leading-tight cursor-pointer hover:underline"
                                onClick={() => goToArticle(currentItem.id)}
                            >
                                {currentItem.title}
                            </h2>
                            <p className="text-lg text-gray-200 max-w-3xl font-light mb-8 line-clamp-2">
                                {currentItem.tagline || currentItem.description}
                            </p>

                            <button
                                onClick={() => goToArticle(currentItem.id)}
                                className="px-8 py-3 bg-white text-gray-900 font-bold rounded hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                Read Full Story
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            {items.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-colors z-20 backdrop-blur-sm"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/60 text-white rounded-full transition-colors z-20 backdrop-blur-sm"
                    >
                        <ChevronRight size={32} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-6 right-8 flex space-x-2 z-20">
                        {items.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-primary w-6' : 'bg-white/50 hover:bg-white'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HeroSection;
