// ================= Splash Screen =================
window.addEventListener("load", () => {
  const splash = document.querySelector(".splash");
  const title = document.querySelector(".splash-title");

  // Animation d'apparition
  setTimeout(() => {
    title.style.opacity = 0.9;
    title.style.transform = "translateY(0)";
  }, 100); // petit délai pour que le CSS se charge

  // Disparition après 3 secondes
  setTimeout(() => {
    splash.style.transition = "opacity 0.8s ease";
    splash.style.opacity = 0;
    setTimeout(() => splash.style.display = "none", 300);
  }, 1000);
});

// ================= Machine à écrire (Hero) =================
const heroText = "El atraco del siglo. Comienza el mayor atraco de la historia.";
let i = 0;
const typed = document.querySelector(".hero-content h1");
function typeEffect() {
  if (i < heroText.length) {
    typed.textContent += heroText.charAt(i);
    i++;
    setTimeout(typeEffect, 90);
  }
}
window.addEventListener("load", typeEffect);

// ================= Scroll Progress Bar =================
const progressBar = document.createElement("div");
progressBar.className = "scroll-bar";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (scrollTop / scrollHeight) * 100;
  progressBar.style.width = scrolled + "%";
});




// ================= GSAP Animations =================
if (typeof gsap !== "undefined") {
  
  // Hero parallaxe léger
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    gsap.to(".hero-content", { y: scrolled * 0.2, ease: "none", overwrite: true });
  });

  // Entrée des cartes personnages
  gsap.from(".flip-card", { opacity: 0, y: 100, stagger: 0.3, duration: 1.5, delay: 3.5, ease: "power3.out" });

  // Animation hover 3D des cartes
  const cards = document.querySelectorAll(".flip-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -(y - centerY) / 20;
      const rotateY = (x - centerX) / 20;
      gsap.to(card, { rotationX: rotateX, rotationY: rotateY, scale: 1.05, duration: 0.3 });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.5 });
    });
  });

  // Timeline saisons
  gsap.from(".timeline-item", { opacity: 0, x: -100, stagger: 0.4, duration: 1.2, delay: 4, ease: "power3.out" });

  // Galerie
  gsap.from(".gallery img", { opacity: 0, scale: 0.8, stagger: 0.2, duration: 1.2, delay: 5, ease: "power3.out" });
}
// ===================== Animations section Infos =====================
const infoCards = document.querySelectorAll("#infos .info-card");

function animateInfos() {
  infoCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      card.querySelectorAll("p, ul").forEach(el => {
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
      });
    }
  });
}

// Animation au scroll
window.addEventListener("scroll", animateInfos);
window.addEventListener("load", animateInfos);

// GSAP animation pour effet plus fluide
if (typeof gsap !== "undefined") {
  gsap.from("#infos h2", { opacity:0, y:-50, duration:1, delay:1 });
  gsap.from("#infos h3", { opacity:0, x:-50, stagger:0.2, duration:1.2, delay:1.5 });
  gsap.from("#infos .info-card", { opacity:0, y:50, stagger:0.3, duration:1.2, delay:2 });
}




// <!-- ======= JS: Intersection Observer pour déclencher .show et démarre carousels en autoplay ======= -->
// Sélection de toutes les images du carrousel
const images = document.querySelectorAll('.carousel-custom img');
let index = 0; // première image

function changeImage() {
  // Supprime la classe active de toutes les images
  images.forEach(img => img.classList.remove('active'));

  // Active l’image suivante
  index = (index + 1) % images.length; // boucle infinie
  images[index].classList.add('active');
}

// Changement d’image toutes les 3 secondes
setInterval(changeImage, 3000);

//========scrool animation PERSONNAGES=====
(function(){
  // Smooth scroll to la section "personnages" pour les liens <a href="#personnages">
  document.querySelectorAll('a[href="#personnages"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('personnages') || document.querySelector('.personnages');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Sélection des cartes personnages (compatibilité avec plusieurs classes possibles)
  const cards = document.querySelectorAll('#personnages .flip-card, #personnages .character-card, .personnage-card');

  if (cards.length) {
    // IntersectionObserver pour faire apparaître les cartes quand elles entrent dans le viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // ajout d'une classe pour déclencher les transitions CSS
          entry.target.classList.add('show');
          // petit stagger basé sur l'ordre dans la NodeList
          const idx = Array.from(cards).indexOf(entry.target);
          entry.target.style.transitionDelay = (idx * 80) + 'ms';
        }
      });
    }, { threshold: 0.15 });

    cards.forEach(card => {
      // état initial utile pour CSS (ex: opacity:0; transform: translateY(30px);)
      card.classList.add('will-animate');
      observer.observe(card);
    });

    // Optionnel : léger effet de parallaxe sur les cartes pendant le scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          cards.forEach(card => {
            // depth personnalisable via data-depth sur chaque carte (ex: data-depth="0.02")
            const depth = parseFloat(card.dataset.depth) || 0.02;
            card.style.transform = `translateY(${scrolled * depth}px) ${card.classList.contains('show') ? '' : ''}`;
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }
})();


document.addEventListener('DOMContentLoaded', () => {
  const triviaCards = document.querySelectorAll('.trivia-card');

  triviaCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });
  });

  // Scroll animation
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  triviaCards.forEach(card => {
    observer.observe(card);
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  // Animation scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  observer.observe(form);

  // Validation simple
  form.addEventListener('submit', e => {
    e.preventDefault();
    formMessage.textContent = "Merci pour votre message ! Nous vous répondrons bientôt.";
    formMessage.style.color = "#ff5252";
    form.reset();
  });
});



document.addEventListener('DOMContentLoaded', () => {
  const footerForm = document.getElementById('footerCommentForm');
  const footerComments = document.getElementById('footerComments');

  footerForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('footerName').value.trim();
    const comment = document.getElementById('footerComment').value.trim();

    if(name && comment){
      const newComment = document.createElement('div');
      newComment.classList.add('comment-item', 'visible');
      newComment.innerHTML = `<strong>${name}</strong>: ${comment}`;

      footerComments.prepend(newComment);

      footerForm.reset();
    }
  });

  // Animation au scroll (IntersectionObserver)
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.footer-comments .comment-item').forEach(item => observer.observe(item));
});

document.addEventListener('DOMContentLoaded', function() {
  const items = document.querySelectorAll('#carouselSaisons .carousel-item');
  let currentIndex = 0;
  
  function showItem(index) {
    items.forEach((item, i) => {
      if(i === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  document.querySelector('#carouselSaisons .carousel-control-next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    showItem(currentIndex);
  });
  
  document.querySelector('#carouselSaisons .carousel-control-prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showItem(currentIndex);
  });
});



// Affiche le bouton après un certain scroll
// const btnTopp = document.getElementById("btnTop");

// window.addEventListener("scroll", () => {
//   if (window.scrollY > 300) {
//     btnTopp.classList.add("show");
//   } else {
//     btnTopp.classList.remove("show");
//   }
// });

// // Action de retour en haut
// btnTopp.addEventListener("click", () => {
//   window.scrollTo({ top: 0, behavior: "smooth" });
// });

// const clicksound =document.getElementById('clicksound');
// document.getElementById('click-sound').forEach(el=>{
//   el.addEventListener('click', () => {
// });
// });
// === CODE 1 : BOUTON RETOUR EN HAUT ===
    const btnTopp = document.getElementById("btnTop");
    
    if (btnTopp) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                btnTopp.classList.add("show");
            } else {
                btnTopp.classList.remove("show");
            }
        });

        btnTopp.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }





//regarder maintenant.html

const episodesData = {
  1: [
    { img: "image/saison1.webp", title: "Épisode 1", desc: "Le Professeur recrute Tokyo pour le braquage du siècle à la Monnaie d'Espagne.",videoSrc: "vidio/Saison1/EP1.mp4",subtitles: [
                {
                    src: "subtitles/saison1/episode1_fr.vtt",
                    srclang: "fr",
                    label: "Français"
                  },
                {
                  src: "subtitles/saison1/episode1_ar.vtt",
                    srclang: "ar",
                    label: "العربية"
                  },
                {
                    src: "subtitles/saison1/episode1_en.vtt",
                    srclang: "en",
                    label: "English"
                }
              ] },
              { img: "image/saison1.webp", title: "Épisode 2", desc: "Les otages deviennent imprévisibles.", videoSrc: "vidio/Saison1/EP2.mp4" , subtitles: [
                { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ]
    },
    { img: "image/saison1.webp", title: "Épisode 3", desc: "Le plan du Professeur est mis à l’épreuve.",videoSrc: "vidio/Saison1/EP3.mp4",  subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison1.webp", title: "Épisode 4", desc: "Les tensions explosent dans le groupe." , videoSrc: "vidio/Saison1/EP4.mp4",  subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison1.webp", title: "Épisode 5", desc: "La police découvre un indice majeur." ,videoSrc: "vidio/Saison1/EP5.mp4",  subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison1.webp", title: "Épisode 6", desc: "Un otage tente de s’échapper." , videoSrc: "vidio/Saison1/EP6.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
      { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
      { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison1.webp", title: "Épisode 7", desc: "Les braqueurs perdent le contrôle." , videoSrc: "vidio/Saison1/EP7.mp4",  subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison1.webp", title: "Épisode 8", desc: "Berlin prend une décision radicale." , videoSrc: "vidio/Saison1/EP8.mp4",  subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
      { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison1.webp", title: "Épisode 9", desc: "L’amour complique les plans." , videoSrc: "vidio/Saison1/EP9.mp4",  subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison1.webp", title: "Épisode 10", desc: "Le Professeur affronte un piège." , videoSrc: "vidio/Saison1/EP10.mp4", subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
     },
    { img: "image/saison1.webp", title: "Épisode 11", desc: "La police encercle le bâtiment." ,videoSrc: "vidio/Saison1/EP11.mp4",  subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
     },
    { img: "image/saison1.webp", title: "Épisode 12", desc: "La fin du casse approche." ,videoSrc: "vidio/Saison1/EP12.mp4" , subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
     },
    { img: "image/saison1.webp", title: "Épisode 13", desc: "L’évasion finale commence." ,videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
      { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
      { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
    ] 
  }
  ],
  2: [
    { img: "image/saison2.webp", title: "Épisode 1", desc: "Le plan s’écroule petit à petit.",videoSrc: "vidio/Saison2/EP1.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ]  
    },
    { img: "image/saison2.webp", title: "Épisode 2", desc: "Tokyo se rebelle contre les ordres.",videoSrc: "vidio/Saison2/EP2.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
      { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
      { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
    ] 
  },
  { img: "image/saison2.webp", title: "Épisode 3", desc: "Les médias s’en mêlent." ,videoSrc: "vidio/Saison2/EP3.mp4", subtitles: [
    { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
    { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
     },
     { img: "image/saison2.webp", title: "Épisode 4", desc: "Un otage change la donne.",videoSrc: "vidio/Saison2/EP4.mp4", subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison2.webp", title: "Épisode 5", desc: "Berlin prépare un sacrifice.",videoSrc: "vidio/Saison2/EP5.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
      { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison2.webp", title: "Épisode 6", desc: "La tension atteint son sommet.",videoSrc: "vidio/Saison2/EP6.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
     },
     { img: "image/saison2.webp", title: "Épisode 7", desc: "Le Professeur perd le contrôle.",videoSrc: "vidio/Saison2/EP7.mp4", subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
     },
    { img: "image/saison2.webp", title: "Épisode 8", desc: "L’amour et la trahison.",videoSrc: "vidio/Saison2/EP8.mp4", subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
     },
    { img: "image/saison2.webp", title: "Épisode 9", desc: "Le grand final du premier casse.",videoSrc: "vidio/Saison2/EP9.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    }
  ],
  3: [
    { img: "image/saison3.webp", title: "Épisode 1", desc: "Retour en mission pour sauver Rio.",videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
      { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
      { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
    ] 
     },
     { img: "image/saison3.webp", title: "Épisode 2", desc: "La Banque d’Espagne devient la cible.",videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
       { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
       { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison3.webp", title: "Épisode 3", desc: "Le plan parfait commence." ,videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
      { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
      { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison3.webp", title: "Épisode 4", desc: "Un agent double se révèle.",videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison3.webp", title: "Épisode 5", desc: "Le Professeur sous pression.",videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
     },
     { img: "image/saison3.webp", title: "Épisode 6", desc: "L’armée s’en mêle.",videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
     },
     { img: "image/saison3.webp", title: "Épisode 7", desc: "Un sacrifice héroïque.",videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
       { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
       { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
       { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison3.webp", title: "Épisode 8", desc: "Le chaos s’installe.",videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
      { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
      { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    }
  ],
  4: [
    { img: "image/saison4webp.webp", title: "Épisode 1", desc: "Tokyo reprend le commandement." ,videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison4webp.webp", title: "Épisode 2", desc: "La guerre psychologique continue.",videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
     },
     { img: "image/saison4webp.webp", title: "Épisode 3", desc: "Les pertes s’accumulent." ,videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison4webp.webp", title: "Épisode 4", desc: "Un tournant tragique." ,videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison4webp.webp", title: "Épisode 5", desc: "Le Professeur face à l’échec.",videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison4webp.webp", title: "Épisode 6", desc: "Une révélation inattendue.",videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
     },
     { img: "image/saison4webp.webp", title: "Épisode 7", desc: "L’espoir renaît.",videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison4webp.webp", title: "Épisode 8", desc: "Fin sanglante du braquage." ,videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    }
  ],
  5: [
    { img: "image/saison5.jpeg", title: "Épisode 1", desc: "La dernière bataille commence." ,videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison5.jpeg", title: "Épisode 2", desc: "Les adieux d’un héros." ,videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
      { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
      { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison5.jpeg", title: "Épisode 3", desc: "L’armée encercle la banque." ,videoSrc: "vidio/Saison1/EP13.mp4", subtitles: [
        { src: "subtitles/saison1/episode1_fr.vtt", srclang: "fr", label: "Français" },
        { src: "subtitles/saison1/episode1_ar.vtt", srclang: "ar", label: "العربية" },
        { src: "subtitles/saison1/episode1_en.vtt", srclang: "en", label: "English" }
      ] 
    },
    { img: "image/saison5.jpeg", title: "Épisode 4", desc: "Le sacrifice final se prépare." },
    { img: "image/saison5.jpeg", title: "Épisode 5", desc: "Tokyo prend sa revanche." },
    { img: "image/saison5.jpeg", title: "Épisode 6", desc: "Le Professeur piégé." },
    { img: "image/saison5.jpeg", title: "Épisode 7", desc: "La tension est à son comble." },
    { img: "image/saison5.jpeg", title: "Épisode 8", desc: "Dernier combat dans la banque." },
    { img: "image/saison5.jpeg", title: "Épisode 9", desc: "La victoire semble proche." },
    { img: "image/saison5.jpeg", title: "Épisode 10", desc: "Le final explosif du Professeur." }
  ]
};

const episodeContainer = document.getElementById("episode-container");
const buttons = document.querySelectorAll(".season-btn");

// 🆕 Nouveau conteneur pour afficher la vidéo au-dessus des épisodes
const videoFrameContainer = document.createElement("div");
videoFrameContainer.id = "video-frame-container";
videoFrameContainer.classList.add("video-frame");
episodeContainer.parentNode.insertBefore(videoFrameContainer, episodeContainer);

function displayEpisodes(season) {
  const episodes = episodesData[season];
    if (!episodes) return;
    
    episodeContainer.innerHTML = episodes
        .map(ep => `
            <div class="episode-card">
                <img src="${ep.img}" alt="${ep.title}">
                <div class="episode-info">
                    <h4>${ep.title}</h4>
                    <p>${ep.desc}</p>
                    <button class="watch-btn" data-video="${ep.videoSrc}">
                        ▶ Regarder l'épisode
                    </button>
                </div>
            </div>
        `)
        .join("");
    
    // Espace en bas
    episodeContainer.style.marginBottom = "80px";

    // Ajouter les événements aux boutons "Regarder"
    document.querySelectorAll('.watch-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-video');
            const episodeTitle = this.parentElement.querySelector('h4').textContent;
            openVideoInPage(videoSrc, episodeTitle);
        });
    });
}

// 🆕 MODIFIÉ : Fonction pour afficher la vidéo locale
function openVideoInPage(videoSrc, episodeTitle) {
    videoFrameContainer.innerHTML = `
        <div class="video-wrapper">
            <button class="close-video">✖</button>
            <div class="video-header">
                <h3>${episodeTitle}</h3>
            </div>
            <video controls autoplay muted>
                <source src="${videoSrc}" type="video/mp4">
                Votre navigateur ne supporte pas la lecture vidéo.
            </video>
            <div class="video-footer">
                <p>🎬 Lecture en cours...</p>
            </div>
        </div>
    `;
    videoFrameContainer.style.display = "block";

    // 🆕 Défilement fluide vers la vidéo
    videoFrameContainer.scrollIntoView({ 
      behavior: 'smooth', 
        block: 'center' 
      });
      
      // Bouton pour fermer la vidéo
    const closeVideoBtn = videoFrameContainer.querySelector(".close-video");
    closeVideoBtn.addEventListener("click", () => {
        // 🆕 Arrêter la vidéo avant de fermer
        const video = videoFrameContainer.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        videoFrameContainer.style.display = "none";
        videoFrameContainer.innerHTML = "";
      });
    }
    
    // Changement de saison
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        // 🆕 Arrêter et cacher la vidéo en cours quand on change de saison
        const video = videoFrameContainer.querySelector('video');
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
        videoFrameContainer.style.display = "none";
        videoFrameContainer.innerHTML = "";
        
        displayEpisodes(btn.dataset.season);
    });
  });

  // Afficher la saison 1 par défaut
  displayEpisodes(1);




