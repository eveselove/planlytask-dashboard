/**
 * API Client — обёртка для Jetson Backend API.
 * Все запросы проходят через этот модуль с авторизацией.
 */

const API = {
    // Конфигурация — заполняется при инициализации
    baseUrl: '',
    apiKey: '',

    init(baseUrl, apiKey) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
        this.apiKey = apiKey;
        console.log(`🔌 API: ${this.baseUrl}`);
    },

    async request(path, options = {}) {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            const resp = await fetch(url, { ...options, headers });
            if (resp.status === 401) {
                throw new Error('Неверный API ключ');
            }
            if (!resp.ok) {
                throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
            }
            return await resp.json();
        } catch (err) {
            console.error(`API Error [${path}]:`, err);
            throw err;
        }
    },

    get(path) {
        return this.request(path);
    },

    post(path, body) {
        return this.request(path, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    // === Products ===
    getProducts(params = {}) {
        const qs = new URLSearchParams(params).toString();
        return this.get(`/api/products?${qs}`);
    },

    // === Filters ===
    getFilters(params = {}) {
        const qs = new URLSearchParams(params).toString();
        return this.get(`/api/filters?${qs}`);
    },

    // === Stats ===
    getStats() {
        return this.get('/api/stats');
    },

    // === Price/Stock History ===
    getPriceHistory(sku) {
        return this.get(`/api/price_history/${encodeURIComponent(sku)}`);
    },

    getStockHistory(sku) {
        return this.get(`/api/stock_history/${encodeURIComponent(sku)}`);
    },

    // === Analytics ===
    getAnalytics() {
        return this.get('/api/analytics');
    },

    // === Catalog ===
    getCatalog(store) {
        const qs = store ? `?store=${encodeURIComponent(store)}` : '';
        return this.get(`/api/catalog${qs}`);
    },

    // === Config ===
    getConfig() {
        return this.get('/api/config');
    },

    saveConfig(config) {
        return this.post('/api/config', config);
    },

    // === Parser Control ===
    startParse(params) {
        return this.post('/api/parse/start', params);
    },

    stopParse() {
        return this.post('/api/parse/stop', {});
    },

    pauseParse() {
        return this.post('/api/parse/pause', {});
    },

    getParseStatus() {
        return this.get('/api/parse/status');
    },

    // === Akson Parser ===
    startAksonParse(params) {
        return this.post('/api/akson/parse/start', params);
    },

    stopAksonParse() {
        return this.post('/api/akson/parse/stop', {});
    },

    getAksonParseStatus() {
        return this.get('/api/akson/parse/status');
    },

    // === Stroylandia Parser ===
    startStrlParse(params) {
        return this.post('/api/stroylandia/parse/start', params);
    },

    getStrlParseStatus() {
        return this.get('/api/stroylandia/parse/status');
    },

    // === Matching ===
    getMatching(params = {}) {
        const qs = new URLSearchParams(params).toString();
        return this.get(`/api/matching?${qs}`);
    },

    getMatchSaved() {
        return this.get('/api/match/saved');
    },

    setMatchLabel(sku, store, label) {
        return this.post('/api/match/label', { sku, store, label });
    },

    // === RL Dashboard ===
    getRLDashboard() {
        return this.get('/api/rl-dashboard');
    },

    // === Parser Settings ===
    getParserSettings() {
        return this.get('/api/parser-settings');
    },

    saveParserSettings(store, settings) {
        return this.post(`/api/parser-settings/${encodeURIComponent(store)}`, settings);
    },

    // === Parser Stats ===
    getParserStatsData(start, end) {
        const params = {};
        if (start) params.start = start;
        if (end) params.end = end;
        const qs = new URLSearchParams(params).toString();
        return this.get(`/api/parser_stats/data?${qs}`);
    },

    // === Regions ===
    getRegions() {
        return this.get('/api/regions');
    },
};

window.API = API;
