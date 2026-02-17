import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Send, Image, Tag, Type, FileText, CheckCircle, Zap, LayoutTemplate } from 'lucide-react';
import { postNews } from '../services/api';

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [secretKey, setSecretKey] = useState('');
    const [status, setStatus] = useState('');

    // State for Breaking News (Ticker)
    const [tickerText, setTickerText] = useState('');
    const [tickerStatus, setTickerStatus] = useState('');

    // State for Main News
    const [formData, setFormData] = useState({
        title: '',
        tagline: '',
        description: '',
        image: '',
        category: 'NATIONAL',
        isFeatured: false,
        isHeading: false
    });

    const categories = ['NATIONAL', 'POLITICS', 'ECONOMY', 'SPORTS', 'TECHNOLOGY', 'ENTERTAINMENT'];

    const handleLogin = (e) => {
        e.preventDefault();
        if (secretKey === 'CYBER2077') {
            setIsAuthenticated(true);
        } else {
            alert('Access Denied');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTickerSubmit = async (e) => {
        e.preventDefault();
        setTickerStatus('loading');
        try {
            await postNews({
                title: tickerText,
                category: 'BREAKING_TICKER',
                isHeading: false,
                isFeatured: false,
                timestamp: new Date().toISOString()
            });
            setTickerStatus('success');
            setTickerText('');
            setTimeout(() => setTickerStatus(''), 2000);
        } catch (error) {
            console.error(error);
            setTickerStatus('error');
            setTimeout(() => setTickerStatus(''), 2000);
        }
    };

    const handleMainSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await postNews(formData);
            setStatus('success');
            setFormData({
                title: '', tagline: '', description: '', image: '', category: 'NATIONAL', isFeatured: false, isHeading: false
            });
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error(error);
            setStatus('error');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold font-heading text-gray-900">Admin Login</h2>
                        <p className="text-gray-500 text-sm mt-2">The Bangladesh Intel (TBI) Panel</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <input
                            type="password"
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg py-3 px-4 text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-red-100 transition-all tracking-widest"
                            placeholder="••••••••"
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-primary hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-md"
                        >
                            Enter Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-10 px-4">
            <div className="container mx-auto max-w-4xl">
                <header className="flex items-center justify-between mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h1 className="text-2xl font-heading font-bold text-gray-900 flex items-center">
                        <span className="w-3 h-8 bg-primary mr-4 rounded-sm"></span>
                        Editor's Desk
                    </h1>
                    <button onClick={() => setIsAuthenticated(false)} className="text-sm font-bold text-gray-500 hover:text-primary uppercase tracking-wide">
                        Logout
                    </button>
                </header>

                {/* 1. BREAKING NEWS SECTION */}
                <section className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500 mb-8 relative overflow-hidden">
                    <div className="flex items-center mb-6">
                        <Zap className="w-6 h-6 text-red-500 mr-3" />
                        <h2 className="text-xl font-heading font-bold text-gray-900">Flash / Breaking News Ticker</h2>
                    </div>

                    <form onSubmit={handleTickerSubmit} className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={tickerText}
                                onChange={(e) => setTickerText(e.target.value)}
                                placeholder="Enter short breaking news text (e.g., 'LIVE: Prime Minister to address the nation at 8 PM')"
                                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all outline-none font-medium"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={tickerStatus === 'loading'}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all whitespace-nowrap shadow-md disabled:opacity-50"
                        >
                            {tickerStatus === 'loading' ? 'Posting...' : tickerStatus === 'success' ? 'Posted!' : 'Add to Ticker'}
                        </button>
                    </form>
                </section>

                {/* 2. HEADLINE & STORY SECTION */}
                <form onSubmit={handleMainSubmit} className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-200 space-y-8 relative overflow-hidden">
                    <div className="flex items-center mb-2 pb-6 border-b border-gray-100">
                        <LayoutTemplate className="w-6 h-6 text-primary mr-3" />
                        <h2 className="text-xl font-heading font-bold text-gray-900">Main Story & Headlines</h2>
                    </div>

                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center flex-col"
                        >
                            <CheckCircle className="w-20 h-20 text-primary mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900">Published Successfully</h3>
                            <p className="text-gray-500 mt-2">The article has been sent to the newsroom.</p>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Headline</label>
                                <div className="relative group">
                                    <Type className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Article Title"
                                        className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:border-primary focus:ring-2 focus:ring-red-50 transition-all outline-none font-bold text-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Sub-Tagline</label>
                                <div className="relative group">
                                    <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="tagline"
                                        value={formData.tagline}
                                        onChange={handleChange}
                                        placeholder="Short summary..."
                                        className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:border-primary focus:ring-2 focus:ring-red-50 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Content</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="Full article text..."
                                    className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:border-primary focus:ring-2 focus:ring-red-50 transition-all outline-none"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Image URL</label>
                                <div className="relative group">
                                    <Image className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:border-primary focus:ring-2 focus:ring-red-50 transition-all outline-none text-sm"
                                    />
                                </div>
                                {formData.image && (
                                    <div className="mt-4 h-32 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Category</label>
                                <div className="relative group">
                                    <Tag className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:border-primary focus:ring-2 focus:ring-red-50 transition-all outline-none appearance-none bg-white"
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <label className={`flex-1 flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all select-none ${formData.isHeading ? 'bg-primary text-white border-primary shadow-md' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                                    <input
                                        type="checkbox"
                                        name="isHeading"
                                        checked={formData.isHeading}
                                        onChange={handleChange}
                                        className="hidden" // hidden input, custom style
                                    />
                                    <div className="text-center">
                                        <div className="text-sm font-bold uppercase tracking-wider">Set Headline</div>
                                        <div className="text-[10px] opacity-80 font-normal">Display in Hero Section</div>
                                    </div>
                                </label>

                                <label className="flex-1 flex items-center justify-center p-4 rounded-lg border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all select-none">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                        className="w-5 h-5 accent-primary mr-3"
                                    />
                                    <span className="text-sm font-bold text-gray-700">Featured</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200 flex justify-end">
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="px-8 py-3 bg-gray-900 text-white font-bold font-heading rounded hover:bg-black transition-all flex items-center shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? 'Publishing...' : 'Publish Article'}
                            <Send className="ml-2 w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
