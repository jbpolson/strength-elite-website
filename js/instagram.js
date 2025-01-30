document.addEventListener('DOMContentLoaded', function() {
    loadInstagramFeed();
});

async function loadInstagramFeed() {
    const grid = document.querySelector('.instagram-grid');
    if (!grid) return;

    try {
        const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${INSTAGRAM_CONFIG.accessToken}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        grid.innerHTML = ''; // Clear loading state
        
        data.data.slice(0, 9).forEach(post => {
            if (post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM') {
                grid.appendChild(createPostElement(post));
            }
        });
    } catch (error) {
        console.error('Error loading Instagram feed:', error);
        grid.innerHTML = '<div class="instagram-error">Unable to load Instagram feed</div>';
    }
}

function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'instagram-item';
    
    const caption = post.caption || '';
    const truncatedCaption = caption.length > 100 ? caption.substring(0, 97) + '...' : caption;
    
    div.innerHTML = `
        <a href="${post.permalink}" target="_blank" rel="noopener noreferrer">
            <img src="${post.media_url}" alt="Instagram post">
            <div class="instagram-overlay">
                <p class="instagram-caption">${truncatedCaption}</p>
                <div class="instagram-meta">
                    <span class="instagram-date">${formatDate(post.timestamp)}</span>
                </div>
            </div>
        </a>
    `;
    return div;
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
    });
} 