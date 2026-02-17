const SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

// No mock data - using only live Google Sheet data
const INITIAL_MOCK_NEWS = [];

export const fetchNews = async (page = 1, limit = 6, category = null) => {
    if (SHEET_URL) {
        try {
            // Increased timeout to handle multiple parallel requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

            const response = await fetch(SHEET_URL, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            let json;
            try {
                json = JSON.parse(text);
            } catch (e) {
                console.error("API returned non-JSON response (likely HTML login page):", text.substring(0, 100));
                throw new Error("Invalid JSON response. Check Google Sheet permissions (Must be 'Anyone').");
            }

            let allData = json.data || json;

            if (!Array.isArray(allData)) {
                console.warn("API returned unexpected data format:", allData);
                allData = [];
            }

            // Filter out empty/invalid news items (no title or empty rows)
            allData = allData.filter(item =>
                item &&
                item.title &&
                item.title.trim() !== '' &&
                item.title !== 'Headline Loading...'
            );

            if (category) {
                allData = allData.filter(item => item.category && item.category.toUpperCase() === category.toUpperCase());
            }

            const start = (page - 1) * limit;
            const end = start + limit;
            const pagedData = allData.slice(start, end);

            return {
                data: pagedData,
                hasMore: end < allData.length
            };
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error("Request timeout - Google Sheet may be slow to respond");
            } else {
                console.error("Error fetching news:", error);
            }
            // Fallback to empty state instead of crashing/hanging
            return { data: [], hasMore: false, error: true };
        }
    }

    // Mock Data Logic (Fallback if no URL)
    await new Promise(resolve => setTimeout(resolve, 500));
    if (page === 1 && !category) {
        return { data: INITIAL_MOCK_NEWS, hasMore: false };
    }
    return { data: [], hasMore: false };
};

export const postNews = async (newsData) => {
    if (!SHEET_URL) {
        console.log("Mock Post:", newsData);
        INITIAL_MOCK_NEWS.unshift({
            ...newsData,
            id: `local-${Date.now()}`,
            timestamp: new Date().toISOString()
        });
        return { success: true };
    }
    try {
        const response = await fetch(SHEET_URL, {
            method: 'POST',
            body: JSON.stringify(newsData)
        });
        return await response.json();
    } catch (error) {
        console.error("Error posting news:", error);
        throw error;
    }
};
