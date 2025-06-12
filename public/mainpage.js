// DOM Elements
const postBtn = document.querySelector(".post-btn");
const modalWrapper = document.querySelector(".modal-wrapper");
const modal = document.querySelector(".modal");
const postModalX = document.querySelector(".modal-header i");
const modalPostBtn = document.querySelector(".modal-header button");
const modalFooterPlus = document.querySelector(".modal-footer span");
const modalInput = document.querySelector(".modal-input");
const user = document.querySelector(".user");
const sidebar = document.querySelector(".sidebar");
const sidebarWrapper = document.querySelector(".sidebar-wrapper");
const xBtn = document.querySelector(".sidebar-header i");
const toggle = document.querySelector(".toggle");
const circle = document.querySelector(".circle");


document.addEventListener('DOMContentLoaded', function() {
  const postInput = document.querySelector('.post-input');
  const postButton = document.querySelector('.post-submit-btn');
  const imageUploadBtn = document.getElementById('image-upload-btn');
  const imageUpload = document.getElementById('image-upload');
  const imagePreview = document.getElementById('image-preview');
  const imagePreviewContainer = document.getElementById('image-preview-container');
  const postsContainer = document.getElementById('posts-container');

  // Load posts from localStorage when page loads
  loadPosts();

  function loadPosts() {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      postsContainer.innerHTML = savedPosts;
    }
  }

  function savePosts() {
    localStorage.setItem('posts', postsContainer.innerHTML);
  }

  // Enable/disable post button based on input
  function updatePostButtonState() {
    const hasText = postInput.value.trim() !== '';
    const hasImage = imagePreview.src && imagePreview.src.length > 0;
    postButton.disabled = !(hasText || hasImage);
  }

  postInput.addEventListener('input', updatePostButtonState);

  // Handle image upload click
  imageUploadBtn.addEventListener('click', function() {
    imageUpload.click();
  });

  // Handle image selection
  imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        imagePreview.src = event.target.result;
        imagePreviewContainer.style.display = 'block';
        updatePostButtonState();
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle post submission
  postButton.addEventListener('click', function() {
    const text = postInput.value.trim();
    const hasImage = imagePreview.src && imagePreview.src.length > 0;
    
    if (text || hasImage) {
      const newPost = document.createElement('div');
      newPost.className = 'post border';
      
      let postContentHTML = `
        <div class="user-avatar">
          <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="profile" />
        </div>
        <div class="post-content">
          <div class="post-user-info light-text">
            <h4>You</h4>
            <i class="fas fa-check-circle"></i>
            <span>@you · Just now</span>
          </div>`;
      
      if (text) {
        postContentHTML += `<p class="post-text light-text">${text}</p>`;
      }
      
      if (hasImage) {
        postContentHTML += `
          <div class="post-img">
            <img src="${imagePreview.src}" />
          </div>`;
      }
      
      postContentHTML += `
          <div class="post-icons">
            <i class="far fa-comment"></i>
            <i class="fas fa-retweet"></i>
            <i class="far fa-heart"></i>
            <i class="fas fa-share-alt"></i>
          </div>
        </div>`;
      
      newPost.innerHTML = postContentHTML;
      
      // Add new post at the top
      postsContainer.insertBefore(newPost, postsContainer.firstChild);
      
      // Save to localStorage
      savePosts();
      
      // Reset form completely
      resetForm();
    }
  });

  function resetForm() {
    postInput.value = '';
    imagePreview.src = '';
    imagePreviewContainer.style.display = 'none';
    postButton.disabled = true;
    imageUpload.value = ''; // This is crucial to clear the file input
  }
});

// News feed page
// Post modal
postBtn.addEventListener("click", () => {
  modal.style.display = "block";
  modalWrapper.classList.add("modal-wrapper-display");
});

const changeOpacity = (x) => {
  modalPostBtn.style.opacity = x;
  modalFooterPlus.style.opacity = x;
};

postModalX.addEventListener("click", () => {
  modal.style.display = "none";
  modalWrapper.classList.remove("modal-wrapper-display");
  if (modalInput.value !== "") {
    modalInput.value = "";
    changeOpacity(0.5);
  }
});

modalInput.addEventListener("keypress", (e) => {
  if (e.target.value !== "") {
    changeOpacity(1);
  }
});

modalInput.addEventListener("blur", (e) => {
  if (e.target.value === "") {
    changeOpacity(0.5);
  }
});

// Sidebar
user.addEventListener("click", () => {
  sidebar.classList.add("sidebar-display");
  sidebarWrapper.classList.add("sidebar-wrapper-display");
});

xBtn.addEventListener("click", () => {
  sidebar.classList.remove("sidebar-display");
  sidebarWrapper.classList.remove("sidebar-wrapper-display");
});

const darkElements1 = document.querySelectorAll(".dark-mode-1");
const darkElements2 = document.querySelectorAll(".dark-mode-2");
const lightText = document.querySelectorAll(".light-text");
const borders = document.querySelectorAll(".border");

toggle.addEventListener("click", () => {
  circle.classList.toggle("move");
  Array.from(darkElements1).map((darkEl1) => {
    darkEl1.classList.toggle("dark-1");
  });
  Array.from(darkElements2).map((darkEl2) => {
    darkEl2.classList.toggle("dark-2");
  });
  Array.from(lightText).map((lText) => {
    lText.classList.toggle("light");
  });
  Array.from(borders).map((border) => {
    border.classList.toggle("border-color");
  });
});

  const bellIcon = document.querySelector(".bx-bell");
  const notificationBox = document.getElementById("notificationBox");

  bellIcon.addEventListener("click", () => {
    notificationBox.classList.toggle("show");
    notificationBox.classList.remove("hidden");
  });

  function closePopup() {
    notificationBox.classList.remove("show");

    setTimeout(() => {
      notificationBox.classList.add("hidden");
    }, 300);
  }