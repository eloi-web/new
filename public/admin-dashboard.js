window.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('postsContainer');
    const logoutButton = document.getElementById('logoutButton');
    const createPostForm = document.getElementById('createPostForm');
    const postCategorySelect = document.getElementById('postCategory');
    const jobFieldsDiv = document.getElementById('jobFields');

    const token = localStorage.getItem('adminToken');
    if (!token) {
        alert('No admin token found, please log in.');
        window.location.href = './log-in.html';
        return;
    }

    function toggleJobFields() {
        if (postCategorySelect.value === 'Jobs') {
            jobFieldsDiv.style.display = 'block';
        } else {
            jobFieldsDiv.style.display = 'none';
        }
    }

    postCategorySelect.addEventListener('change', toggleJobFields);
    toggleJobFields();

    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(createPostForm);
        try {
            const response = await fetch('./api/create-post', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const contentType = response.headers.get('content-type');

            let result;
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();  // fallback to plain text
                throw new Error(`Unexpected response: ${text}`);
            }

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong during post creation.');
            }

            alert('Post created successfully!');
            // maybe reload or reset form
        } catch (err) {
            console.error('Post creation error:', err);
            alert(`Post creation failed: ${err.message}`);
        }
    });

    async function uploadFileToBackend(file, folder) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Upload failed');
        return data.url;
    }

    async function uploadMultipleFilesToBackend(files, folder) {
        const uploadedUrls = [];
        for (const file of files) {
            const url = await uploadFileToBackend(file, folder);
            if (url) uploadedUrls.push(url);
        }
        return uploadedUrls;
    }

    window.loadPosts = async () => {
        try {
            const response = await fetch('/api/posts', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            });

            const contentType = response.headers.get('content-type');
            let posts = [];

            if (!response.ok) {
                const errorMessage = (await response.json()).message;
                if (response.status === 401 || response.status === 403) {
                    throw new Error(`Authentication Error: ${errorMessage}. Please log in again.`);
                } else {
                    throw new Error(`Error loading posts: ${errorMessage}`);
                }
            }

            if (contentType && contentType.includes('application/json')) {
                posts = await response.json();
            } else {
                const errorText = await response.text();
                throw new Error(`Unexpected response format. Details: ${errorText.substring(0, 200)}...`);
            }

            postsContainer.innerHTML = '';
            if (posts.length === 0) {
                postsContainer.innerHTML = '<p>No posts yet. Create your first post!</p>';
                return;
            }

            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post-item');
                postElement.innerHTML = `
                    <h4>${post.title} (${post.category})</h4>
                    <p>${post.content ? post.content.substring(0, 100) + '...' : 'No general content.'}</p>
                    ${post.category === 'Jobs' ? `
                        <p><strong>Company:</strong> ${post.companyName || 'N/A'}</p>
                        <p><strong>Location:</strong> ${post.jobLocation || 'N/A'}</p>
                        <p><strong>Type:</strong> ${post.jobType || 'N/A'}</p>
                        <p><strong>Description:</strong> ${post.jobDescription ? post.jobDescription.substring(0, 100) + '...' : 'N/A'}</p>
                        <p><strong>Tags:</strong> ${post.jobTags && Array.isArray(post.jobTags) ? post.jobTags.join(', ') : 'N/A'}</p>
                        ${post.companyLogoUrl ? `<img src="${post.companyLogoUrl}" alt="Company Logo" style="max-width: 80px; max-height: 80px; object-fit: contain;">` : ''}
                        <div class="job-images-display" style="display: flex; flex-wrap: wrap;">
                            ${post.jobImageUrls && post.jobImageUrls.length > 0 ?
                            post.jobImageUrls.map(url => `<img src="${url}" alt="Job Image" style="max-width: 80px; max-height: 80px; margin-right: 5px; object-fit: cover;">`).join('')
                            : ''}
                        </div>
                    ` : ''}
                    <p class="status">Status: ${post.published ? 'Published' : 'Draft'}</p>
                    <p class="meta">Created: ${post.createdAt ? new Date(post.createdAt._seconds * 1000).toLocaleString() : 'N/A'}</p>
                    <button onclick="editPost('${post.id}')" class="edit-button">Edit</button>
                    <button onclick="deletePost('${post.id}')" class="delete-button">Delete</button>
                `;
                postsContainer.appendChild(postElement);
            });
        } catch (error) {
            console.error('Error loading posts:', error);
            postsContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
            if (error.message.includes('Authentication Error')) {
                localStorage.removeItem('adminToken');
                setTimeout(() => { window.location.href = './log-in.html'; }, 2000);
            }
        }
    };

    logoutButton.addEventListener('click', async () => {
        try {
            localStorage.removeItem('adminToken');
            alert('Logged out successfully!');
            window.location.href = './log-in.html';
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Error logging out. Please try again.');
        }
    });

    await loadPosts();
});
