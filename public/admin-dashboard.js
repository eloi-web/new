document.addEventListener('DOMContentLoaded', async () => {
    const postCategorySelect = document.getElementById('postCategory');
    const jobFieldsDiv = document.getElementById('jobFields');
    const token = localStorage.getItem('adminToken');
    if (!token) {
        alert('No admin token found, please log in.');
        window.location.href = '/public/public/log-in.html';
        return;
    }

    const postsContainer = document.getElementById('postsContainer');
    const editPostModal = document.getElementById('editPostModal');
    const closeEditModalButton = document.getElementById('closeEditModalButton');
    const cancelEditButton = document.getElementById('cancelEditButton');
    const editPostForm = document.getElementById('editPostForm');
    const logoutButton = document.getElementById('logoutButton');

    // Form fields
    const editPostIdInput = document.getElementById('editPostId');
    const editPostCategorySelect = document.getElementById('editPostCategory');
    const editPostTitleInput = document.getElementById('editPostTitle');
    const editPostContentTextarea = document.getElementById('editPostContent');
    const editPostPublishedCheckbox = document.getElementById('editPostPublished');

    // Job-specific fields
    const editJobFieldsDiv = document.getElementById('editJobFields');
    const editCompanyNameInput = document.getElementById('editCompanyName');
    const editJobLocationInput = document.getElementById('editJobLocation');
    const editJobTypeInput = document.getElementById('editJobType');
    const editJobDescriptionTextarea = document.getElementById('editJobDescription');
    const editJobTagsInput = document.getElementById('editJobTags');

    // File inputs and previews
    const editCompanyLogoInput = document.getElementById('editCompanyLogo');
    const currentCompanyLogoDiv = document.getElementById('currentCompanyLogo');
    const editNewCompanyLogoPreviewDiv = document.getElementById('editNewCompanyLogoPreview');
    const editJobImagesInput = document.getElementById('editJobImages');
    const currentJobImagesDiv = document.getElementById('currentJobImages');
    const editNewJobImagePreviewsDiv = document.getElementById('editNewJobImagePreviews');

    // Utility: Toggle job fields visibility based on category
    function toggleEditJobFields() {
        if (editPostCategorySelect.value === 'Jobs') {
            editJobFieldsDiv.style.display = 'block';
            // Make job fields required if needed
            editCompanyNameInput.required = true;
            editJobLocationInput.required = true;
            editJobTypeInput.required = true;
            editJobDescriptionTextarea.required = true;
            editJobTagsInput.required = true;
        } else {
            editJobFieldsDiv.style.display = 'none';
            editCompanyNameInput.required = false;
            editJobLocationInput.required = false;
            editJobTypeInput.required = false;
            editJobDescriptionTextarea.required = false;
            editJobTagsInput.required = false;
        }
    }

    postCategorySelect.addEventListener('change', toggleEditJobFields);
    window.addEventListener('DOMContentLoaded', toggleEditJobFields);
    editPostCategorySelect.addEventListener('change', toggleEditJobFields);

    // Helper: Upload single file, returns uploaded file URL or null
    async function uploadFileToBackend(file, folder) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            return data.url || null;
        } catch (err) {
            console.error('Upload error:', err);
            return null;
        }
    }

    // Helper: Upload multiple files, returns array of URLs
    async function uploadMultipleFilesToBackend(files, folder) {
        const urls = [];
        for (const file of files) {
            const url = await uploadFileToBackend(file, folder);
            if (url) urls.push(url);
        }
        return urls;
    }

    // Load and render all posts
    async function loadPosts() {
        try {
            const response = await fetch('/api/posts', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error('Authentication Error: Your session expired. Please log in again.');
                }
                throw new Error(`Error loading posts: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            let posts;

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
            ${post.companyLogoUrl ? `<img src="${post.companyLogoUrl}" alt="Company Logo" style="max-width: 80px; max-height: 80px; margin-right: 10px; object-fit: contain;">` : ''}
            <div class="job-images-display" style="display: flex; flex-wrap: wrap; margin-top: 5px;">
              ${post.jobImageUrls && post.jobImageUrls.length > 0 ? post.jobImageUrls.map(url => `<img src="${url}" alt="Job Image" style="max-width: 80px; max-height: 80px; margin-right: 5px; margin-bottom: 5px; object-fit: cover;">`).join('') : ''}
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
                setTimeout(() => { window.location.href = '/public/log-in.html'; }, 2000);
            }
        }
    }

    // Edit post: fetch post data and populate edit form
    window.editPost = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error('Authentication Error: Your session has expired. Please log in again.');
                } else {
                    throw new Error('Failed to load post for editing.');
                }
            }

            const post = await response.json();

            // Populate form
            editPostIdInput.value = post.id;
            editPostCategorySelect.value = post.category || 'Jobs';
            editPostTitleInput.value = post.title;
            editPostContentTextarea.value = post.content || '';
            editPostPublishedCheckbox.checked = post.published;

            // Reset files and previews
            editCompanyLogoInput.value = '';
            editJobImagesInput.value = '';
            editNewCompanyLogoPreviewDiv.innerHTML = '';
            editNewJobImagePreviewsDiv.innerHTML = '';

            toggleEditJobFields();

            if (post.category === 'Jobs') {
                editCompanyNameInput.value = post.companyName || '';
                editJobLocationInput.value = post.jobLocation || '';
                editJobTypeInput.value = post.jobType || '';
                editJobDescriptionTextarea.value = post.jobDescription || '';
                editJobTagsInput.value = post.jobTags && Array.isArray(post.jobTags) ? post.jobTags.join(', ') : '';

                // Show current company logo
                currentCompanyLogoDiv.innerHTML = '';
                const logoContainer = document.createElement('div');
                logoContainer.style.display = 'flex';
                logoContainer.style.alignItems = 'center';
                logoContainer.style.gap = '10px';

                if (post.companyLogoUrl) {
                    const img = document.createElement('img');
                    img.src = post.companyLogoUrl;
                    img.alt = "Current Company Logo";
                    img.style.maxWidth = '100px';
                    img.style.maxHeight = '100px';
                    img.style.objectFit = 'contain';
                    logoContainer.appendChild(img);

                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Remove';
                    removeBtn.classList.add('remove-image-button');
                    removeBtn.type = 'button';
                    removeBtn.onclick = () => {
                        logoContainer.remove();
                        post.companyLogoUrl = null;
                        editCompanyLogoInput.value = '';
                    };
                    logoContainer.appendChild(removeBtn);
                } else {
                    logoContainer.innerHTML = '<p>No current logo.</p>';
                }
                currentCompanyLogoDiv.appendChild(logoContainer);

                // Show current job images
                currentJobImagesDiv.innerHTML = '';
                if (post.jobImageUrls && post.jobImageUrls.length > 0) {
                    post.jobImageUrls.forEach(url => {
                        const imgContainer = document.createElement('div');
                        imgContainer.dataset.url = url;
                        imgContainer.style.display = 'inline-block';
                        imgContainer.style.marginRight = '10px';
                        imgContainer.style.marginBottom = '10px';
                        imgContainer.style.position = 'relative';
                        imgContainer.style.border = '1px solid #ccc';
                        imgContainer.style.padding = '5px';

                        const img = document.createElement('img');
                        img.src = url;
                        img.alt = "Job Image";
                        img.style.maxWidth = '80px';
                        img.style.maxHeight = '80px';
                        img.style.objectFit = 'cover';
                        imgContainer.appendChild(img);

                        const removeBtn = document.createElement('button');
                        removeBtn.textContent = 'x';
                        removeBtn.classList.add('remove-image-button-small');
                        removeBtn.type = 'button';
                        removeBtn.style.position = 'absolute';
                        removeBtn.style.top = '0';
                        removeBtn.style.right = '0';
                        removeBtn.style.background = 'red';
                        removeBtn.style.color = 'white';
                        removeBtn.style.border = 'none';
                        removeBtn.style.borderRadius = '50%';
                        removeBtn.style.width = '20px';
                        removeBtn.style.height = '20px';
                        removeBtn.style.display = 'flex';
                        removeBtn.style.justifyContent = 'center';
                        removeBtn.style.alignItems = 'center';
                        removeBtn.style.cursor = 'pointer';

                        removeBtn.onclick = () => {
                            imgContainer.remove();
                        };

                        imgContainer.appendChild(removeBtn);
                        currentJobImagesDiv.appendChild(imgContainer);
                    });
                } else {
                    currentJobImagesDiv.innerHTML = '<p>No current job images.</p>';
                }
            } else {
                editJobFieldsDiv.style.display = 'none';
                currentCompanyLogoDiv.innerHTML = '';
                currentJobImagesDiv.innerHTML = '';
            }

            editPostModal.style.display = 'block';
        } catch (error) {
            console.error('Error editing post:', error);
            alert(`Failed to load post for editing: ${error.message}`);
            if (error.message.includes('Authentication Error')) {
                localStorage.removeItem('adminToken');
                setTimeout(() => { window.location.href = '/public/log-in.html'; }, 2000);
            }
        }
    };

    // Handle form submit (update post)
    editPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = editPostForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Saving...';

        try {
            const postId = editPostIdInput.value;
            const category = editPostCategorySelect.value;
            const title = editPostTitleInput.value;
            const content = editPostContentTextarea.value;
            const published = editPostPublishedCheckbox.checked;

            let finalCompanyLogoUrl = null;
            let finalJobImageUrls = [];

            // Upload new company logo if selected
            const newCompanyLogoFile = editCompanyLogoInput.files[0];
            if (newCompanyLogoFile) {
                finalCompanyLogoUrl = await uploadFileToBackend(newCompanyLogoFile, 'company_logos');
                if (finalCompanyLogoUrl === null) {
                    throw new Error('New company logo upload failed.');
                }
            } else {
                const existingLogoImg = currentCompanyLogoDiv.querySelector('img');
                finalCompanyLogoUrl = existingLogoImg ? existingLogoImg.src : null;
            }

            // Upload new job images if selected
            const newJobImagesFiles = editJobImagesInput.files;
            let newlyUploadedJobImageUrls = [];
            if (newJobImagesFiles && newJobImagesFiles.length > 0) {
                newlyUploadedJobImageUrls = await uploadMultipleFilesToBackend(newJobImagesFiles, 'job_images');
                if (newlyUploadedJobImageUrls.length === 0 && newJobImagesFiles.length > 0) {
                    throw new Error('Some or all new job images failed to upload.');
                }
            }

            // Combine existing (non-removed) job images with newly uploaded
            const currentJobImageElements = currentJobImagesDiv.querySelectorAll('div[data-url]');
            const existingJobImageUrls = Array.from(currentJobImageElements).map(div => div.dataset.url);
            finalJobImageUrls = [...existingJobImageUrls, ...newlyUploadedJobImageUrls];

            // Prepare updated post data
            const updatedPostData = {
                category,
                title,
                content,
                published,
                updatedAt: new Date().toISOString()
            };

            if (category === 'Jobs') {
                updatedPostData.companyName = editCompanyNameInput.value;
                updatedPostData.jobLocation = editJobLocationInput.value;
                updatedPostData.jobType = editJobTypeInput.value;
                updatedPostData.jobDescription = editJobDescriptionTextarea.value;
                updatedPostData.jobTags = editJobTagsInput.value.split(',').map(tag => tag.trim());
                updatedPostData.companyLogoUrl = finalCompanyLogoUrl;
                updatedPostData.jobImageUrls = finalJobImageUrls;
            } else {
                // Clear job-specific fields if category changed
                updatedPostData.companyName = null;
                updatedPostData.jobLocation = null;
                updatedPostData.jobType = null;
                updatedPostData.jobDescription = null;
                updatedPostData.jobTags = null;
                updatedPostData.companyLogoUrl = null;
                updatedPostData.jobImageUrls = null;
            }

            const response = await fetch(`/api/posts?id=${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedPostData)
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                editPostModal.style.display = 'none';
                await loadPosts();
            } else {
                if (response.status === 401 || response.status === 403) {
                    alert(`Authentication Error: ${data.message || 'Your session has expired. Please log in again.'}`);
                    localStorage.removeItem('adminToken');
                    window.location.href = '/public/log-in.html';
                } else {
                    alert(`Error updating post: ${data.message || 'An unexpected error occurred.'}`);
                }
            }
        } catch (error) {
            console.error('Error in post update:', error);
            alert(`Failed to update post: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Save Changes';
        }
    });

    closeEditModalButton.addEventListener('click', () => {
        editPostModal.style.display = 'none';
    });
    cancelEditButton.addEventListener('click', () => {
        editPostModal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === editPostModal) {
            editPostModal.style.display = 'none';
        }
    });

    // Delete post function
    window.deletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
            return;
        }
        try {
            const response = await fetch(`/api/posts?id=${postId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                await loadPosts();
            } else {
                if (response.status === 401 || response.status === 403) {
                    alert(`Authentication Error: ${data.message || 'Your session has expired. Please log in again.'}`);
                    localStorage.removeItem('adminToken');
                    window.location.href = '/public/log-in.html';
                } else {
                    alert(`Error deleting post: ${data.message || 'An unexpected error occurred.'}`);
                }
            }
        } catch (error) {
            console.error('Network error deleting post:', error);
            alert('A network error occurred while deleting the post.');
        }
    };

    logoutButton.addEventListener('click', async () => {
        try {
            localStorage.removeItem('adminToken');
            alert('Logged out successfully!');
            window.location.href = '/public/log-in.html';
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Error logging out. Please try again.');
        }
    });

    await loadPosts();
});