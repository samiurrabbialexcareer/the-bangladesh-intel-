import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchNews } from '../services/api';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Article = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadArticle = async () => {
            try {
                setLoading(true);
                // Since our Google Sheet API is simple, we fetch all and find the ID.
                // In a real DB, we'd fetch by ID directly.
                const { data } = await fetchNews(1, 100);
                const found = data.find(item => item.id == id || item.id === id); // Loose equality for number/string mismatch

                if (found) {
                    setArticle(found);
                } else {
                    setError("Article not found.");
                }
            } catch (err) {
                console.error("Error loading article:", err);
                setError("Failed to load article.");
            } finally {
                setLoading(false);
            }
        };
        loadArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-pulse text-primary font-heading text-xl tracking-widest font-bold">
                    LOADING STORY...
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-4">
                <h2 className="text-3xl font-heading font-bold text-gray-800 mb-4">Story Not Found</h2>
                <p className="text-gray-600 mb-8 max-w-md">
                    The article you are looking for does not exist or has been removed.
                </p>
                <Link to="/" className="px-6 py-3 bg-primary text-white font-bold rounded hover:bg-red-700 transition">
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans pb-20">
            {/* Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 px-4 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-primary transition font-bold text-sm uppercase tracking-wide"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Back
                    </button>
                    <Link to="/" className="text-xl font-heading font-black tracking-tighter text-gray-900">
                        THE <span className="text-primary">BANGLADESH</span> INTEL
                    </Link>
                    <div className="w-16"></div> {/* Spacer for center alignment */}
                </div>
            </nav>

            <article className="container mx-auto px-4 pt-24 max-w-4xl">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded uppercase tracking-wider">
                            {article.category}
                        </span>
                        <span className="flex items-center text-gray-500 text-xs font-medium uppercase tracking-wide">
                            <Calendar size={14} className="mr-1" />
                            {new Date(article.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight mb-6">
                        {article.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed border-l-4 border-primary pl-6 mb-8 italic">
                        {article.tagline}
                    </p>
                </motion.div>

                {/* Main Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mb-12 rounded-xl overflow-hidden shadow-2xl"
                >
                    <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-auto object-cover max-h-[600px]"
                    />
                    <div className="bg-gray-100 px-4 py-2 text-xs text-gray-500 text-right italic">
                        Image Source: Unsplash / Editorial Use
                    </div>
                </motion.div>

                {/* Body Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="prose prose-lg md:prose-xl max-w-none text-gray-800 leading-loose"
                >
                    {/* 
                      Since our mock/simple data splits content into 'description', 
                      we will render it. If it was rich text, we'd parse it. 
                      For now, we split by newlines to create paragraphs.
                    */}
                    {article.description.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-6">
                            {paragraph}
                        </p>
                    ))}

                    {/* Fallback fake content if description is short, just for demo visuals */}
                    {article.description.length < 200 && (
                        <>
                            <p className="mb-6">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                            <p className="mb-6">
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </>
                    )}
                </motion.div>

                {/* Footer / Share */}
                <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center text-gray-600 text-sm font-bold">
                        <User size={16} className="mr-2 text-primary" />
                        By Editorial Desk
                    </div>
                    <button className="flex items-center text-gray-500 hover:text-primary transition font-bold text-sm uppercase tracking-wide">
                        <Share2 size={16} className="mr-2" />
                        Share Article
                    </button>
                </div>
            </article>
        </div>
    );
};

export default Article;
