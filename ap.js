// ZoZo AI - API Integration Module

class ZoZoAPI {
    constructor() {
        this.baseURL = 'https://api.zozo-ai.com/v1';
        this.apiKey = null;
        this.isConnected = false;
        this.endpoints = {
            chat: '/chat/completions',
            code: '/code/generate',
            research: '/research/query',
            content: '/content/create',
            business: '/business/analyze'
        };
    }
    
    // SET API KEY
    setApiKey(key) {
        this.apiKey = key;
        this.isConnected = true;
        localStorage.setItem('zozo_api_key', key);
        this.updateUIStatus();
        return true;
    }
    
    // LOAD SAVED API KEY
    loadApiKey() {
        const savedKey = localStorage.getItem('zozo_api_key');
        if (savedKey) {
            this.apiKey = savedKey;
            this.isConnected = true;
            this.updateUIStatus();
        }
        return this.isConnected;
    }
    
    // UPDATE UI STATUS
    updateUIStatus() {
        const statusElement = document.getElementById('apiStatus');
        if (statusElement) {
            if (this.isConnected) {
                statusElement.innerHTML = `
                    <i class="fas fa-plug" style="color: #10b981;"></i>
                    <span>API Connected</span>
                `;
                statusElement.style.color = '#10b981';
            } else {
                statusElement.innerHTML = `
                    <i class="fas fa-plug" style="color: #ef4444;"></i>
                    <span>API Disconnected</span>
                `;
                statusElement.style.color = '#ef4444';
            }
        }
    }
    
    // MAKE API REQUEST
    async makeRequest(endpoint, data) {
        if (!this.isConnected || !this.apiKey) {
            throw new Error('API not connected. Please add your API key.');
        }
        
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'X-ZoZo-Version': '1.0.0'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }
    
    // CHAT COMPLETION
    async chatCompletion(messages, options = {}) {
        const data = {
            messages: messages,
            model: options.model || 'gpt-4',
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 1000,
            stream: options.stream || false
        };
        
        return await this.makeRequest(this.endpoints.chat, data);
    }
    
    // CODE GENERATION
    async generateCode(prompt, language = 'python', options = {}) {
        const data = {
            prompt: prompt,
            language: language,
            framework: options.framework || '',
            style: options.style || 'professional',
            include_comments: options.include_comments !== false
        };
        
        return await this.makeRequest(this.endpoints.code, data);
    }
    
    // WEB RESEARCH
    async researchQuery(query, options = {}) {
        const data = {
            query: query,
            sources: options.sources || ['web', 'academic', 'news'],
            max_results: options.max_results || 10,
            timeframe: options.timeframe || '1y'
        };
        
        return await this.makeRequest(this.endpoints.research, data);
    }
    
    // CONTENT CREATION
    async createContent(topic, type = 'blog', options = {}) {
        const data = {
            topic: topic,
            content_type: type,
            tone: options.tone || 'professional',
            word_count: options.word_count || 1000,
            keywords: options.keywords || [],
            seo_optimized: options.seo_optimized !== false
        };
        
        return await this.makeRequest(this.endpoints.content, data);
    }
    
    // BUSINESS ANALYSIS
    async analyzeBusiness(idea, options = {}) {
        const data = {
            business_idea: idea,
            analysis_type: options.type || 'complete',
            include_financials: options.include_financials !== false,
            market_research: options.market_research !== false,
            competitor_analysis: options.competitor_analysis !== false
        };
        
        return await this.makeRequest(this.endpoints.business, data);
    }
    
    // GET API USAGE
    async getUsage() {
        try {
            const response = await fetch(`${this.baseURL}/usage`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to get usage');
            return await response.json();
        } catch (error) {
            console.error('Usage check failed:', error);
            return null;
        }
    }
    
    // TEST API CONNECTION
    async testConnection() {
        try {
            const testData = {
                messages: [{role: 'user', content: 'Test'}],
                model: 'gpt-3.5-turbo',
                max_tokens: 5
            };
            
            const response = await fetch(`${this.baseURL}${this.endpoints.chat}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(testData)
            });
            
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    // SHOW API MODAL
    showApiModal() {
        const modalHTML = `
            <div class="modal" id="apiModal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            ">
                <div class="modal-content" style="
                    background: linear-gradient(135deg, #1e293b, #0f172a);
                    padding: 2.5rem;
                    border-radius: 20px;
                    max-width: 500px;
                    width: 90%;
                    border: 1px solid rgba(255,255,255,0.1);
                ">
                    <h2 style="margin-bottom: 1.5rem;">🔑 Connect API Key</h2>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #94a3b8;">
                            Enter your API Key:
                        </label>
                        <input type="password" id="apiKeyInput" style="
                            width: 100%;
                            padding: 1rem;
                            background: rgba(255,255,255,0.05);
                            border: 1px solid rgba(255,255,255,0.2);
                            border-radius: 10px;
                            color: white;
                            font-size: 1rem;
                        " placeholder="sk-...">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem; color: #94a3b8; font-size: 0.9rem;">
                        <p>Get API key from:</p>
                        <ul style="margin: 0.5rem 0 0 1.5rem;">
                            <li><a href="https://openai.com" target="_blank" style="color: #3b82f6;">OpenAI</a></li>
                            <li><a href="https://huggingface.co" target="_blank" style="color: #3b82f6;">Hugging Face</a></li>
                            <li><a href="https://cohere.com" target="_blank" style="color: #3b82f6;">Cohere</a></li>
                        </ul>
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button onclick="zozoAPI.connectApi()" style="
                            flex: 1;
                            padding: 1rem;
                            background: linear-gradient(135deg, #7c3aed, #3b82f6);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            font-weight: bold;
                            cursor: pointer;
                        ">
                            Connect
                        </button>
                        <button onclick="zozoAPI.hideApiModal()" style="
                            flex: 1;
                            padding: 1rem;
                            background: rgba(255,255,255,0.1);
                            color: white;
                            border: 1px solid rgba(255,255,255,0.2);
                            border-radius: 10px;
                            cursor: pointer;
                        ">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('apiModal');
        if (existingModal) existingModal.remove();
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Focus input
        setTimeout(() => {
            const input = document.getElementById('apiKeyInput');
            if (input) input.focus();
        }, 100);
    }
    
    // HIDE API MODAL
    hideApiModal() {
        const modal = document.getElementById('apiModal');
        if (modal) modal.remove();
    }
    
    // CONNECT API
    async connectApi() {
        const input = document.getElementById('apiKeyInput');
        if (!input) return;
        
        const apiKey = input.value.trim();
        if (!apiKey) {
            alert('Please enter an API key');
            return;
        }
        
        // Save API key
        this.setApiKey(apiKey);
        
        // Test connection
        const isConnected = await this.testConnection();
        
        if (isConnected) {
            alert('✅ API connected successfully!');
            this.hideApiModal();
        } else {
            alert('❌ Failed to connect. Please check your API key.');
        }
    }
    
    // DISCONNECT API
    disconnectApi() {
        if (confirm('Disconnect API? You will lose advanced features.')) {
            this.apiKey = null;
            this.isConnected = false;
            localStorage.removeItem('zozo_api_key');
            this.updateUIStatus();
            alert('API disconnected');
        }
    }
}

// Initialize API
document.addEventListener('DOMContentLoaded', () => {
    window.zozoAPI = new ZoZoAPI();
    window.zozoAPI.loadApiKey();
    
    // Expose API functions
    window.connectApi = () => window.zozoAPI.showApiModal();
    window.disconnectApi = () => window.zozoAPI.disconnectApi();
});
