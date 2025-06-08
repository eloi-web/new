const firebaseConfig = {
    apiKey: "AIzaSyDA1oonly5aQv0NPPna32lJli3P2GVPzHs",
    authDomain: "gba-marketplace.firebaseapp.com",
    projectId: "gba-marketplace",
    messagingSenderId: "110246782047",
    appId: "1:110246782047:web:ca126e8b6466395833e7ea",
    measurementId: "G-SSS7TFDC83"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
// const storage = firebase.storage(); // REMOVED: Firebase Storage is no longer used directly here
const db = firebase.firestore();
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('adminToken');
    // Redirect if not authenticated
    if (!token) {
        window.location.href = '/log-in.html';
        return;
    }

    // --- Create Post Form Elements ---
    const postForm = document.getElementById('postForm');
    const postCategorySelect = document.getElementById('postCategory');
    const jobFieldsDiv = document.getElementById('jobFields');
    const postTitleInput = document.getElementById('postTitle');
    const postContentTextarea = document.getElementById('postContent');
    const postPublishedCheckbox = document.getElementById('postPublished');

    const companyNameInput = document.getElementById('companyName'); // Make sure you have this ID in your HTML
    const jobLocationInput = document.getElementById('jobLocation'); // Make sure you have this ID in your HTML
    const jobTypeInput = document.getElementById('jobType'); // Make sure you have this ID in your HTML
    const jobDescriptionTextarea = document.getElementById('jobDescription'); // Make sure you have this ID in your HTML
    const jobTagsInput = document.getElementById('jobTags'); // Make sure you have this ID in your HTML

    const jobImagesInput = document.getElementById('jobImages');
    const companyLogoInput = document.getElementById('companyLogo');
    const jobImagePreviewsDiv = document.getElementById('jobImagePreviews'); // Get preview div
    const companyLogoPreviewDiv = document.getElementById('companyLogoPreview'); // Get preview div

    const logoutButton = document.getElementById('logoutButton');
    const postsContainer = document.getElementById('postsContainer');

    // --- Edit Post Modal Elements ---
    const editPostModal = document.getElementById('editPostModal');
    const closeEditModalButton = document.getElementById('closeEditModalButton');
    const editPostForm = document.getElementById('editPostForm');
    const cancelEditButton = document.getElementById('cancelEditButton');

    const editPostIdInput = document.getElementById('editPostId');
    const editPostCategorySelect = document.getElementById('editPostCategory');
    const editPostTitleInput = document.getElementById('editPostTitle');
    const editPostContentTextarea = document.getElementById('editPostContent');
    const editPostPublishedCheckbox = document.getElementById('editPostPublished');
    const editJobFieldsDiv = document.getElementById('editJobFields'); // Div for job specific fields in edit modal

    const editCompanyNameInput = document.getElementById('editCompanyName');
    const editJobLocationInput = document.getElementById('editJobLocation');
    const editJobTypeInput = document.getElementById('editJobType');
    const editJobDescriptionTextarea = document.getElementById('editJobDescription');
    const editJobTagsInput = document.getElementById('editJobTags');

    const editCompanyLogoInput = document.getElementById('editCompanyLogo');
    const currentCompanyLogoDiv = document.getElementById('currentCompanyLogo'); // For displaying existing logo
    const editNewCompanyLogoPreviewDiv = document.getElementById('editNewCompanyLogoPreview'); // For new logo preview

    const editJobImagesInput = document.getElementById('editJobImages');
    const currentJobImagesDiv = document.getElementById('currentJobImages'); // For displaying existing job images
    const editNewJobImagePreviewsDiv = document.getElementById('editNewJobImagePreviews'); // For new job images preview


    // --- Helper function for image preview (for new files) ---
    const setupImagePreview = (inputElement, previewDiv) => {
        inputElement.addEventListener('change', () => {
            previewDiv.innerHTML = ''; // Clear previous previews
            if (inputElement.files && inputElement.files.length > 0) {
                Array.from(inputElement.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.style.maxWidth = '100px';
                        img.style.maxHeight = '100px';
                        img.style.marginRight = '10px';
                        img.style.objectFit = 'cover'; // Ensure image fills container
                        previewDiv.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                });
            }
        });
    };

    // Set up image previews for create form
    setupImagePreview(jobImagesInput, jobImagePreviewsDiv);
    setupImagePreview(companyLogoInput, companyLogoPreviewDiv);

    // Set up image previews for new files in the edit modal
    setupImagePreview(editJobImagesInput, editNewJobImagePreviewsDiv);
    setupImagePreview(editCompanyLogoInput, editNewCompanyLogoPreviewDiv);


    // --- New: Function to upload a single file to backend (Cloudinary) ---
    async function uploadFileToBackend(file, folderName) {
        const formData = new FormData();
        formData.append('image', file); // 'image' must match the field name in your Multer setup
        formData.append('folder', folderName); // Pass the desired Cloudinary folder

        try {
            const response = await fetch('/api/upload-single-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Ensure admin token is sent
                },
                body: formData // Multer expects FormData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`File upload failed: ${errorData.message}`);
            }

            const data = await response.json();
            return data.url; // Return the Cloudinary URL
        } catch (error) {
            console.error('Error uploading file to backend:', error);
            alert(`Error uploading ${file.name}: ${error.message}`);
            return null; // Return null on failure
        }
    }

    // --- New: Function to upload multiple files to backend (Cloudinary) ---
    async function uploadMultipleFilesToBackend(files, folderName) {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('images', file); // 'images' must match the field name in your Multer setup
        });
        formData.append('folder', folderName);

        try {
            const response = await fetch('/api/upload-multiple-images', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Ensure admin token is sent
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Multiple file upload failed: ${errorData.message}`);
            }

            const data = await response.json();
            return data.urls; // Return array of Cloudinary URLs
        } catch (error) {
            console.error('Error uploading multiple files to backend:', error);
            alert(`Error uploading job images: ${error.message}`);
            return []; // Return empty array on failure
        }
    }

    // --- Category field visibility and 'required' attribute logic for CREATE FORM ---
    const toggleJobFields = () => {
        const isJobsCategory = postCategorySelect.value === 'Jobs';
        jobFieldsDiv.style.display = isJobsCategory ? 'block' : 'none';

        // Get all job-specific input elements for the CREATE form
        const jobSpecificInputs = [
            companyNameInput,
            jobLocationInput,
            jobTypeInput,
            jobDescriptionTextarea,
            // jobTagsInput, // Tags might not be strictly required initially
            companyLogoInput,
            jobImagesInput
        ].filter(Boolean); // Filter out any elements that might not exist

        jobSpecificInputs.forEach(input => {
            if (isJobsCategory) {
                input.setAttribute('required', ''); // Add required attribute
            } else {
                input.removeAttribute('required'); // Remove required attribute
                // Also clear values if hiding, to prevent accidental submission of old data
                input.value = '';
            }
        });

        // Clear image previews and file inputs when category changes
        jobImagePreviewsDiv.innerHTML = '';
        companyLogoPreviewDiv.innerHTML = '';
        jobImagesInput.value = ''; // Clear file input
        companyLogoInput.value = ''; // Clear file input
    };
    postCategorySelect.addEventListener('change', toggleJobFields);
    toggleJobFields(); // Call on load to set initial state and attributes


    // --- Category field visibility and 'required' attribute logic for EDIT MODAL ---
    const toggleEditJobFields = () => {
        const isJobsCategory = editPostCategorySelect.value === 'Jobs';
        editJobFieldsDiv.style.display = isJobsCategory ? 'block' : 'none';

        // Get all job-specific input elements for the EDIT form
        const editJobSpecificInputs = [
            editCompanyNameInput,
            editJobLocationInput,
            editJobTypeInput,
            editJobDescriptionTextarea,
            // editJobTagsInput, // Tags might not be strictly required initially
            editCompanyLogoInput,
            editJobImagesInput
        ].filter(Boolean); // Filter out any elements that might not exist

        editJobSpecificInputs.forEach(input => {
            if (isJobsCategory) {
                input.setAttribute('required', ''); // Add required attribute
            } else {
                input.removeAttribute('required'); // Remove required attribute
                // Clear file inputs, but don't clear values of text fields here
                // as they might be populated from existing post data.
                if (input.type === 'file') {
                    input.value = '';
                }
            }
        });

        // Clear NEW image previews for edit modal
        editNewCompanyLogoPreviewDiv.innerHTML = '';
        editNewJobImagePreviewsDiv.innerHTML = '';
        editCompanyLogoInput.value = ''; // Clear file input
        editJobImagesInput.value = ''; // Clear file input

        // Clear existing image displays when switching away from 'Jobs' category
        if (!isJobsCategory) {
            currentCompanyLogoDiv.innerHTML = '';
            currentJobImagesDiv.innerHTML = '';
        }
    };
    editPostCategorySelect.addEventListener('change', toggleEditJobFields);


    // --- Create Post Form Submission ---
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = postForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Creating...';

        try {
            const category = postCategorySelect.value;
            const title = postTitleInput.value; // Use defined variable
            const content = postContentTextarea.value; // Use defined variable
            const published = postPublishedCheckbox.checked; // Use defined variable

            let companyLogoUrl = null;
            let uploadedJobImageUrls = [];

            // --- Handle Image Uploads to Backend (Cloudinary) ---
            const companyLogoFile = companyLogoInput.files[0];
            if (companyLogoFile) {
                companyLogoUrl = await uploadFileToBackend(companyLogoFile, 'company_logos');
                if (companyLogoUrl === null) { // Check for null explicitly
                    throw new Error('Company logo upload failed.');
                }
            }

            const jobImagesFiles = jobImagesInput.files;
            if (jobImagesFiles && jobImagesFiles.length > 0) {
                uploadedJobImageUrls = await uploadMultipleFilesToBackend(jobImagesFiles, 'job_images');
                if (uploadedJobImageUrls.length === 0 && jobImagesFiles.length > 0) {
                    // If files were selected but none uploaded, it's an error
                    throw new Error('Some or all job images failed to upload.');
                }
            }

            const postData = {
                category,
                title,
                content,
                published,
            };

            // Add job-specific fields if category is Jobs
            if (category === 'Jobs') {
                postData.companyName = companyNameInput.value; // Use defined variable
                postData.jobLocation = jobLocationInput.value; // Use defined variable
                postData.jobType = jobTypeInput.value; // Use defined variable
                postData.jobDescription = jobDescriptionTextarea.value; // Use defined variable
                postData.jobTags = jobTagsInput.value; // Use defined variable // Keep as string, backend splits
                postData.companyLogoUrl = companyLogoUrl; // Attach Cloudinary URL
                postData.jobImageUrls = uploadedJobImageUrls; // Attach Cloudinary URLs
            }

            // --- Send Post Data to Backend (Firestore via Express) ---
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData) // Send all post data including image URLs
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                postForm.reset();
                jobImagePreviewsDiv.innerHTML = ''; // Clear image previews
                companyLogoPreviewDiv.innerHTML = '';
                toggleJobFields(); // Reset category visibility and required attributes
                await loadPosts(); // Reload posts to show the new one
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
            console.error('Error in post creation:', error);
            alert(`Failed to create post: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Create Post';
        }
    });

    // --- Load Posts for Admin View ---
    const loadPosts = async () => {
        try {
            postsContainer.innerHTML = '<p>Loading posts...</p>';
            const response = await fetch('/api/posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const posts = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error(`Authentication Error: ${posts.message || 'Your session has expired. Please log in again.'}`);
                } else {
                    throw new Error(`Error loading posts: ${posts.message || 'An unexpected error occurred.'}`);
                }
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
                            ${post.jobImageUrls && post.jobImageUrls.length > 0 ?
                                post.jobImageUrls.map(url => `<img src="${url}" alt="Job Image" style="max-width: 80px; max-height: 80px; margin-right: 5px; margin-bottom: 5px; object-fit: cover;">`).join('')
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
                setTimeout(() => { window.location.href = '/log-in.html'; }, 2000);
            }
        }
    };


    // --- Edit Post Functionality ---
    window.editPost = async (postId) => {
        try {
            const response = await fetch(`/api/posts/${postId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const post = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error(`Authentication Error: ${post.message || 'Your session has expired. Please log in again.'}`);
                } else {
                    throw new Error(`Error fetching post for edit: ${post.message || 'An unexpected error occurred.'}`);
                }
            }

            // Populate form fields
            editPostIdInput.value = post.id;
            editPostCategorySelect.value = post.category || 'Jobs';
            editPostTitleInput.value = post.title;
            editPostContentTextarea.value = post.content || '';
            editPostPublishedCheckbox.checked = post.published;

            // Reset file inputs and new previews when modal opens
            editCompanyLogoInput.value = '';
            editJobImagesInput.value = '';
            editNewCompanyLogoPreviewDiv.innerHTML = '';
            editNewJobImagePreviewsDiv.innerHTML = '';


            // Show/hide job specific fields in edit modal and populate
            toggleEditJobFields(); // Call to set display and required attributes

            if (post.category === 'Jobs') {
                editCompanyNameInput.value = post.companyName || '';
                editJobLocationInput.value = post.jobLocation || '';
                editJobTypeInput.value = post.jobType || '';
                editJobDescriptionTextarea.value = post.jobDescription || '';
                editJobTagsInput.value = post.jobTags && Array.isArray(post.jobTags) ? post.jobTags.join(', ') : '';

                // Display current Company Logo (Cloudinary URL)
                currentCompanyLogoDiv.innerHTML = ''; // Clear previous content
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
                    removeBtn.classList.add('remove-image-button'); // Add a class for styling
                    removeBtn.type = 'button'; // Prevent form submission
                    removeBtn.onclick = () => {
                        logoContainer.remove(); // Remove the entire container
                        post.companyLogoUrl = null; // Mark for removal in update
                        editCompanyLogoInput.value = ''; // Clear file input (optional, just to be sure)
                    };
                    logoContainer.appendChild(removeBtn);
                } else {
                    logoContainer.innerHTML = '<p>No current logo.</p>';
                }
                currentCompanyLogoDiv.appendChild(logoContainer);


                // Display current Job Images (Cloudinary URLs)
                currentJobImagesDiv.innerHTML = ''; // Clear previous content
                if (post.jobImageUrls && post.jobImageUrls.length > 0) {
                    post.jobImageUrls.forEach((url) => { // Removed index as it's not strictly needed here
                        const imgContainer = document.createElement('div');
                        imgContainer.dataset.url = url; // Store original URL to filter later
                        imgContainer.style.display = 'inline-block';
                        imgContainer.style.marginRight = '10px';
                        imgContainer.style.marginBottom = '10px';
                        imgContainer.style.position = 'relative'; // For positioning the close button
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
                        removeBtn.classList.add('remove-image-button-small'); // Add a class for styling
                        removeBtn.type = 'button'; // Prevent form submission
                        removeBtn.style.position = 'absolute';
                        removeBtn.style.top = '0px';
                        removeBtn.style.right = '0px';
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
                            // No need to modify 'post.jobImageUrls' directly here.
                            // The update logic will re-read currentJobImagesDiv.
                        };
                        imgContainer.appendChild(removeBtn);
                        currentJobImagesDiv.appendChild(imgContainer);
                    });
                } else {
                    currentJobImagesDiv.innerHTML = '<p>No current job images.</p>';
                }

            } else {
                // If not a 'Jobs' category, ensure job fields are hidden in the modal
                editJobFieldsDiv.style.display = 'none';
            }

            editPostModal.style.display = 'block'; // Show the modal

        } catch (error) {
            console.error('Error editing post:', error);
            alert(`Failed to load post for editing: ${error.message}`);
            if (error.message.includes('Authentication Error')) {
                localStorage.removeItem('adminToken');
                setTimeout(() => { window.location.href = '/log-in.html'; }, 2000);
            }
        }
    };


    // --- Edit Post Form Submission (Update) ---
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

            // --- Handle NEW Image Uploads for Edit ---
            const newCompanyLogoFile = editCompanyLogoInput.files[0];
            if (newCompanyLogoFile) {
                // If a new file is selected, upload it
                finalCompanyLogoUrl = await uploadFileToBackend(newCompanyLogoFile, 'company_logos');
                if (finalCompanyLogoUrl === null) {
                    throw new Error('New company logo upload failed.');
                }
            } else {
                // If no new file, check if an existing one is still displayed (not removed)
                const existingLogoImg = currentCompanyLogoDiv.querySelector('img');
                if (existingLogoImg && existingLogoImg.src) {
                    finalCompanyLogoUrl = existingLogoImg.src; // Retain existing URL
                } else {
                    finalCompanyLogoUrl = null; // No new file, and existing was removed or didn't exist
                }
            }

            const newJobImagesFiles = editJobImagesInput.files;
            let newlyUploadedJobImageUrls = [];
            if (newJobImagesFiles && newJobImagesFiles.length > 0) {
                newlyUploadedJobImageUrls = await uploadMultipleFilesToBackend(newJobImagesFiles, 'job_images');
                if (newlyUploadedJobImageUrls.length === 0 && newJobImagesFiles.length > 0) {
                    throw new Error('Some or all new job images failed to upload.');
                }
            }

            // Combine existing (non-removed) images with newly uploaded images
            // Read URLs from the `currentJobImagesDiv` which reflects removals
            const currentJobImageElements = currentJobImagesDiv.querySelectorAll('div[data-url]'); // Select div with data-url attribute
            const existingJobImageUrls = Array.from(currentJobImageElements).map(div => div.dataset.url);
            finalJobImageUrls = [...existingJobImageUrls, ...newlyUploadedJobImageUrls];


            const updatedPostData = {
                category, // Include category in update
                title,
                content,
                published,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp() // Update timestamp
            };

            // Only update job-specific fields if the category is 'Jobs'
            // and include image URLs
            if (category === 'Jobs') {
                updatedPostData.companyName = editCompanyNameInput.value;
                updatedPostData.jobLocation = editJobLocationInput.value;
                updatedPostData.jobType = editJobTypeInput.value;
                updatedPostData.jobDescription = editJobDescriptionTextarea.value;
                updatedPostData.jobTags = editJobTagsInput.value; // Keep as string, backend splits
                updatedPostData.companyLogoUrl = finalCompanyLogoUrl; // Attach updated Cloudinary URL
                updatedPostData.jobImageUrls = finalJobImageUrls; // Attach updated Cloudinary URLs
            } else {
                // If category is changed from 'Jobs' to something else, clear job-specific fields
                updatedPostData.companyName = firebase.firestore.FieldValue.delete();
                updatedPostData.jobLocation = firebase.firestore.FieldValue.delete();
                updatedPostData.jobType = firebase.firestore.FieldValue.delete();
                updatedPostData.jobDescription = firebase.firestore.FieldValue.delete();
                updatedPostData.jobTags = firebase.firestore.FieldValue.delete();
                updatedPostData.companyLogoUrl = firebase.firestore.FieldValue.delete();
                updatedPostData.jobImageUrls = firebase.firestore.FieldValue.delete();
            }


            const response = await fetch(`/api/posts?id=${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedPostData)
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                editPostModal.style.display = 'none'; // Close modal
                await loadPosts(); // Reload posts
            } else {
                if (response.status === 401 || response.status === 403) {
                    alert(`Authentication Error: ${data.message || 'Your session has expired. Please log in again.'}`);
                    localStorage.removeItem('adminToken');
                    window.location.href = '/log-in.html';
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

    // --- Modal close functionality ---
    closeEditModalButton.addEventListener('click', () => {
        editPostModal.style.display = 'none';
    });

    cancelEditButton.addEventListener('click', () => {
        editPostModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === editPostModal) {
            editPostModal.style.display = 'none';
        }
    });

    // --- Delete Post Functionality ---
    window.deletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
            return;
        }
        try {
            const response = await fetch(`/api/posts?id=${postId}`, { // Changed to query param for consistency
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
        }
        catch (error) {
            console.error('Network error deleting post:', error);
            alert('A network error occurred while deleting the post.');
        }
    };

    // --- Logout Functionality ---
    logoutButton.addEventListener('click', async () => {
        try {
            await auth.signOut();
            localStorage.removeItem('adminToken');
            alert('Logged out successfully!');
            window.location.href = '/log-in.html';
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Error logging out. Please try again.');
        }
    });

    // Initial load of posts when the page loads
    await loadPosts();
});