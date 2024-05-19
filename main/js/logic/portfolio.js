// Поведение карточек
const container = document.querySelector('.container');
const preload = document.querySelector('.preloadbg');
const projectCards = [];
let loadedImages = 0;
        
function loadImage(url, callback) {
  const img = new Image();
  img.onload = function () {
    loadedImages++;
    callback();
  };
  img.src = url;
}
        
function checkLoad(projects) {
  loadedImages++;
  if (loadedImages === projects.length * 2) {
    setTimeout(function() {
      var preloadDiv = document.querySelector('.preload');
      var preloadIconDiv = document.querySelector('.preload-icon');
      if (preloadIconDiv) {
          preloadIconDiv.style.opacity = '0';
          preloadIconDiv.style.visibility = 'hidden';
      }
      var preloadSquares = document.querySelectorAll('.preload-bg li');
      preloadSquares.forEach(function(square) {
          var randomDelay = Math.random() * 1000;
          setTimeout(function() {
              square.style.opacity = '0';
              square.style.visibility = 'hidden';
          }, randomDelay);
      });

      setTimeout(function() {
          preloadDiv.style.display = 'none';
      }, 1500);
    }, 500);
    projectCards.forEach(card => card.style.display = 'block');
  }
}
        
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', handleMouseLeave);
  card.addEventListener('touchstart', handleTouchStart);
  card.addEventListener('touchmove', handleTouchMove);
  card.addEventListener('touchend', handleTouchEnd);
});

let currentCard = null;

function handleMouseMove(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const deltaX = x - centerX;
  const deltaY = y - centerY;
  const percentX = deltaX / centerX;
  const percentY = deltaY / centerY;
  const rotateX = percentY * 15;
  const rotateY = -percentX * 15;

  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  card.style.boxShadow = `${-percentX * 10}px ${percentY * 10}px 20px rgba(0, 0, 0, 0.2)`;
}

function handleMouseLeave(event) {
  const card = event.currentTarget;
  card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
  card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
  card.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.1)`;

  setTimeout(() => {
    card.style.transition = 'transform 0.2s, box-shadow 0.2s';
  }, 500);
}

function handleTouchStart(event) {
  currentCard = event.currentTarget;
}

function handleTouchMove(event) {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    updateCardTilt(touch.clientX, touch.clientY, currentCard);
  }
}

function handleTouchEnd(event) {
  const card = currentCard;
  setTimeout(() => {
    card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    card.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.1)`;
  }, 500);
  currentCard = null;
}

function updateCardTilt(x, y, card) {
  const rect = card.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const deltaX = x - (rect.left + centerX);
  const deltaY = y - (rect.top + centerY);
  const percentX = deltaX / centerX;
  const percentY = deltaY / centerY;
  const rotateX = percentY * 15;
  const rotateY = -percentX * 15;

  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  card.style.boxShadow = `${-percentX * 10}px ${percentY * 10}px 20px rgba(0, 0, 0, 0.2)`;
}
       
// Создание карточек
fetch('main/yaml/portfolio.yaml')
.then(response => response.text())
.then(yamlData => {
  const data = jsyaml.load(yamlData);
  data.projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.backgroundImage = `url(${project.img})`;
    card.style.boxShadow = `0 0 10px ${project.outline}`;
    card.id = project.id;
    card.dataset.category = project.category;
        
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.backgroundImage = `url(${project.overlay})`;
    card.appendChild(overlay);
        
    container.appendChild(card);
    projectCards.push(card);
    loadImage(project.img, () => checkLoad(data.projects));
    loadImage(project.overlay, () => checkLoad(data.projects));
  });
  
  // Создание Popup
  function escapeHTMLInsideCode(html) {
    return html.replace(/<code[^>]*>(.*?)<\/code>/gs, function(match, codeContent) {
      return '<code class="language-html match-braces">' + escapeHTML(codeContent) + '</code>';
    });
  }
  
  function escapeHTML(html) {
    return html.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
  }
  
  function openPopup(id) {
    const project = data.projects.find(project => project.id === id);
    const popupContent = document.getElementById('popup-content');
    const content = project.content[currentLanguage];
    const escapedContent = escapeHTMLInsideCode(content);
    popupContent.innerHTML = escapedContent;

    const popupMenu = document.getElementById('popup-menu');
    if (project.url && project.url.trim() !== '') {
      popupMenu.innerHTML = `
        <a class="button" href="${project.url}" target="_blank">${project.buttonText[currentLanguage]}</a>
        <span class="button close-btn" id="close-btn" onclick="closePopup()">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" viewBox="0,0,256,256">
            <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
              <g transform="scale(8.53333,8.53333)">
                <path d="M7,4c-0.25587,0 -0.51203,0.09747 -0.70703,0.29297l-2,2c-0.391,0.391 -0.391,1.02406 0,1.41406l7.29297,7.29297l-7.29297,7.29297c-0.391,0.391 -0.391,1.02406 0,1.41406l2,2c0.391,0.391 1.02406,0.391 1.41406,0l7.29297,-7.29297l7.29297,7.29297c0.39,0.391 1.02406,0.391 1.41406,0l2,-2c0.391,-0.391 0.391,-1.02406 0,-1.41406l-7.29297,-7.29297l7.29297,-7.29297c0.391,-0.39 0.391,-1.02406 0,-1.41406l-2,-2c-0.391,-0.391 -1.02406,-0.391 -1.41406,0l-7.29297,7.29297l-7.29297,-7.29297c-0.1955,-0.1955 -0.45116,-0.29297 -0.70703,-0.29297z"></path>
              </g>
            </g>
           </svg>
        </span>
      `;
    } else {
      popupMenu.innerHTML = `
        <span class="button close-btn" id="close-btn" onclick="closePopup()">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" viewBox="0,0,256,256">
            <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
              <g transform="scale(8.53333,8.53333)">
                <path d="M7,4c-0.25587,0 -0.51203,0.09747 -0.70703,0.29297l-2,2c-0.391,0.391 -0.391,1.02406 0,1.41406l7.29297,7.29297l-7.29297,7.29297c-0.391,0.391 -0.391,1.02406 0,1.41406l2,2c0.391,0.391 1.02406,0.391 1.41406,0l7.29297,-7.29297l7.29297,7.29297c0.39,0.391 1.02406,0.391 1.41406,0l2,-2c0.391,-0.391 0.391,-1.02406 0,-1.41406l-7.29297,-7.29297l7.29297,-7.29297c0.391,-0.39 0.391,-1.02406 0,-1.41406l-2,-2c-0.391,-0.391 -1.02406,-0.391 -1.41406,0l-7.29297,7.29297l-7.29297,-7.29297c-0.1955,-0.1955 -0.45116,-0.29297 -0.70703,-0.29297z"></path>
              </g>
            </g>
           </svg>
        </span>
      `;
    }
    const overlay = document.getElementById('overlay-popup');
    const popup = document.getElementById('popup');
          
    overlay.style.opacity = 1;
    overlay.style.visibility = 'visible';
    popup.style.opacity = 1;
    popup.style.visibility = 'visible';
    popupMenu.style.opacity = 1;
    popupMenu.style.visibility = 'visible';

    popup.scrollTop = 0;

    window.location.hash = `#${project.hash}`;
    Prism.highlightAll();
  }
          
  const projectCard = document.querySelectorAll('.project-card');
  projectCard.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = parseInt(card.id) ;
      openPopup(projectId);
    });
  });

  window.addEventListener('load', () => {
    const hash = window.location.hash.substr(1);
    if (hash) {
      const project = data.projects.find(project => project.hash === hash);
      if (project) {
        openPopup(project.id);
      }
    }
  });
  // Смена языка фильтра
  function changefilters(language) {
    const filterElements = document.querySelector('.filter .text');
    const filterNames = ['All', 'MyProject', 'Layout', 'Library', 'Design', 'Tilda'];
    filterElements.textContent = data.filters.All[language];
    filterNames.forEach(name => {
      const element = document.querySelector(`.tFilter${name}`);
      element.textContent = data.filters[name][language];
    });
  }
  
  changefilters(currentLanguage);
})
.catch(error => console.error('Ошибка загрузки файла portfolio.yaml', error));

// Работа фильтра
const filter = document.querySelector('.filter');
const filterSubMenu = filter.querySelector('.filter-wrap.submenu');
const filterText = filter.querySelector('.text');
const filterArrow = filter.querySelector('.arrow');

function filterProjects(category) {
  document.querySelectorAll('.project-card').forEach(card => {
    const categories = card.dataset.category.split(' ');
    card.style.display = (category === 'All' || categories.includes(category)) ? 'block' : 'none';
  });
}

document.querySelectorAll('.filter-section').forEach(section => {
  section.addEventListener('click', () => {
    const category = section.dataset.category;
    filterProjects(category);
    filterText.textContent = section.textContent;
  });
});

const handleActiveChange = () => {
  filterArrow.style.transform = `rotate(${filterSubMenu.classList.contains('active') ? '180' : '0'}deg)`;
};

const observer = new MutationObserver(handleActiveChange);
observer.observe(filterSubMenu, { attributes: true });
handleActiveChange();


