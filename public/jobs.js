document.addEventListener("DOMContentLoaded", async () => {
  const listingsEl = document.getElementById("job-container");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const skeletonsEl = document.getElementById("skeletons");

  let allJobs = [];
  let displayedJobsCount = 0;
  const jobsPerPage = 3;

  // Load jobs from MongoDB
  async function fetchJobs() {
    try {
      showSkeletons();
      const response = await fetch('/api/get-posts?target=jobs');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      allJobs = await response.json();
      renderJobs();
    } catch (error) {
      console.error("Error loading jobs:", error);
      listingsEl.innerHTML = '<p style="color:red;">Failed to load jobs. Please try again later.</p>';
    }
  }

  // Show loading skeletons
  function showSkeletons() {
    skeletonsEl.innerHTML = "";
    for (let i = 0; i < jobsPerPage; i++) {
      const div = document.createElement("div");
      div.className = "skeleton";
      skeletonsEl.appendChild(div);
    }
  }

  // Render jobs
  function renderJobs() {
    skeletonsEl.innerHTML = "";
    const jobsToShow = allJobs.slice(displayedJobsCount, displayedJobsCount + jobsPerPage);

    // In renderJobs()
    jobsToShow.forEach(job => {
      const div = document.createElement("div");
      div.className = "job-card";
      div.innerHTML = `
    <h3>${job.title}</h3>
    <p><strong>${job.companyName || 'N/A'}</strong> - ${capitalize(job.jobLocation || 'Rwanda')}</p>
    <p><em>${job.jobType || 'Type N/A'}</em> | Tags: ${job.jobTags ? job.jobTags.join(', ') : ''}</p>
    ${job.imageData && job.imageType ? `<img src="data:${job.imageType};base64,${job.imageData}" alt="Job Image" class="job-img">` : ''}
    <p>${job.body || ''}</p>
  `;
      listingsEl.appendChild(div);
    });


    displayedJobsCount += jobsToShow.length;
    if (displayedJobsCount >= allJobs.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }
  }

  // Capitalize utility
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Button to load more jobs
  loadMoreBtn.addEventListener("click", renderJobs);

  // Initial load
  fetchJobs();
});
