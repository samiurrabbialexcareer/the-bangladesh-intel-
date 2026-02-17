import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ newsItem, index }) => {
    const navigate = useNavigate();

    const goToArticle = () => {
        navigate(`/article/${newsItem.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="news-card flex flex-col h-full group"
        >
            {/* Image Container */}
            <div
                className="relative h-48 overflow-hidden cursor-pointer"
                onClick={goToArticle}
            >
                <img
                    src={newsItem.image || `https://source.unsplash.com/random/800x600?dhaka,bangladesh,${index}`}
                    alt={newsItem.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-0 left-0 bg-primary text-white px-3 py-1 text-xs font-bold font-heading uppercase">
                    {newsItem.category || 'NEWS'}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-muted mb-3 font-medium">
                    <Calendar size={12} className="mr-1" />
                    <span>{new Date(newsItem.timestamp || Date.now()).toLocaleDateString()}</span>
                </div>

                <h3
                    className="text-xl font-heading font-bold text-text mb-2 leading-tight hover:text-primary transition-colors cursor-pointer"
                    onClick={goToArticle}
                >
                    {newsItem.title || 'Headline Loading...'}
                </h3>

                <p className="text-sm text-gray-600 mb-6 flex-1 line-clamp-3 leading-relaxed">
                    {newsItem.description || 'Details of this report are currently being updated. Please check back shortly for the full story.'}
                </p>

                <div className="pt-4 mt-auto border-t border-gray-100 flex justify-end">
                    <button
                        onClick={goToArticle}
                        className="text-xs font-bold text-primary flex items-center hover:underline uppercase tracking-wide"
                    >
                        Read More <ArrowRight size={14} className="ml-1" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default NewsCard;
