  document.addEventListener("DOMContentLoaded", async () => {
    const listingsEl = document.getElementById("jobListings");
    const locationFilter = document.getElementById("locationFilter");
    const typeFilter = document.getElementById("typeFilter");
    const searchInput = document.getElementById("searchInput");
 
    let allJobs = [
      {
          "title": "Full Stack Developer",
          "company": "RwandaTech Solutions",
          "location": "kigali",
          "type": "full-time",
          "tags": ["Remote", "Tech"],
          "logo": "https://img.freepik.com/premium-vector/hca-logo-hca-letter-hca-letter-logo-design-initials-hca-logo-linked-with-circle-uppercase-monogram-logo-hca-typography-technology-business-real-estate-brand_229120-74037.jpg?w=900",
          "image": "https://img.freepik.com/free-photo/professional-programmer-working-late-dark-office_1098-18705.jpg?t=st=1746213927~exp=1746217527~hmac=69159ec57aaf82c3fb83349a2bcaa561f2f3333b33affe0a797e6a1a1c9c5357&w=1380",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Registered Nurse",
          "company": "King Faisal Hospital",
          "location": "kigali",
          "type": "full-time",
          "tags": ["Healthcare"],
          "logo": "https://img.freepik.com/premium-vector/minimalist-type-creative-business-logo-template_1283348-20187.jpg?w=900",
          "image": "https://img.freepik.com/free-photo/portrait-nurse-scrubs-clinic_23-2149844688.jpg?t=st=1746214165~exp=1746217765~hmac=c5de7fdfa0cc05ae9f2855aad37169f3e9a3b305a32caacb5af68efe066952fa&w=1380",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Secondary School Teacher",
          "company": "Bright Future Academy",
          "location": "huye",
          "type": "full-time",
          "tags": ["Education"],
          "logo": "https://img.freepik.com/premium-vector/maika-modern-ai-powered-customer-service-digital-marketing-solution_944011-4723.jpg?w=900",
          "image": "https://img.freepik.com/free-photo/happy-black-teacher-teaching-elementary-students-math-classroom_637285-9442.jpg?t=st=1746214229~exp=1746217829~hmac=a21fa0c5f204406d01481062c78fe74e534cb4d16255bbb6241ae0c215b70434&w=1380",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "HR Officer",
          "company": "SafeWork HR Ltd",
          "location": "musanze",
          "type": "part-time",
          "tags": ["HR", "Administration"],
          "logo": "https://img.freepik.com/free-vector/luxurious-golden-logo-template_23-2148843539.jpg?t=st=1746214483~exp=1746218083~hmac=e5b99de7384aaa15a1764bf6c5a58298faf1dbec910b6971fa2764c168441ce4&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Civil Engineer",
          "company": "BuildRwanda Contractors",
          "location": "kigali",
          "type": "full-time",
          "tags": ["Engineering", "Construction"],
          "logo": "https://img.freepik.com/free-vector/letter-p-stairs-logo-design_474888-1725.jpg?t=st=1746214628~exp=1746218228~hmac=fd9372ab91e49c8e44d797eba1c0dee1bc2b3f78e3c2ae9fe11c49ab794172de&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Logistics Coordinator",
          "company": "Rwanda Logistics Hub",
          "location": "rubavu",
          "type": "full-time",
          "tags": ["Logistics", "Transport"],
          "logo": "https://img.freepik.com/free-vector/illustration-photo-studio-stamp-banner_53876-3737.jpg?t=st=1746214492~exp=1746218092~hmac=7b75085fa54af7247958fd9de3478b4fa7547094c89ed1f15189e121c48ffbac&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Sales Executive",
          "company": "Vision Motors Rwanda",
          "location": "kigali",
          "type": "full-time",
          "tags": ["Sales", "Automotive"],
          "logo": "https://img.freepik.com/free-vector/gradient-gold-crown-logo-template_23-2150970162.jpg?t=st=1746214670~exp=1746218270~hmac=d28b8b1546a5193882915f09eaf414da71c67e62687386053501ce98b106472f&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Graphic Designer",
          "company": "Creative Hub RW",
          "location": "huye",
          "type": "freelance",
          "tags": ["Design", "Freelance"],
          "logo": "https://img.freepik.com/free-vector/luxury-business-logo-gold-icon_53876-115908.jpg?t=st=1746214657~exp=1746218257~hmac=f5139153d27539c5966379f01b8c2916c649c82130205beb94f83660ae9ed136&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Data Analyst",
          "company": "Insight Data Ltd",
          "location": "kigali",
          "type": "full-time",
          "tags": ["Analytics", "Remote"],
          "logo": "https://img.freepik.com/free-vector/creative-professional-cn-logo-template_23-2149230707.jpg?t=st=1746214838~exp=1746218438~hmac=48f6546708392b666206280e079a3e8ccd77364b7d68033c0bae1083476d1cdf&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Project Coordinator",
          "company": "GreenAid Rwanda",
          "location": "nyanza",
          "type": "part-time",
          "tags": ["NGO", "Consulting"],
          "logo": "https://img.freepik.com/free-vector/creative-barbecue-logo-template_23-2149017951.jpg?t=st=1746214873~exp=1746218473~hmac=15770d781fa77c5ecc663e4439c6742841b0f1da924bc87a55aa6b6781035afa&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
              "title": "Mobile App Developer",
              "company": "Kigali Digital Hub",
              "location": "kigali",
              "type": "full-time",
              "tags": ["Mobile", "Tech"],
              "logo": "https://img.freepik.com/premium-vector/initial-letter-h-logo-design-vector-graphic-alphabet-symbol-corporate-business-identity_565585-683.jpg?w=1380",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Marketing Strategist",
              "company": "SmartReach Agency",
              "location": "nyarugenge",
              "type": "part-time",
              "tags": ["Marketing"],
              "logo": "https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg?t=st=1746216266~exp=1746219866~hmac=b91a7ebb30bc7c6bc2cec46bdacb17ef3545d5918b12c07780c260173a8ff702&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Dental Assistant",
              "company": "SmileCare Dental",
              "location": "bugesera",
              "type": "full-time",
              "tags": ["Healthcare"],
              "logo": "https://img.freepik.com/premium-vector/eh-calligraphic-signature-vector-logo-design-with-circle-gold-color-leaf-flower_1119385-142.jpg?w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Academic Advisor",
              "company": "Campus Link Rwanda",
              "location": "muhanga",
              "type": "full-time",
              "tags": ["Education"],
              "logo": "https://img.freepik.com/free-vector/indonesian-halal-logo-new-branding-2022_17005-1495.jpg?t=st=1746216311~exp=1746219911~hmac=96264f14885a1787c8670241d021d872df95c46605d63769c0f86b18cd05db06&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Office Manager",
              "company": "SecurePay Financial",
              "location": "gasabo",
              "type": "full-time",
              "tags": ["Finance", "Admin"],
              "logo": "https://img.freepik.com/free-vector/flat-design-ac-logo-design_23-2149482027.jpg?t=st=1746216329~exp=1746219929~hmac=4e042343469e186db8e593df81f35e3da46649a05d3d9a3e8f98299d8497523e&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "NGO Advisor",
              "company": "Relief Mission Africa",
              "location": "gicumbi",
              "type": "freelance",
              "tags": ["Consultancy", "NGO"],
              "logo": "https://img.freepik.com/free-psd/gold-logo-mockup-grey-wall_511564-1489.jpg?t=st=1746216134~exp=1746219734~hmac=9c266001626a32750e56c7e8684655d0500885803bc199035426fd4273f43993&w=1800",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Inventory Manager",
              "company": "FastTrack Logistics",
              "location": "rusizi",
              "type": "full-time",
              "tags": ["Warehouse", "Logistics"],
              "logo": "https://img.freepik.com/free-vector/red-logo-black-background_1195-52.jpg?t=st=1746216386~exp=1746219986~hmac=be8261ef1f7595a75f17939d682b530c4e65cc1e3775882878aabae5ca873c51&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Social Media Manager",
              "company": "ClicksUp Marketing",
              "location": "nyaruguru",
              "type": "remote",
              "tags": ["Marketing", "Remote"],
              "logo": "https://img.freepik.com/free-vector/wellness-center-logo-template-gold-professional-design-vector_53876-136292.jpg?t=st=1746216412~exp=1746220012~hmac=d4f215185c80dbc4d14c4a625d21a19e93a731b88eb95cad095200a3e244e918&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Photographer",
              "company": "Golden Frame Studio",
              "location": "karongi",
              "type": "contract",
              "tags": ["Creative", "Media"],
              "logo": "https://img.freepik.com/free-vector/premium-collection-badge-design_53876-63011.jpg?t=st=1746216431~exp=1746220031~hmac=592d1799c13bf323eaa3e0ab9cb97a02a230f0865b3068dee8c0bbe08521edfb&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Cybersecurity Analyst",
              "company": "SafeNet Rwanda",
              "location": "kigali",
              "type": "full-time",
              "tags": ["Tech", "Security"],
              "logo": "https://img.freepik.com/free-vector/colorful-letter-o-gradient-logo-design_474888-2306.jpg?t=st=1746216456~exp=1746220056~hmac=29a1650c6722f0d99a314baed957dfce93419346ee08ed4dd85b3dc5892973a5&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            }
          
      ];
    
    
    async function fetchJobs() {
        listingsEl.innerHTML = '<p>Loading jobs...</p>';
        try {
            const response = await fetch('/api/public-posts?category=Jobs');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data && Array.isArray(data.posts)) {
                allJobs = data.posts;
            } else {
                allJobs = data; 
            }
            
            console.log("Fetched jobs:", allJobs);
        } catch (error) {
            console.error("Error fetching jobs:", error);
            listingsEl.innerHTML = '<p>Failed to load jobs. Please try again later.</p>'; 
            allJobs = []; 
        }
    }
    const jobs = [
        {
          "title": "Full Stack Developer",
          "company": "RwandaTech Solutions",
          "location": "kigali",
          "type": "full-time",
          "tags": ["Remote", "Tech"],
          "logo": "https://img.freepik.com/premium-vector/hca-logo-hca-letter-hca-letter-logo-design-initials-hca-logo-linked-with-circle-uppercase-monogram-logo-hca-typography-technology-business-real-estate-brand_229120-74037.jpg?w=900",
          "image": "https://img.freepik.com/free-photo/professional-programmer-working-late-dark-office_1098-18705.jpg?t=st=1746213927~exp=1746217527~hmac=69159ec57aaf82c3fb83349a2bcaa561f2f3333b33affe0a797e6a1a1c9c5357&w=1380",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Registered Nurse",
          "company": "King Faisal Hospital",
          "location": "kigali",
          "type": "full-time",
          "tags": ["Healthcare"],
          "logo": "https://img.freepik.com/premium-vector/minimalist-type-creative-business-logo-template_1283348-20187.jpg?w=900",
          "image": "https://img.freepik.com/free-photo/portrait-nurse-scrubs-clinic_23-2149844688.jpg?t=st=1746214165~exp=1746217765~hmac=c5de7fdfa0cc05ae9f2855aad37169f3e9a3b305a32caacb5af68efe066952fa&w=1380",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Secondary School Teacher",
          "company": "Bright Future Academy",
          "location": "huye",
          "type": "full-time",
          "tags": ["Education"],
          "logo": "https://img.freepik.com/premium-vector/maika-modern-ai-powered-customer-service-digital-marketing-solution_944011-4723.jpg?w=900",
          "image": "https://img.freepik.com/free-photo/happy-black-teacher-teaching-elementary-students-math-classroom_637285-9442.jpg?t=st=1746214229~exp=1746217829~hmac=a21fa0c5f204406d01481062c78fe74e534cb4d16255bbb6241ae0c215b70434&w=1380",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "HR Officer",
          "company": "SafeWork HR Ltd",
          "location": "musanze",
          "type": "part-time",
          "tags": ["HR", "Administration"],
          "logo": "https://img.freepik.com/free-vector/luxurious-golden-logo-template_23-2148843539.jpg?t=st=1746214483~exp=1746218083~hmac=e5b99de7384aaa15a1764bf6c5a58298faf1dbec910b6971fa2764c168441ce4&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Civil Engineer",
          "company": "BuildRwanda Contractors",
          "location": "kigali",
          "type": "full-time",
          "tags": ["Engineering", "Construction"],
          "logo": "https://img.freepik.com/free-vector/letter-p-stairs-logo-design_474888-1725.jpg?t=st=1746214628~exp=1746218228~hmac=fd9372ab91e49c8e44d797eba1c0dee1bc2b3f78e3c2ae9fe11c49ab794172de&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Logistics Coordinator",
          "company": "Rwanda Logistics Hub",
          "location": "rubavu",
          "type": "full-time",
          "tags": ["Logistics", "Transport"],
          "logo": "https://img.freepik.com/free-vector/illustration-photo-studio-stamp-banner_53876-3737.jpg?t=st=1746214492~exp=1746218092~hmac=7b75085fa54af7247958fd9de3478b4fa7547094c89ed1f15189e121c48ffbac&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Sales Executive",
          "company": "Vision Motors Rwanda",
          "location": "kigali",
          "type": "full-time",
          "tags": ["Sales", "Automotive"],
          "logo": "https://img.freepik.com/free-vector/gradient-gold-crown-logo-template_23-2150970162.jpg?t=st=1746214670~exp=1746218270~hmac=d28b8b1546a5193882915f09eaf414da71c67e62687386053501ce98b106472f&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Graphic Designer",
          "company": "Creative Hub RW",
          "location": "huye",
          "type": "freelance",
          "tags": ["Design", "Freelance"],
          "logo": "https://img.freepik.com/free-vector/luxury-business-logo-gold-icon_53876-115908.jpg?t=st=1746214657~exp=1746218257~hmac=f5139153d27539c5966379f01b8c2916c649c82130205beb94f83660ae9ed136&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Data Analyst",
          "company": "Insight Data Ltd",
          "location": "kigali",
          "type": "full-time",
          "tags": ["Analytics", "Remote"],
          "logo": "https://img.freepik.com/free-vector/creative-professional-cn-logo-template_23-2149230707.jpg?t=st=1746214838~exp=1746218438~hmac=48f6546708392b666206280e079a3e8ccd77364b7d68033c0bae1083476d1cdf&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
          "title": "Project Coordinator",
          "company": "GreenAid Rwanda",
          "location": "nyanza",
          "type": "part-time",
          "tags": ["NGO", "Consulting"],
          "logo": "https://img.freepik.com/free-vector/creative-barbecue-logo-template_23-2149017951.jpg?t=st=1746214873~exp=1746218473~hmac=15770d781fa77c5ecc663e4439c6742841b0f1da924bc87a55aa6b6781035afa&w=900",
          "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
          "description": "Build responsive interfaces with modern JavaScript frameworks."
        },
        {
              "title": "Mobile App Developer",
              "company": "Kigali Digital Hub",
              "location": "kigali",
              "type": "full-time",
              "tags": ["Mobile", "Tech"],
              "logo": "https://img.freepik.com/premium-vector/initial-letter-h-logo-design-vector-graphic-alphabet-symbol-corporate-business-identity_565585-683.jpg?w=1380",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Marketing Strategist",
              "company": "SmartReach Agency",
              "location": "nyarugenge",
              "type": "part-time",
              "tags": ["Marketing"],
              "logo": "https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg?t=st=1746216266~exp=1746219866~hmac=b91a7ebb30bc7c6bc2cec46bdacb17ef3545d5918b12c07780c260173a8ff702&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Dental Assistant",
              "company": "SmileCare Dental",
              "location": "bugesera",
              "type": "full-time",
              "tags": ["Healthcare"],
              "logo": "https://img.freepik.com/premium-vector/eh-calligraphic-signature-vector-logo-design-with-circle-gold-color-leaf-flower_1119385-142.jpg?w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Academic Advisor",
              "company": "Campus Link Rwanda",
              "location": "muhanga",
              "type": "full-time",
              "tags": ["Education"],
              "logo": "https://img.freepik.com/free-vector/indonesian-halal-logo-new-branding-2022_17005-1495.jpg?t=st=1746216311~exp=1746219911~hmac=96264f14885a1787c8670241d021d872df95c46605d63769c0f86b18cd05db06&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Office Manager",
              "company": "SecurePay Financial",
              "location": "gasabo",
              "type": "full-time",
              "tags": ["Finance", "Admin"],
              "logo": "https://img.freepik.com/free-vector/flat-design-ac-logo-design_23-2149482027.jpg?t=st=1746216329~exp=1746219929~hmac=4e042343469e186db8e593df81f35e3da46649a05d3d9a3e8f98299d8497523e&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "NGO Advisor",
              "company": "Relief Mission Africa",
              "location": "gicumbi",
              "type": "freelance",
              "tags": ["Consultancy", "NGO"],
              "logo": "https://img.freepik.com/free-psd/gold-logo-mockup-grey-wall_511564-1489.jpg?t=st=1746216134~exp=1746219734~hmac=9c266001626a32750e56c7e8684655d0500885803bc199035426fd4273f43993&w=1800",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Inventory Manager",
              "company": "FastTrack Logistics",
              "location": "rusizi",
              "type": "full-time",
              "tags": ["Warehouse", "Logistics"],
              "logo": "https://img.freepik.com/free-vector/red-logo-black-background_1195-52.jpg?t=st=1746216386~exp=1746219986~hmac=be8261ef1f7595a75f17939d682b530c4e65cc1e3775882878aabae5ca873c51&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Social Media Manager",
              "company": "ClicksUp Marketing",
              "location": "nyaruguru",
              "type": "remote",
              "tags": ["Marketing", "Remote"],
              "logo": "https://img.freepik.com/free-vector/wellness-center-logo-template-gold-professional-design-vector_53876-136292.jpg?t=st=1746216412~exp=1746220012~hmac=d4f215185c80dbc4d14c4a625d21a19e93a731b88eb95cad095200a3e244e918&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Photographer",
              "company": "Golden Frame Studio",
              "location": "karongi",
              "type": "contract",
              "tags": ["Creative", "Media"],
              "logo": "https://img.freepik.com/free-vector/premium-collection-badge-design_53876-63011.jpg?t=st=1746216431~exp=1746220031~hmac=592d1799c13bf323eaa3e0ab9cb97a02a230f0865b3068dee8c0bbe08521edfb&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            },
            {
              "title": "Cybersecurity Analyst",
              "company": "SafeNet Rwanda",
              "location": "kigali",
              "type": "full-time",
              "tags": ["Tech", "Security"],
              "logo": "https://img.freepik.com/free-vector/colorful-letter-o-gradient-logo-design_474888-2306.jpg?t=st=1746216456~exp=1746220056~hmac=29a1650c6722f0d99a314baed957dfce93419346ee08ed4dd85b3dc5892973a5&w=900",
              "image": "https://img.freepik.com/free-photo/light-bulb-with-drawing-graph_1232-2105.jpg?t=st=1746216649~exp=1746220249~hmac=884469b43b4f9898a4f3b2f2a0d35c1072fc61f264ce173206847d6285d5d941&w=996",
              "description": "Build responsive interfaces with modern JavaScript frameworks."
            }
          
      ];

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

      const filtered = jobs.filter(job => {
        return (
          (!loc || job.location === loc) &&
          (!type || job.type === type) &&
          (!keyword || job.title.toLowerCase().includes(keyword))
        );
      });

      showSkeletons();

      setTimeout(() => {
        renderJobs(filtered);
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