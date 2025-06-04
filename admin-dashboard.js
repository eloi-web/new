const firebaseConfig = {
  apiKey: "AIzaSyDA1oonly5aQv0NPPna32lJli3P2GVPzHs",
  authDomain: "gba-marketplace.firebaseapp.com",
  projectId: "gba-marketplace",
  storageBucket: "gba-marketplace.firebasestorage.app",
  messagingSenderId: "110246782047",
  appId: "1:110246782047:web:ca126e8b6466395833e7ea",
  measurementId: "G-SSS7TFDC83"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('adminToken');
    const postForm = document.getElementById('postForm');
    const postCategorySelect = document.getElementById('postCategory');
    const jobFieldsDiv = document.getElementById('jobFields');
    const jobImagesInput = document.getElementById('jobImages');
    const companyLogoInput = document.getElementById('companyLogo');
    const logoutButton = document.getElementById('logoutButton');
    const postsContainer = document.getElementById('postsContainer');

    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = '/log-in.html';
        return;
    }

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        alert('You have been logged out.');
        window.location.href = '/log-in.html';
    });

    postCategorySelect.addEventListener('change', () => {
        const selectedCategory = postCategorySelect.value;
        jobFieldsDiv.classList.remove('active');

        if (selectedCategory === 'Jobs') {
            jobFieldsDiv.classList.add('active');
        }
        // You would add more 'else if' blocks here for other categories
        // if they have their own specific fields (e.g., 'Auction', 'Consultants', etc.)
    });

    postCategorySelect.dispatchEvent(new Event('change'));

    async function uploadFile(file, storagePath) {
        if (!file) return null;

        try {
            const storageRef = storage.ref();
            const fileRef = storageRef.child(`${storagePath}/${Date.now()}_${file.name}`);

            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();

            console.log(`Uploaded ${file.name} to: ${downloadURL}`);
            return downloadURL;
        } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            alert(`Failed to upload ${file.name}. Please try again.`);
            return null;
        }
    }

    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const category = postCategorySelect.value;
            const title = document.getElementById('postTitle').value;
            const content = document.getElementById('postContent').value;
            const published = document.getElementById('postPublished').checked;

            let postData = {
                category,
                title,
                content,
                published,
            };

                if (category === 'Jobs') {
                const companyName = document.getElementById('companyName').value;
                const jobLocation = document.getElementById('jobLocation').value;
                const jobType = document.getElementById('jobType').value;
                const jobDescription = document.getElementById('jobDescription').value;
                const jobTags = document.getElementById('jobTags').value;

                const jobImagesFiles = jobImagesInput.files;
                const companyLogoFile = companyLogoInput.files[0];
                const uploadedJobImageUrls = [];
                for (const file of jobImagesFiles) {
                    const url = await uploadFile(file, 'job_images');
                    if (url) uploadedJobImageUrls.push(url);
                }
                const companyLogoUrl = await uploadFile(companyLogoFile, 'company_logos');
                if (!jobDescription || !companyName || !jobLocation || !jobType || !companyLogoUrl || uploadedJobImageUrls.length === 0) {
                     alert('For Job posts: Title, Content (general), Company Name, Location, Type, Job Description, at least one image, and a company logo are all required.');
                    return;
                }

                Object.assign(postData, {
                    company: companyName,
                    location: jobLocation,
                    type: jobType,
                    description: jobDescription,
                    tags: jobTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
                    image: uploadedJobImageUrls[0] || null,
                    logo: companyLogoUrl
                });
            }
            try {
                const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(postData),
                });

                const data = await response.json();

                if (response.ok) { 
                    alert(`Post created successfully: ${data.message}`);
                    postForm.reset();
                    postCategorySelect.dispatchEvent(new Event('change')); 
                    await loadPosts();
                } else {
                    if (response.status === 401 || response.status === 403) {
                        alert(`Authentication Error: ${data.message || 'Your session has expired. Please log in again.'}`);
                        localStorage.removeItem('adminToken'); 
                        window.location.href = '/log-in.html'; 
                    } else {
                        alert(`Error creating post: ${data.message || 'An unexpected error occurred.'}`);
                    }
                }
            } catch (error) {
                console.error('Network or client-side error creating post:', error);
                alert('A network error occurred while creating the post. Please check your connection and try again.');
            }
        });
    }

    async function loadPosts() {
        postsContainer.innerHTML = '<p>Loading posts...</p>';
        try {
            const response = await fetch('/api/posts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const posts = await response.json();

            if (response.ok) {
                if (posts.length === 0) {
                    postsContainer.innerHTML = '<p>No posts found. Start by creating one above!</p>';
                } else {
                    postsContainer.innerHTML = ''; 
                    posts.forEach(post => {
                        const postElement = document.createElement('div');
                        postElement.className = 'post-item';

                        let postDetailsHtml = `
                            <h4>${post.title} (Category: ${post.category})</h4>
                            <p><strong>General Content:</strong> ${post.content || 'N/A'}</p>
                        `;

                        if (post.category === 'Jobs') {
                            postDetailsHtml += `
                                <p><strong>Job Description:</strong> ${post.jobDescription || 'N/A'}</p>
                                <p><strong>Tags:</strong> ${Array.isArray(post.jobTags) && post.jobTags.length > 0 ? post.jobTags.join(', ') : 'N/A'}</p>
                                ${post.companyLogo ? `<p><strong>Company Logo:</strong><br><img src="${post.companyLogo}" alt="Company Logo" width="80px" style="margin-top: 5px; border: 1px solid #eee;"></p>` : ''}
                                ${post.jobImages && post.jobImages.length > 0 ? `<p><strong>Job Images:</strong><br>${post.jobImages.map(img => `<img src="${img}" alt="Job Image" width="80px" style="margin-top: 5px; margin-right: 5px; border: 1px solid #eee;">`).join('')}</p>` : ''}
                            `;
                        }

                        postDetailsHtml += `
                            <div class="post-meta">
                                Posted: ${post.createdAt ? new Date(post.createdAt._seconds * 1000).toLocaleDateString() : 'N/A'}
                                ${!post.published ? '<span style="color: red; font-weight: bold;"> (UNPUBLISHED)</span>' : ''}
                            </div>
                            <div class="post-actions">
                                <button onclick="editPost('${post.id}')">Edit</button>
                                <button class="delete" onclick="deletePost('${post.id}')">Delete</button>
                            </div>
                        `;
                        postElement.innerHTML = postDetailsHtml;
                        postsContainer.appendChild(postElement);
                    });
                }
            } else {
              
                if (response.status === 401 || response.status === 403) {
                    const errorData = await response.json();
                    alert(`Error loading posts: ${errorData.message || 'Your session has expired. Please log in again.'}`);
                    localStorage.removeItem('adminToken');
                    window.location.href = '/log-in.html';
                } else {
                    const errorData = await response.json();
                    postsContainer.innerHTML = `<p>Error loading posts: ${errorData.message || 'An unexpected error occurred.'}</p>`;
                }
            }

        } catch (error) {
            console.error('Network error loading posts:', error);
            postsContainer.innerHTML = '<p>Failed to load posts. Please check your internet connection.</p>';
        }
    }
    window.editPost = (postId) => {
        alert(`Edit functionality for post ID: ${postId} (Requires implementing PUT method in api/posts.js and client-side form logic)`);
    };

    window.deletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
            return;
        }
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                await loadPosts();
            } else {
                if (response.status === 401 || response.status === 403) {
                    alert(`Authentication Error: ${data.message || 'Your session has expired. Please log in again.'}`);
                    localStorage.removeItem('adminToken');
                    window.location.href = '/log-in.html';
                } else {
                    alert(`Error deleting post: ${data.message || 'An unexpected error occurred.'}`);
                }
            }
        } catch (error) {
            console.error('Network error deleting post:', error);
            alert('A network error occurred while deleting the post.');
        }
    };

    await loadPosts();
});