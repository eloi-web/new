// admin-dashboard.js

// Ensure 'firebase' and 'storage' are defined globally in your HTML
// by including Firebase SDK scripts and initializing them before this script.

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('adminToken'); // Retrieve the JWT token
    const postForm = document.getElementById('postForm');
    const postCategorySelect = document.getElementById('postCategory');
    const jobFieldsDiv = document.getElementById('jobFields'); // Container for Job-specific fields
    const jobImagesInput = document.getElementById('jobImages');
    const companyLogoInput = document.getElementById('companyLogo');
    const logoutButton = document.getElementById('logoutButton');
    const postsContainer = document.getElementById('postsContainer'); // Container to display posts

    // --- 1. Authentication Check on Page Load ---
    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = '/log-in.html'; // Redirect to login page
        return; // Stop script execution
    }

    // --- 2. Logout Functionality ---
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('adminToken'); // Remove the stored token
        alert('You have been logged out.');
        window.location.href = '/log-in.html'; // Redirect to login
    });

    // --- 3. Dynamic Form Fields based on Category Selection ---
    postCategorySelect.addEventListener('change', () => {
        const selectedCategory = postCategorySelect.value;
        // Hide all category-specific divs initially
        jobFieldsDiv.classList.remove('active'); // Assume 'active' class controls visibility

        // Show fields relevant to the selected category
        if (selectedCategory === 'Jobs') {
            jobFieldsDiv.classList.add('active');
        }
        // You would add more 'else if' blocks here for other categories
        // if they have their own specific fields (e.g., 'Auction', 'Consultants', etc.)
    });

    // Trigger change event once on load to set initial field visibility
    postCategorySelect.dispatchEvent(new Event('change'));

    // --- 4. File Upload Utility Function (Firebase Storage) ---
    // This function uploads a single file to Firebase Storage
    // and returns its public download URL.
    async function uploadFile(file, storagePath) {
        if (!file) return null; // No file selected

        try {
            // 'storage' is assumed to be globally available from your HTML script
            const storageRef = storage.ref();
            // Create a unique file path for the upload (e.g., 'job_images/timestamp_filename.jpg')
            const fileRef = storageRef.child(`${storagePath}/${Date.now()}_${file.name}`);

            const snapshot = await fileRef.put(file); // Upload the file
            const downloadURL = await snapshot.ref.getDownloadURL(); // Get the public URL

            console.log(`Uploaded ${file.name} to: ${downloadURL}`);
            return downloadURL;
        } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error);
            alert(`Failed to upload ${file.name}. Please try again.`);
            return null;
        }
    }

    // --- 5. Post Creation Form Submission ---
    if (postForm) {
        postForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default browser form submission

            // Gather common post data
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

            // Handle category-specific data and file uploads
            if (category === 'Jobs') {
                const jobDescription = document.getElementById('jobDescription').value;
                const jobTags = document.getElementById('jobTags').value;
                const jobImagesFiles = jobImagesInput.files; // FileList object
                const companyLogoFile = companyLogoInput.files[0]; // Single File object

                // Upload Job Images (can be multiple)
                const uploadedJobImageUrls = [];
                for (const file of jobImagesFiles) {
                    const url = await uploadFile(file, 'job_images'); // Upload to 'job_images' folder
                    if (url) uploadedJobImageUrls.push(url);
                }

                // Upload Company Logo (single file)
                const companyLogoUrl = await uploadFile(companyLogoFile, 'company_logos'); // Upload to 'company_logos' folder

                // Add job-specific data to postData
                Object.assign(postData, {
                    jobDescription: jobDescription,
                    jobTags: jobTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), // Split, trim, filter empty tags
                    jobImages: uploadedJobImageUrls, // Array of URLs
                    companyLogo: companyLogoUrl // Single URL
                });

                // Basic validation for job fields
                if (!jobDescription || uploadedJobImageUrls.length === 0 || !companyLogoUrl) {
                    alert('For Job posts: description, at least one image, and a company logo are required.');
                    return; // Stop submission if validation fails
                }

            }
            // Add more `else if (category === 'Auction') { ... }` blocks for other categories
            // to gather and validate their specific data.

            try {
                // Send the compiled postData to your Node.js backend '/api/posts' endpoint
                const response = await fetch('/api/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // IMPORTANT: Include the JWT for authentication
                    },
                    body: JSON.stringify(postData),
                });

                const data = await response.json(); // Parse the response from your backend

                if (response.ok) { // Check if the request was successful (2xx status code)
                    alert(`Post created successfully: ${data.message}`);
                    postForm.reset(); // Clear the form fields
                    postCategorySelect.dispatchEvent(new Event('change')); // Reset dynamic fields visibility
                    await loadPosts(); // Reload the list of posts to show the new one
                } else {
                    // Handle specific error codes from your backend
                    if (response.status === 401 || response.status === 403) {
                        alert(`Authentication Error: ${data.message || 'Your session has expired. Please log in again.'}`);
                        localStorage.removeItem('adminToken'); // Clear invalid token
                        window.location.href = '/log-in.html'; // Redirect to login
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

    // --- 6. Function to Load All Posts for Admin View ---
    // This function fetches all posts (including unpublished ones) for the admin dashboard.
    async function loadPosts() {
        postsContainer.innerHTML = '<p>Loading posts...</p>'; // Show loading message
        try {
            const response = await fetch('/api/posts', { // Fetch from the admin-only API
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Requires the admin JWT
                }
            });

            const posts = await response.json();

            if (response.ok) {
                if (posts.length === 0) {
                    postsContainer.innerHTML = '<p>No posts found. Start by creating one above!</p>';
                } else {
                    postsContainer.innerHTML = ''; // Clear loading message
                    posts.forEach(post => {
                        const postElement = document.createElement('div');
                        postElement.className = 'post-item';

                        // Display common post details
                        let postDetailsHtml = `
                            <h4>${post.title} (Category: ${post.category})</h4>
                            <p><strong>General Content:</strong> ${post.content || 'N/A'}</p>
                        `;

                        // Display category-specific details
                        if (post.category === 'Jobs') {
                            postDetailsHtml += `
                                <p><strong>Job Description:</strong> ${post.jobDescription || 'N/A'}</p>
                                <p><strong>Tags:</strong> ${Array.isArray(post.jobTags) && post.jobTags.length > 0 ? post.jobTags.join(', ') : 'N/A'}</p>
                                ${post.companyLogo ? `<p><strong>Company Logo:</strong><br><img src="${post.companyLogo}" alt="Company Logo" width="80px" style="margin-top: 5px; border: 1px solid #eee;"></p>` : ''}
                                ${post.jobImages && post.jobImages.length > 0 ? `<p><strong>Job Images:</strong><br>${post.jobImages.map(img => `<img src="${img}" alt="Job Image" width="80px" style="margin-top: 5px; margin-right: 5px; border: 1px solid #eee;">`).join('')}</p>` : ''}
                            `;
                        }
                        // Add more conditions for other categories as needed

                        // Display meta info and action buttons
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
                // Handle errors during post loading
                if (response.status === 401 || response.status === 403) {
                    const errorData = await response.json(); // Get error message from backend
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

    // --- 7. Placeholder for Edit and Delete Functions ---
    // These functions need to be implemented fully, likely involving:
    // - Edit: Fetching post data, populating the form, changing button to "Update", then sending a PUT request.
    // - Delete: Sending a DELETE request to /api/posts with the post ID.

    window.editPost = (postId) => {
        alert(`Edit functionality for post ID: ${postId} (Requires implementing PUT method in api/posts.js and client-side form logic)`);
        // Example: You might fetch the post data, populate the form,
        // and change the "Create Post" button to "Update Post"
    };

    window.deletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
            return;
        }
        try {
            const response = await fetch(`/api/posts?id=${postId}`, { // Assuming DELETE uses query param 'id'
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // Admin JWT required
                }
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                await loadPosts(); // Reload posts after successful deletion
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

    // --- Initial Load: Execute when the DOM is fully loaded ---
    await loadPosts(); // Fetch and display posts when the dashboard loads
});