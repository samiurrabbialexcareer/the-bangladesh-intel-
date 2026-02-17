import { useState, useEffect, useRef, useCallback } from 'react';
import BreakingNewsTicker from '../components/BreakingNewsTicker';
import HeroSection from '../components/HeroSection';
import NewsCard from '../components/NewsCard';
import { fetchNews } from '../services/api';
import { Loader2, ArrowRight } from 'lucide-react';

const CATEGORIES = ['NATIONAL', 'POLITICS', 'ECONOMY', 'SPORTS', 'TECHNOLOGY', 'ENTERTAINMENT'];

const Home = () => {
    // Main Data States
    const [heroNews, setHeroNews] = useState(null);
    const [latestNews, setLatestNews] = useState([]);
    const [categoryNews, setCategoryNews] = useState({});
    const [tickerNews, setTickerNews] = useState([]);

    // Infinite Scroll States
    const [infiniteNews, setInfiniteNews] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const observer = useRef();

    // Infinite Scroll Observer
    const lastNewsElementRef = useCallback(node => {
        if (loading || fetchingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, fetchingMore, hasMore]);


    // Initial Data Load
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // 1. Fetch Latest/Hero
                const { data: latestData } = await fetchNews(1, 10); // Fetch more to separate hero/ticker

                const headings = latestData.filter(item => item.isHeading);
                const regular = latestData.filter(item => !item.isHeading && item.category !== 'BREAKING_TICKER');
                const tickerItems = latestData.filter(item => item.category === 'BREAKING_TICKER');

                setHeroNews(headings[0] || regular[0]);
                setLatestNews(regular.slice(0, 6));

                // NEW: Prepare Carousel Data (Headings + Featured)
                let carouselItems = [...headings, ...latestData.filter(i => i.isFeatured && !i.isHeading)];
                // Remove duplicates if any
                carouselItems = Array.from(new Set(carouselItems.map(a => a.id)))
                    .map(id => carouselItems.find(a => a.id === id));

                // Fallback if no featured/headings exist
                if (carouselItems.length === 0) {
                    carouselItems = regular.slice(0, 5);
                }
                setHeroNews(carouselItems);

                // Ticker Logic: Use specific Breaking Ticker items, or fallback to headlines
                if (tickerItems.length > 0) {
                    setTickerNews(tickerItems.map(item => item.title));
                } else {
                    setTickerNews(headings.length > 0 ? headings.map(h => h.title) : ["LIVE UPDATES ACTIVE", "SCROLL FOR MORE NEWS"]);
                }

                // 2. Fetch ALL news once and filter by category client-side
                // This is more efficient than 6 parallel API calls to Google Sheets
                const { data: allNewsData } = await fetchNews(1, 100); // Fetch more items

                const catMap = {};
                CATEGORIES.forEach((cat) => {
                    catMap[cat] = allNewsData
                        .filter(item => item.category && item.category.toUpperCase() === cat.toUpperCase())
                        .slice(0, 3); // Take top 3 per category
                });
                setCategoryNews(catMap);

            } catch (e) {
                console.error("Failed to load initial news", e);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // Infinite Scroll Fetch (General Feed)
    useEffect(() => {
        if (page === 1) return;

        const loadMore = async () => {
            setFetchingMore(true);
            try {
                const { data, hasMore: moreAvailable } = await fetchNews(page + 2, 6);
                // Filter out ticker items from general feed if any leak through
                const filteredData = data.filter(item => item.category !== 'BREAKING_TICKER');
                setInfiniteNews(prev => [...prev, ...filteredData]);
                setHasMore(moreAvailable);
            } catch (e) {
                console.error("Error loading more", e);
            } finally {
                setFetchingMore(false);
            }
        };

        loadMore();
    }, [page]);


    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-pulse text-primary font-heading text-xl tracking-widest font-bold">
                    LOADING THE BANGLADESH INTEL...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-text font-sans relative pb-20">
            <BreakingNewsTicker headlines={tickerNews} />

            <main className="container mx-auto px-4 py-8 relative z-10">
                <header className="mb-12 text-center pt-8 border-b-4 border-primary pb-8">
                    <h1 className="text-5xl md:text-7xl font-heading font-black mb-2 tracking-tight text-text">
                        THE <span className="text-primary">BANGLADESH</span> INTEL
                    </h1>
                    <p className="text-sm md:text-base text-muted tracking-widest uppercase font-medium">
                        (TBI) • Truth • Integrity • Progress
                    </p>
                </header>

                {/* FEATURED CAROUSEL */}
                {heroNews && heroNews.length > 0 && <HeroSection newsItems={heroNews} />}

                {/* LATEST REPORTS */}
                <section className="mb-16">
                    <div className="flex items-center mb-6">
                        <h2 className="section-heading mb-0">Latest Reports</h2>
                        <div className="flex-1 h-px bg-gray-200 ml-4"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestNews.map((item, index) => (
                            <NewsCard key={`latest-${index}`} newsItem={item} index={index} />
                        ))}
                    </div>
                </section>

                {/* CATEGORY SECTIONS */}
                {CATEGORIES.map((category) => (
                    <section key={category} className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center flex-1">
                                <h2 className="text-2xl font-heading font-bold mr-4 text-primary">{category}</h2>
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </div>
                            <button className="text-xs font-bold text-muted hover:text-primary flex items-center ml-4 uppercase tracking-wider">
                                View All <ArrowRight size={14} className="ml-1" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {categoryNews[category]?.map((item, index) => (
                                <NewsCard key={`cat-${category}-${index}`} newsItem={item} index={index} />
                            ))}
                        </div>
                    </section>
                ))}

                {/* INFINITE SCROLL / MORE NEWS */}
                <section className="mt-20 pt-10 border-t border-gray-200">
                    <div className="text-center mb-10">
                        <h3 className="text-xl font-heading font-bold text-gray-400 uppercase tracking-widest">More Stories</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {infiniteNews.map((item, index) => {
                            if (infiniteNews.length === index + 1) {
                                return (
                                    <div ref={lastNewsElementRef} key={`inf-${index}`} className="h-full">
                                        <NewsCard newsItem={item} index={index} />
                                    </div>
                                );
                            } else {
                                return <NewsCard key={`inf-${index}`} newsItem={item} index={index} />;
                            }
                        })}
                    </div>

                    {fetchingMore && (
                        <div className="py-8 flex justify-center w-full">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    )}

                    {/* Initial trigger for infinite scroll if list is empty */}
                    {infiniteNews.length === 0 && (
                        <div ref={lastNewsElementRef} className="h-10 w-full"></div>
                    )}
                </section>

            </main>

            <footer className="mt-20 border-t border-gray-200 py-12 text-center bg-gray-50 text-muted text-sm">
                <p className="font-bold text-gray-900 mb-2">THE BANGLADESH INTEL (TBI)</p>
                <p>&copy; 2026 All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
