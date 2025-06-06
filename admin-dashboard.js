const firebaseConfig = {
    apiKey: "AIzaSyDA1oonly5aQv0NPPna32lJli3P2GVPzHs",
    authDomain: "gba-marketplace.firebaseapp.com",
    projectId: "gba-marketplace",
    storageBucket: "gba-marketplace.firebasestorage.app",
    messagingSenderId: "110246782047",
    appId: "1:110246782047:web:ca126e8b6466395833e7ea",
    measurementId: "G-SSS7TFDC83"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get Firebase service instances
const storage = firebase.storage();
const db = firebase.firestore();
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('adminToken');
    // Redirect to login if no token is found
    if (!token) {
        alert('You are not authorized. Please log in.');
        window.location.href = '/log-in.html'; // Adjust to your login page path
        return;
    }

    // Get references to HTML elements
    const postForm = document.getElementById('postForm');
    const postCategorySelect = document.getElementById('postCategory');
    const jobFieldsDiv = document.getElementById('jobFields');
    const jobImagesInput = document.getElementById('jobImages');
    const companyLogoInput = document.getElementById('companyLogo');
    const logoutButton = document.getElementById('logoutButton');
    const postsContainer = document.getElementById('postsContainer');
    const editPostModal = document.getElementById('editPostModal');
    const closeEditModalButton = document.getElementById('closeEditModalButton');
    const editPostForm = document.getElementById('editPostForm');
    const cancelEditButton = document.getElementById('cancelEditButton');

    // Edit modal specific elements
    const editPostIdInput = document.getElementById('editPostId');
    const editPostCategorySelect = document.getElementById('editPostCategory');
    const editPostTitleInput = document.getElementById('editPostTitle');
    const editPostContentTextarea = document.getElementById('editPostContent');
    const editPostPublishedCheckbox = document.getElementById('editPostPublished');
    const editJobFieldsDiv = document.getElementById('editJobFields'); // Corresponds to job-specific fields in edit modal
    const editCompanyNameInput = document.getElementById('editCompanyName');
    const editJobLocationInput = document.getElementById('editJobLocation');
    const editJobTypeInput = document.getElementById('editJobType');
    const editJobDescriptionTextarea = document.getElementById('editJobDescription');
    const editJobTagsInput = document.getElementById('editJobTags');
    const editCompanyLogoInput = document.getElementById('editCompanyLogo');
    const currentCompanyLogoDiv = document.getElementById('currentCompanyLogo');
    const editJobImagesInput = document.getElementById('editJobImages');
    const currentJobImagesDiv = document.getElementById('currentJobImages');


    // Event listener for logout button
    logoutButton.addEventListener('click', async () => {
        try {
            await auth.signOut();
            localStorage.removeItem('adminToken');
            alert('Logged out successfully!');
            window.location.href = '/log-in.html'; // Redirect to login page
        } catch (error) {
            console.error('Logout error:', error);
            alert('Failed to log out. Please try again.');
        }
    });

    // Function to handle image file uploads to Firebase Storage
    const uploadFile = async (file, path) => {
        const storageRef = storage.ref(path + file.name);
        const snapshot = await storageRef.put(file);
        return await snapshot.ref.getDownloadURL();
    };

    // Function to display image previews for file inputs
    const displayImagePreview = (input, previewDiv) => {
        previewDiv.innerHTML = ''; // Clear previous previews
        if (input.files && input.files[0]) {
            Array.from(input.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.style.maxWidth = '100px';
                    img.style.maxHeight = '100px';
                    img.style.marginRight = '10px';
                    img.style.border = '1px solid #ddd';
                    previewDiv.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // Event listeners for image previews
    jobImagesInput.addEventListener('change', () => {
        const jobImagePreviews = document.getElementById('jobImagePreviews');
        displayImagePreview(jobImagesInput, jobImagePreviews);
    });

    companyLogoInput.addEventListener('change', () => {
        const companyLogoPreview = document.getElementById('companyLogoPreview');
        displayImagePreview(companyLogoInput, companyLogoPreview);
    });

    editCompanyLogoInput.addEventListener('change', () => {
        displayImagePreview(editCompanyLogoInput, currentCompanyLogoDiv);
    });

    editJobImagesInput.addEventListener('change', () => {
        displayImagePreview(editJobImagesInput, currentJobImagesDiv);
    });


    // Function to load and display posts from Firestore
    const loadPosts = async () => {
        postsContainer.innerHTML = '<p>Loading posts...</p>'; // Show loading indicator
        try {
            const postsSnapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
            postsContainer.innerHTML = ''; // Clear loading indicator

            if (postsSnapshot.empty) {
                postsContainer.innerHTML = '<p>No posts found.</p>';
                return;
            }

            postsSnapshot.forEach(doc => {
                const post = doc.data();
                const postId = doc.id;

                const postElement = document.createElement('div');
                postElement.classList.add('post-item');
                postElement.innerHTML = `
                    <h4>${post.postTitle} (${post.postCategory})</h4>
                    <p>${post.postContent || 'No general content.'}</p>
                    ${post.companyName ? `<p><strong>Company:</strong> ${post.companyName}</p>` : ''}
                    ${post.jobLocation ? `<p><strong>Location:</strong> ${post.jobLocation}</p>` : ''}
                    ${post.jobType ? `<p><strong>Job Type:</strong> ${post.jobType}</p>` : ''}
                    ${post.jobDescription ? `<p><strong>Job Description:</strong> ${post.jobDescription.substring(0, 100)}...</p>` : ''}
                    ${post.tags && post.tags.length > 0 ? `<p><strong>Tags:</strong> ${post.tags.join(', ')}</p>` : ''}
                    ${post.companyLogoUrl ? `<img src="${post.companyLogoUrl}" alt="Company Logo" style="width: 50px; height: 50px; margin-right: 10px;">` : ''}
                    <p>Published: ${post.postPublished ? 'Yes' : 'No'}</p>
                    <button class="edit-button" data-id="${postId}">Edit</button>
                    <button class="delete-button" onclick="deletePost('${postId}')">Delete</button>
                `;
                postsContainer.appendChild(postElement);
            });

            // Add event listeners to newly created edit buttons
            document.querySelectorAll('.edit-button').forEach(button => {
                button.addEventListener('click', (event) => openEditModal(event.target.dataset.id));
            });

        } catch (error) {
            console.error('Error loading posts:', error);
            postsContainer.innerHTML = '<p>Error loading posts. Please try again.</p>';
            alert('Failed to load posts.');
        }
    };

    // Handle post category selection to show/hide job specific fields
    postCategorySelect.addEventListener('change', () => {
        if (postCategorySelect.value === 'Jobs') {
            jobFieldsDiv.style.display = 'block';
        } else {
            jobFieldsDiv.style.display = 'none';
        }
    });

    // Handle create new post form submission
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = postForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Creating Post...';

        const postData = {
            postCategory: postCategorySelect.value,
            postTitle: document.getElementById('postTitle').value,
            postContent: document.getElementById('postContent').value,
            postPublished: document.getElementById('postPublished').checked,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        let companyLogoUrl = '';
        let jobImageUrls = [];

        try {
            // Upload company logo if provided
            if (companyLogoInput.files && companyLogoInput.files[0]) {
                companyLogoUrl = await uploadFile(companyLogoInput.files[0], 'company_logos/');
                postData.companyLogoUrl = companyLogoUrl;
            }

            // Upload job images if provided
            if (jobImagesInput.files && jobImagesInput.files.length > 0) {
                const uploadPromises = Array.from(jobImagesInput.files).map(file =>
                    uploadFile(file, 'job_images/')
                );
                jobImageUrls = await Promise.all(uploadPromises);
                postData.jobImageUrls = jobImageUrls;
            }

            // Add job-specific fields if category is 'Jobs'
            if (postData.postCategory === 'Jobs') {
                postData.companyName = document.getElementById('companyName').value;
                postData.jobLocation = document.getElementById('jobLocation').value;
                postData.jobType = document.getElementById('jobType').value;
                postData.jobDescription = document.getElementById('jobDescription').value;
                postData.tags = document.getElementById('jobTags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            }

            await db.collection('posts').add(postData);
            alert('Post created successfully!');
            postForm.reset(); // Clear form
            jobFieldsDiv.style.display = 'none'; // Hide job specific fields
            document.getElementById('jobImagePreviews').innerHTML = ''; // Clear previews
            document.getElementById('companyLogoPreview').innerHTML = ''; // Clear previews
            await loadPosts(); // Refresh the posts list

        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post: ' + error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Create Post';
        }
    });

    // Function to open and populate the edit modal
    const openEditModal = async (postId) => {
        try {
            const doc = await db.collection('posts').doc(postId).get();
            if (!doc.exists) {
                alert('Post not found!');
                return;
            }
            const post = doc.data();

            editPostIdInput.value = postId;
            // The category is disabled in HTML, so we just set its value if it exists
            editPostCategorySelect.value = post.postCategory || 'Jobs'; // Default to Jobs if not set
            editPostTitleInput.value = post.postTitle;
            editPostContentTextarea.value = post.postContent || '';
            editPostPublishedCheckbox.checked = post.postPublished;

            // Show/hide job-specific fields in edit modal
            if (post.postCategory === 'Jobs') {
                editJobFieldsDiv.style.display = 'block';
                editCompanyNameInput.value = post.companyName || '';
                editJobLocationInput.value = post.jobLocation || '';
                editJobTypeInput.value = post.jobType || '';
                editJobDescriptionTextarea.value = post.jobDescription || '';
                editJobTagsInput.value = (post.tags && post.tags.length > 0) ? post.tags.join(', ') : '';

                // Display current company logo
                currentCompanyLogoDiv.innerHTML = '';
                if (post.companyLogoUrl) {
                    const img = document.createElement('img');
                    img.src = post.companyLogoUrl;
                    img.style.maxWidth = '100px';
                    img.style.maxHeight = '100px';
                    img.style.marginRight = '10px';
                    img.style.border = '1px solid #ddd';
                    currentCompanyLogoDiv.appendChild(img);
                }

                // Display current job images
                currentJobImagesDiv.innerHTML = '';
                if (post.jobImageUrls && post.jobImageUrls.length > 0) {
                    post.jobImageUrls.forEach(url => {
                        const img = document.createElement('img');
                        img.src = url;
                        img.style.maxWidth = '100px';
                        img.style.maxHeight = '100px';
                        img.style.marginRight = '10px';
                        img.style.border = '1px solid #ddd';
                        currentJobImagesDiv.appendChild(img);
                    });
                }
            } else {
                editJobFieldsDiv.style.display = 'none';
                currentCompanyLogoDiv.innerHTML = '';
                currentJobImagesDiv.innerHTML = '';
            }

            editPostModal.style.display = 'block'; // Show the modal
        } catch (error) {
            console.error('Error opening edit modal:', error);
            alert('Failed to load post for editing: ' + error.message);
        }
    };


    // Handle edit post form submission
    editPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = editPostForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Saving Changes...';

        const postId = editPostIdInput.value;
        const updatedData = {
            postTitle: editPostTitleInput.value,
            postContent: editPostContentTextarea.value,
            postPublished: editPostPublishedCheckbox.checked,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            // Handle new company logo upload
            if (editCompanyLogoInput.files && editCompanyLogoInput.files[0]) {
                const newLogoUrl = await uploadFile(editCompanyLogoInput.files[0], 'company_logos/');
                updatedData.companyLogoUrl = newLogoUrl;
            }

            // Handle new job images upload (append to existing or replace if desired)
            if (editJobImagesInput.files && editJobImagesInput.files.length > 0) {
                const newImageUploadPromises = Array.from(editJobImagesInput.files).map(file =>
                    uploadFile(file, 'job_images/')
                );
                const newImageUrls = await Promise.all(newImageUploadPromises);

                // Fetch current post to get existing images
                const currentPostDoc = await db.collection('posts').doc(postId).get();
                const currentPostData = currentPostDoc.data();
                const existingImageUrls = currentPostData.jobImageUrls || [];

                updatedData.jobImageUrls = [...existingImageUrls, ...newImageUrls]; // Append new images
            }

            // Update job-specific fields if category is 'Jobs'
            if (editPostCategorySelect.value === 'Jobs') {
                updatedData.companyName = editCompanyNameInput.value;
                updatedData.jobLocation = editJobLocationInput.value;
                updatedData.jobType = editJobTypeInput.value;
                updatedData.jobDescription = editJobDescriptionTextarea.value;
                updatedData.tags = editJobTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            } else {
                // Clear job-specific fields if category changed from Jobs
                updatedData.companyName = firebase.firestore.FieldValue.delete();
                updatedData.jobLocation = firebase.firestore.FieldValue.delete();
                updatedData.jobType = firebase.firestore.FieldValue.delete();
                updatedData.jobDescription = firebase.firestore.FieldValue.delete();
                updatedData.tags = firebase.firestore.FieldValue.delete();
                updatedData.companyLogoUrl = firebase.firestore.FieldValue.delete();
                updatedData.jobImageUrls = firebase.firestore.FieldValue.delete();
            }

            await db.collection('posts').doc(postId).update(updatedData);
            alert('Post updated successfully!');
            editPostModal.style.display = 'none'; // Hide the modal
            await loadPosts(); // Refresh the posts list

        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post: ' + error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Save Changes';
        }
    });

    // Close modal event listeners
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


    // Global function for delete (called from onclick in HTML)
    window.deletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
            return;
        }
        try {
            // Optionally, delete images from storage first if necessary
            // e.g., const postToDelete = await db.collection('posts').doc(postId).get();
            // then delete postToDelete.data().companyLogoUrl and .jobImageUrls from storage

            await db.collection('posts').doc(postId).delete();
            alert('Post deleted successfully!');
            await loadPosts(); // Refresh the posts list
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post: ' + error.message);
        }
    };

    // Initial load of posts when the page loads
    await loadPosts();
});