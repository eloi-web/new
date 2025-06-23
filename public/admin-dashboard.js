window.addEventListener('DOMContentLoaded', async () => {
    const postsContainer = document.getElementById('postsContainer');
    const logoutButton = document.getElementById('logoutButton');
    const createPostForm = document.getElementById('createPostForm');
    const postCategorySelect = document.getElementById('postCategory');
    const jobFieldsDiv = document.getElementById('jobFields');

    
    const editPostModal = document.getElementById('editPostModal');
    const editPostForm = document.getElementById('editPostForm');
    const editPostIdInput = document.getElementById('editPostId'); 

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

    function toggleEditJobFields(category) {
        const editJobFieldsDiv = document.getElementById('editJobFields');
        if (editJobFieldsDiv) {
            if (category === 'Jobs') {
                editJobFieldsDiv.style.display = 'block';
            } else {
                editJobFieldsDiv.style.display = 'none';
            }
        }
    }


    postCategorySelect.addEventListener('change', toggleJobFields);
    toggleJobFields();

    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(createPostForm);
        try {
            const response = await fetch('/api/create-post', {
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
                const text = await response.text();
                throw new Error(`Unexpected response: ${text}`);
            }

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong during post creation.');
            }

            alert('Post created successfully!');
            createPostForm.reset();
            
            await window.loadPosts(); 
            const category = formData.get('category');
            switch (category) {
                case 'Auction':
                    window.location.href = '/auction.html';
                    break;
                case 'Jobs':
                    window.location.href = '/jobs.html';
                    break;
                case 'Consultants':
                    window.location.href = '/consultants.html';
                    break;
                case 'Tenders':
                    window.location.href = '/tenders.html';
                    break;
                case 'Venues':
                    window.location.href = '/venues.html';
                    break;
                default:
                    alert('Unknown category. Staying on the dashboard.');
            }


        } catch (err) {
            console.error('Post creation error:', err);
            alert(`Post creation failed: ${err.message}`);
        }
    });

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

        
            posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('post-item');
                
                const postContent = post.body || post.content || 'No general content.'; 
                const companyLogoHtml = post.companyLogoSrc ? `<img src="${post.companyLogoSrc}" alt="Company Logo" style="max-width: 80px; max-height: 80px; object-fit: contain;">` : '';
                const jobImagesHtml = post.jobImageUrls && post.jobImageUrls.length > 0 ?
                    `<div class="job-images-display" style="display: flex; flex-wrap: wrap;">` +
                    post.jobImageUrls.map(url => `<img src="${url}" alt="Job Image" style="max-width: 80px; max-height: 80px; margin-right: 5px; object-fit: cover;">`).join('') +
                    `</div>` : '';

                postElement.innerHTML = `
                    <h4>${post.title || 'Untitled'} (${post.category || 'N/A'})</h4>
                    <p>${postContent.substring(0, 100) + (postContent.length > 100 ? '...' : '')}</p>
                    ${post.category === 'Jobs' ? `
                        <p><strong>Company:</strong> ${post.companyName || 'N/A'}</p>
                        <p><strong>Location:</strong> ${post.jobLocation || 'N/A'}</p>
                        <p><strong>Type:</strong> ${post.jobType || 'N/A'}</p>
                        <p><strong>Description:</strong> ${post.jobDescription ? post.jobDescription.substring(0, 100) + '...' : 'N/A'}</p>
                        <p><strong>Tags:</strong> ${post.jobTags && Array.isArray(post.jobTags) ? post.jobTags.join(', ') : 'N/A'}</p>
                        ${companyLogoHtml}
                        ${jobImagesHtml}
                    ` : ''}
                    <p class="status">Status: ${post.published ? 'Published' : 'Draft'}</p>
                    <p class="meta">Created: ${post.createdAt ? new Date(post.createdAt).toLocaleString() : 'N/A'}</p>
                    <button class="edit-button" data-id="${post.id}" data-category="${post.category}">Update</button>
                    <button class="delete-button" data-id="${post.id}" data-category="${post.category}">Delete</button>
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

    // --- HANDLE EDIT AND DELETE BUTTONS ---
    postsContainer.addEventListener('click', async (event) => {
        const target = event.target;
        const postId = target.dataset.id;
        const postCategory = target.dataset.category; 

        if (target.classList.contains('edit-button')) {
            if (postId && postCategory) {
                console.log('Edit button clicked for ID:', postId, 'Category:', postCategory);
                editPostModal.style.display = 'block';
                await populateEditModal(postId, postCategory);
            } else {
                console.error("Edit button clicked, but post ID or category is missing from data-attributes.");
            }
        } else if (target.classList.contains('delete-button')) {
            if (postId && postCategory) {
                console.log('Delete button clicked for ID:', postId, 'Category:', postCategory);
                if (confirm(`Are you sure you want to delete this ${postCategory} post?`)) {
                    try {
                        const response = await fetch(`/api/posts/${postId}?category=${postCategory}`, { // Pass category to backend
                            method: 'DELETE',
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Failed to delete post.');
                        }

                        alert('Post deleted successfully!');
                        await window.loadPosts(); 
                    } catch (error) {
                        console.error('Error deleting post:', error);
                        alert(`Error deleting post: ${error.message}`);
                    }
                }
            } else {
                console.error("Delete button clicked, but post ID or category is missing from data-attributes.");
            }
        }
    });

    // --- POPULATE EDIT MODAL FUNCTION ---
    async function populateEditModal(postId, category) {
        try {
            const response = await fetch(`/api/posts/${postId}?category=${category}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const post = await response.json();

            if (!response.ok) {
                throw new Error(post.message || 'Failed to fetch post for edit.');
            }

            // Populate form fields in the edit modal
            editPostIdInput.value = post.id;
            document.getElementById('editPostTitle').value = post.title || '';
            document.getElementById('editPostBody').value = post.body || post.content || ''; // Use body or content
            document.getElementById('editPostCategory').value = post.category || '';

            // Toggle job-specific fields visibility in edit modal
            toggleEditJobFields(post.category);

            // Populate job-specific fields if it's a 'Jobs' post
            if (post.category === 'Jobs') {
                document.getElementById('editCompanyName').value = post.companyName || '';
                document.getElementById('editJobLocation').value = post.jobLocation || '';
                document.getElementById('editJobType').value = post.jobType || '';
                document.getElementById('editJobDescription').value = post.jobDescription || '';
                document.getElementById('editJobTags').value = (post.jobTags && Array.isArray(post.jobTags)) ? post.jobTags.join(', ') : '';

                // Display current Company Logo
                const currentCompanyLogoPreview = document.getElementById('currentCompanyLogoPreview');
                currentCompanyLogoPreview.innerHTML = post.companyLogoSrc ? `<img src="${post.companyLogoSrc}" alt="Current Company Logo" style="max-width: 100px; max-height: 100px; display: block; margin-bottom: 5px;">` : 'No current logo';

                // Display current Job Images (multiple)
                const currentJobImagesPreview = document.getElementById('currentJobImagesPreview');
                currentJobImagesPreview.innerHTML = ''; // Clear previous
                if (post.jobImageUrls && post.jobImageUrls.length > 0) {
                    post.jobImageUrls.forEach(url => {
                        currentJobImagesPreview.innerHTML += `<img src="${url}" alt="Job Image" style="max-width: 80px; max-height: 80px; margin-right: 5px; object-fit: cover;">`;
                    });
                } else {
                    currentJobImagesPreview.innerHTML = 'No current job images.';
                }

            }

            // Display current General Post Image
            const currentPostImagePreview = document.getElementById('currentPostImagePreview');
            currentPostImagePreview.innerHTML = post.imageSrc ? `<img src="${post.imageSrc}" alt="Current Post Image" style="max-width: 100px; max-height: 100px; display: block; margin-bottom: 5px;">` : 'No current image';


            // Set published checkbox
            document.getElementById('editPublished').checked = post.published || false;

            // Clear file inputs (important so user has to re-select if they want to change)
            document.getElementById('editPostImage').value = '';
            document.getElementById('editCompanyLogo').value = '';
            document.getElementById('editJobImages').value = '';

            // Reset removal checkboxes/inputs (if you have them)
            const removeImageCheckbox = document.getElementById('removeImage');
            if(removeImageCheckbox) removeImageCheckbox.checked = false;
            const removeCompanyLogoCheckbox = document.getElementById('removeCompanyLogo');
            if(removeCompanyLogoCheckbox) removeCompanyLogoCheckbox.checked = false;
            const removeJobImagesCheckbox = document.getElementById('removeJobImages');
            if(removeJobImagesCheckbox) removeJobImagesCheckbox.checked = false;


        } catch (error) {
            console.error('Error populating edit modal:', error);
            alert('Failed to load post for editing: ' + error.message);
            editPostModal.style.display = 'none'; // Close modal on error
        }
    }


    // --- EDIT POST FORM SUBMISSION ---
    editPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const postId = editPostIdInput.value;
        const formData = new FormData(editPostForm);

        // Get the category from the form data to pass to the API
        const category = formData.get('category'); // Make sure your edit form has a 'category' input

        // Log formData contents for debugging (optional)
        console.log("Submitting edit form data:");
        for (const pair of formData.entries()) {
            console.log(pair[0] + ': ' + (typeof pair[1] === 'object' && pair[1] !== null ? pair[1].name || 'File Object' : pair[1]));
        }

        try {
            const response = await fetch(`/api/posts/${postId}?category=${category}`, { // Pass category for backend to identify model
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData // Send FormData directly for file uploads
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to update post.');
            }

            alert('Post updated successfully!');
            editPostModal.style.display = 'none'; // Hide modal
            await window.loadPosts(); // Reload posts to show changes
        } catch (error) {
            console.error('Error updating post:', error);
            alert(`Error updating post: ${error.message}`);
        }
    });


    // logout functionality
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

    // Close modal when close button or outside click
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (editPostModal) editPostModal.style.display = 'none';
            // Add other modals if you have them
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == editPostModal) {
            editPostModal.style.display = 'none';
        }
    });


    // Initial load of posts when the page loads
    await window.loadPosts();
});