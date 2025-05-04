const tenders = [
    {
      title: "Construction of Bridge",
      desc: "Tender for the construction of a bridge over the XYZ river.",
      image: "https://img.freepik.com/free-photo/bridge-construction-site_23-2151933402.jpg?t=st=1746279255~exp=1746282855~hmac=1351ac98fb4be13b899f5dcf67815529b39ced7e30faeb4a95dd57d115e6f308&w=1380",
      logo: "https://img.freepik.com/free-photo/abstract-colorful-3d-shape-graphics-as-label-template-generative-ai_191095-927.jpg?t=st=1746281167~exp=1746284767~hmac=abe9780417f5ad744f66ece60c2bc5b86f1788ac5d1334dc2de328245db60d31&w=1380",
      company: "ABC Constructions Ltd",
      value: 500000,
      deadline: new Date().getTime() + 86400000
    },
    {
      title: "IT Equipment Supply",
      desc: "Tender for supplying IT equipment to local government offices.",
      image: "https://img.freepik.com/premium-photo/top-view-laptop-medical-equipment_1026950-98968.jpg?w=1380",
      logo: "https://img.freepik.com/free-vector/deer-simple-mascot-logo-design-illustration_343694-3516.jpg?t=st=1746281307~exp=1746284907~hmac=056cc60af078178988af39c3e854375b09d5e5bf9daf62668958b36d3d563ec9&w=900",
      company: "TechnoWare Inc.",
      value: 200000,
      deadline: new Date().getTime() + 172800000
    },
    {
      title: "Road Maintenance",
      desc: "Tender for road repair and maintenance services.",
      image: "https://img.freepik.com/free-photo/view-modern-construction-site_23-2151317314.jpg?t=st=1746279388~exp=1746282988~hmac=f44ca5c56318171a636e1ff28b06b191ffbbc2d8ec43a1c39a84638de82f30b8&w=1380",
      logo: "https://img.freepik.com/free-vector/heron-simple-mascot-logo-design-illustration_343694-3638.jpg?t=st=1746281330~exp=1746284930~hmac=a0a751c4c6497f94e9def36f24997aa8eec91c4da1863e2e40512e1939198b57&w=900",
      company: "Rwanda Road Works",
      value: 75000,
      deadline: new Date().getTime() + 259200000
    },
    {
      title: "Supply of Medical Kits",
      desc: "Tender for the supply of medical kits to healthcare facilities.",
      image: "https://img.freepik.com/premium-photo/delivery-medicines-from-pharmacy-cardboard-boxes-with-medicines-sprays-pills_1375396-5084.jpg?w=1800",
      logo: "https://img.freepik.com/premium-photo/high-quality-stock-image_783884-155520.jpg?w=900",
      company: "MedPro Supply Co.",
      value: 100000,
      deadline: new Date().getTime() + 345600000
    },
    {
      title: "Solar Energy Installation",
      desc: "Installation of solar panels for public schools and clinics.",
      image: "https://img.freepik.com/free-photo/solar-panel-installation-by-roofer_23-2151972752.jpg?t=st=1746279478~exp=1746283078~hmac=86f8b6cff4d112383e91ebd8241c1c0e4f2fa6bbf6aa13e0e24578a0bdc2f3ef&w=740",
      logo: "https://img.freepik.com/premium-photo/r-letter-logo-design-with-elegant-plain-background_1375060-4972.jpg?w=900",
      company: "SunPower Africa",
      value: 180000,
      deadline: new Date().getTime() + 432000000
    },
    {
      title: "Agricultural Equipment Supply",
      desc: "Supply of farming tools and equipment to cooperative farmers.",
      image: "https://img.freepik.com/premium-photo/openr-exhibition-modern-wheeled-agricultural-machinery-new-tractors-combines-with-plow-mower_926199-4415763.jpg?w=740",
      logo: "https://img.freepik.com/premium-photo/gold-logo-with-black-background-that-says-logo_1199903-59384.jpg?w=1380",
      company: "GreenAgro Co-op",
      value: 95000,
      deadline: new Date().getTime() + 518400000
    },
    {
      title: "Office Renovation",
      desc: "Renovation and remodeling of district office buildings.",
      image: "https://img.freepik.com/premium-photo/installing-drywall-renovation_810293-207006.jpg?w=1800",
      logo: "https://img.freepik.com/premium-photo/rss-logo-design_934432-18873.jpg?w=1380",
      company: "RenovateX Group",
      value: 120000,
      deadline: new Date().getTime() + 604800000
    },
    {
      title: "Provision of Security Services",
      desc: "Hiring licensed security firms for municipal buildings.",
      image: "https://img.freepik.com/free-photo/portrait-male-security-guard-with-uniform_23-2150368732.jpg?t=st=1746279743~exp=1746283343~hmac=bfcc5ddb49502c0b4b3c66ebaf958ddf240a6739d7db6681f048dd7aa358433c&w=1380",
      logo: "https://img.freepik.com/free-psd/logo-mockup-iron-wall_511564-1492.jpg?t=st=1746279596~exp=1746283196~hmac=b481a7be6eb7f60b3489469af04852c7ed20eedc86d7a26493594762645f0d88&w=1800",
      company: "SecureZone Ltd",
      value: 70000,
      deadline: new Date().getTime() + 691200000
    }
  ];
  
  const tenderGrid = document.getElementById("tenderListings");
  const tenderPopup = document.getElementById("tenderPopup");
  
  function updateDeadline(endTime, el) {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      if (distance < 0) {
        clearInterval(interval);
        el.textContent = "Expired";
        return;
      }
      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      el.textContent = `${d}d ${h}h ${m}m`;
    }, 1000);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const tenderContainer = document.getElementById('tenderListings');
    const skeletonContainer = document.getElementById('tenderSkeletons');
    skeletonContainer.style.display = 'grid';
    tenderContainer.style.display = 'none';
  
    setTimeout(() => {
      skeletonContainer.style.display = 'none';
      tenderContainer.style.display = 'grid';
  
      tenders.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'tender-card';
        card.innerHTML = `
          <div class="tender-img" style="background-image: url('${item.image}')"></div>
          <div class="tender-header">
            <img src="${item.logo}" alt="${item.company}" class="company-logo"/>
            <span class="company-name">${item.company}</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <div class="tender-details">
            <span><strong>Estimated Value:</strong> $${item.value.toLocaleString()}</span>
            <span class="deadline" data-endtime="${item.deadline}">Loading...</span>
          </div>
          <button class="cta-btn" onclick="showTenderPopup(${index})">View Details</button>
        `;
        tenderContainer.appendChild(card);
      });
  
      document.querySelectorAll('.deadline').forEach(el => {
        const endTime = el.dataset.endtime;
        updateDeadline(Number(endTime), el);
      });
    }, 1500);
  });
  
  function showTenderPopup(index) {
    const t = tenders[index];
    document.getElementById("popupImage").style.backgroundImage = `url('${t.image}')`;
    document.getElementById("popupTitle").textContent = t.title;
    document.getElementById("popupDesc").textContent = t.desc;
    document.getElementById("popupValue").textContent = `$${t.value.toLocaleString()}`;
    document.getElementById("popupCompany").textContent = t.company;
    document.getElementById("popupLogo").src = t.logo;
    updateDeadline(t.deadline, document.getElementById("popupDeadline"));
    tenderPopup.classList.remove("hidden");
  }
  
  function closeTenderPopup() {
    tenderPopup.classList.add("hidden");
  }
  
  window.onclick = function(event) {
    if (event.target == tenderPopup) {
      tenderPopup.classList.add("hidden");
    }
  };
  
  const newsletterForm = document.querySelector('.newsletter form');
  newsletterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    alert(`Thank you for subscribing with ${email}!`);
    this.reset();
  });