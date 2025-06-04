  document.addEventListener("DOMContentLoaded", async () => {
    const listingsEl = document.getElementById("jobListings");
    const locationFilter = document.getElementById("locationFilter");
    const typeFilter = document.getElementById("typeFilter");
    const searchInput = document.getElementById("searchInput");
 
    let allJobs = [];
    let displayedJobsCount = 0;
    const jobsPerPage = 10;
    
    async function fetchJobs() {
        listingsEl.innerHTML = '<p>Loading jobs...</p>'; 
        loadMoreBtn.style.display = 'none';
        try {
          
            const response = await fetch('/api/public-posts?category=Jobs');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const responseData = await response.json();
            if (responseData && Array.isArray(responseData.posts)) {
                allJobs = responseData.posts;
            } else if (Array.isArray(responseData)) {

                allJobs = responseData;
            } else {
                 console.warn("API response format unexpected:", responseData);
                 allJobs = [];
            }

            console.log("Fetched jobs:", allJobs);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            listingsEl.innerHTML = '<p>Failed to load jobs. Please try again later.</p>';
            allJobs = [];
        }
    }

    function showSkeletons() {
      listingsEl.innerHTML = "";
      for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement("div");
        skeleton.classList.add("listing-item", "skeleton");
        listingsEl.appendChild(skeleton);
      }
    }
   //RENDER
   function renderJobs(filteredJobs) {
    listingsEl.innerHTML = "";
    if (filteredJobs.length === 0) {
      listingsEl.innerHTML = "<p>No jobs found.</p>";
      return;
    }
  
    filteredJobs.forEach(job => {
      const card = document.createElement("div");
      card.className = "listing-item";
      card.innerHTML = `
        <div class="job-card-content" style="display:flex; align-items:center; gap:1rem;">
          <img src="${job.logo || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'}" alt="${job.company}" class="job-logo">
          <div>
            <h3>${job.title}</h3>
            <div class="company">${job.company}</div>
            <div class="location">${capitalize(job.location)}, Rwanda</div>
            <div class="tags">
              <span class="tag">${job.type}</span>
              ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
            </div>
          </div>
        </div>
      `;

      card.addEventListener("click", () => openJobPopup(job));
      listingsEl.appendChild(card);
    });
  }

  await fetchJobs();
  applyFiltersAndSearch();
  
 // modals
 window.openJobPopup = function (job) {
    document.getElementById('popup-title').innerText = job.title;
    document.getElementById('popup-company').innerText = `${job.company} - ${capitalize(job.location)}`;
    document.getElementById('popup-type').innerText = job.type;
    document.getElementById('popup-desc').innerText = job.description;
    document.getElementById('popup-image').src = job.image || "img/default-job.jpg";
  
    document.getElementById('job-popup').classList.remove('hidden');
    document.body.style.overflow = "hidden";
  };
  
  window.closeJobPopup = function () {
    document.getElementById('job-popup').classList.add('hidden');
    document.body.style.overflow = "";
  };
  
  window.openJobPopup = function (job) {
  document.getElementById('popup-title').innerText = job.title;
  document.getElementById('popup-company').innerText = `${job.company} - ${capitalize(job.location)}`;
  document.getElementById('popup-type').innerText = job.type;
  document.getElementById('popup-desc').innerText = job.description || "No description provided.";
  document.getElementById('popup-image').src = job.image || "img/default-job.jpg";
  document.getElementById('job-popup').classList.remove('hidden');
  document.body.style.overflow = "hidden";
};

window.closeJobPopup = function () {
  document.getElementById('job-popup').classList.add('hidden');
  document.body.style.overflow = "";
};



    // Capitalize
    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Filter logic
    function filterJobs() {
        const loc = locationFilter.value.toLowerCase();
        const type = typeFilter.value.toLowerCase();
        const keyword = searchInput.value.toLowerCase();

        let filtered = allJobs.filter(job => {
            const jobLocation = job.location ? job.location.toLowerCase() : '';
            const jobType = job.type ? job.type.toLowerCase() : '';
            const jobTitle = job.title ? job.title.toLowerCase() : '';

            return (
                (!loc || jobLocation.includes(loc)) &&
                (!type || jobType === type) &&
                (!keyword || jobTitle.includes(keyword))
            );
        });

        displayedJobsCount = 0;
        showSkeletons(); 
        setTimeout(() => {
            renderJobs(filtered.slice(0, jobsPerPage));
            displayedJobsCount = jobsPerPage;
            window.currentFilteredJobs = filtered;
        }, 800);
    }


    // Initial load
    showSkeletons();
    setTimeout(() => renderJobs(jobs), 3000);

    locationFilter.addEventListener("change", filterJobs);
    typeFilter.addEventListener("change", filterJobs);
    searchInput.addEventListener("input", filterJobs);
  });

//load
const allJobs = [
    {
      "title": "Full Stack Developer",
      "company": "RwandaTech Solutions",
      "location": "kigali",
      "type": "full-time",
      "tags": ["Remote", "Tech"],
      "logo": "img/codebase-logo.png",
      "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
      "description": "Build responsive interfaces with modern JavaScript frameworks."
    },
    {
      "title": "Registered Nurse",
      "company": "King Faisal Hospital",
      "location": "kigali",
      "type": "full-time",
      "tags": ["Healthcare"],
      "logo": "img/codebase-logo.png",
      "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
      "description": "Build responsive interfaces with modern JavaScript frameworks."
    },
    {
      "title": "Academic Advisor",
      "company": "Campus Link Rwanda",
      "location": "muhanga",
      "type": "full-time",
      "tags": ["Education"],
      "logo": "img/codebase-logo.png",
      "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
      "description": "Build responsive interfaces with modern JavaScript frameworks."
    },
    {
      "title": "Civil Engineer",
      "company": "BuildRwanda Contractors",
      "location": "kigali",
      "type": "full-time",
      "tags": ["Engineering", "Construction"],
      "logo": "img/codebase-logo.png",
      "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
      "description": "Build responsive interfaces with modern JavaScript frameworks."
    },
    {
      "title": "HR Officer",
      "company": "SafeWork HR Ltd",
      "location": "musanze",
      "type": "part-time",
      "tags": ["HR", "Administration"],
      "logo": "img/codebase-logo.png",
      "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
      "description": "Build responsive interfaces with modern JavaScript frameworks."
    },
    {
      "title": "Inventory Manager",
      "company": "FastTrack Logistics",
      "location": "rusizi",
      "type": "full-time",
      "tags": ["Warehouse", "Logistics"],
      "logo": "img/codebase-logo.png",
      "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
      "description": "Build responsive interfaces with modern JavaScript frameworks."
    },
    {
      "title": "Sales Executive",
      "company": "Vision Motors Rwanda",
      "location": "kigali",
      "type": "full-time",
      "tags": ["Sales", "Automotive"],
      "logo": "img/codebase-logo.png",
      "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
      "description": "Build responsive interfaces with modern JavaScript frameworks."
    },
    {
      "title": "Photographer",
      "company": "Golden Frame Studio",
      "location": "karongi",
      "type": "contract",
      "tags": ["Creative", "Media"],
      "logo": "img/codebase-logo.png",
      "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
      "description": "Build responsive interfaces with modern JavaScript frameworks."
    },
    {
      "title": "Project Coordinator",
      "company": "GreenAid Rwanda",
      "location": "nyanza",
      "type": "part-time",
      "tags": ["NGO", "Consulting"],
      "logo": "img/codebase-logo.png",
      "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
      "description": "Build responsive interfaces with modern JavaScript frameworks."
    },
    {
      "title": "Cybersecurity Analyst",
      "company": "SafeNet Rwanda",
      "location": "kigali",
      "type": "full-time",
      "tags": ["Tech", "Security"],
      "logo": "img/codebase-logo.png",
      "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
      "description": "Build responsive interfaces with modern JavaScript frameworks."
    }
  ];

  const jobsPerPage = 3;
  let currentIndex = 0;

  function showSkeletons() {
    const skeletons = document.getElementById("skeletons");
    skeletons.innerHTML = "";
    for (let i = 0; i < jobsPerPage; i++) {
      const div = document.createElement("div");
      div.classList.add("skeleton");
      skeletons.appendChild(div);
    }
  }

  function loadJobs() {
    showSkeletons();

    setTimeout(() => {
      document.getElementById("skeletons").innerHTML = "";
      const jobContainer = document.getElementById("job-container");

      const nextJobs = allJobs.slice(currentIndex, currentIndex + jobsPerPage);
      nextJobs.forEach((job) => {
        const div = document.createElement("div");
        div.className = "job-card";
        div.innerHTML = `
          <h3>${job.title}</h3>
          <p><strong>${job.company}</strong> - ${job.location}</p>
          <p><em>${job.type}</em> | Tags: ${job.tags.join(", ")}</p>
        `;
        jobContainer.appendChild(div);
      });

      currentIndex += jobsPerPage;

      if (currentIndex >= allJobs.length) {
        document.getElementById("loadMoreBtn").style.display = "none";
      }
    }, 1000);
  }

  document.getElementById("loadMoreBtn").addEventListener("click", loadJobs);

  // Initial load
  loadJobs();

  const newsletterForm = document.querySelector('.newsletter form');
  newsletterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing with ${email}!`);
    this.reset();
  });