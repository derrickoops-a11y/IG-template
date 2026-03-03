document.addEventListener('DOMContentLoaded', () => {

  // --- Elements ---

  // Toggles
  const themeSwitch = document.getElementById('theme-switch');
  const deviceBtns = document.querySelectorAll('.device-btn');
  const phoneFrameWrapper = document.querySelector('.phone-frame-wrapper');

  // Inputs
  const inputAvatar = document.getElementById('input-avatar');
  const inputUsername = document.getElementById('input-username');
  const inputLocation = document.getElementById('input-location');
  const inputMusic = document.getElementById('input-music');
  const inputCaption = document.getElementById('input-caption');
  const inputFiles = document.getElementById('input-files');
  const inputFolder = document.getElementById('input-folder');
  const inputReplace = document.getElementById('input-replace');
  const btnUpload = document.querySelector('.btn-upload');
  const inputLikes = document.getElementById('input-likes');
  const inputTime = document.getElementById('input-time');

  // Comments
  const inputCommentUser = document.getElementById('comment-user');
  const inputCommentText = document.getElementById('comment-text');
  const btnAddComment = document.getElementById('add-comment-btn');
  const mockCommentsList = document.getElementById('mock-comments-list');

  // Renders
  const renderAvatar = document.getElementById('render-avatar');

  const renderUsername = document.getElementById('render-username');
  const renderCaptionUsername = document.getElementById('render-caption-username');

  const renderLocationGroup = document.getElementById('render-location-group');
  const renderLocation = document.getElementById('render-location');

  const renderMusicGroup = document.getElementById('render-music-group');
  const renderMusic = document.getElementById('render-music');

  const renderCaptionGroup = document.getElementById('render-caption-group');
  const renderCaption = document.getElementById('render-caption');

  const renderLikes = document.getElementById('render-likes');
  const renderHeaderTime = document.getElementById('render-header-time');
  const renderCommentsGroup = document.getElementById('render-comments-group');

  // Carousel Elements
  const carouselTrack = document.getElementById('carousel-track');
  const carouselDotsContainer = document.getElementById('carousel-dots');
  const fileListPreview = document.getElementById('file-list-preview');
  const btnPrev = document.getElementById('carousel-prev');
  const btnNext = document.getElementById('carousel-next');

  const imageEditPanel = document.getElementById('image-edit-panel');
  const cropX = document.getElementById('crop-x');
  const cropY = document.getElementById('crop-y');
  const cropZoom = document.getElementById('crop-zoom');


  // --- Theme Toggling ---
  themeSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  });


  // --- Device Toggles ---
  deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      deviceBtns.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');
      // Change width of wrapper
      const width = btn.getAttribute('data-width');
      phoneFrameWrapper.style.width = `${width}px`;
    });
  });


  // --- Text Data Binding ---

  // Username
  inputUsername.addEventListener('input', (e) => {
    const val = e.target.value.trim() || 'fawazz_ai';
    renderUsername.textContent = val;
    renderCaptionUsername.textContent = val;
  });

  // Location
  inputLocation.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val) {
      renderLocationGroup.style.display = 'flex';
      renderLocation.textContent = val;
    } else {
      renderLocationGroup.style.display = 'none';
      renderLocation.textContent = '';
    }
  });

  // Post Time
  inputTime.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    renderHeaderTime.textContent = val ? ` \u2022 ${val}` : '';
  });

  // Music
  const spotifyContainer = document.getElementById('spotify-player-container');
  const spotifyCustomization = document.getElementById('spotify-customization');
  const inputMusicName = document.getElementById('input-music-name');
  const inputMusicTime = document.getElementById('input-music-time');

  function updateSpotifyEmbed() {
    const val = inputMusic.value.trim();
    if (!val) {
      spotifyContainer.innerHTML = '';
      spotifyCustomization.style.display = 'none';
      renderMusicGroup.style.display = 'none';
      renderMusic.textContent = '';
      return;
    }

    const spotifyMatch = val.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
    const timeMatch = val.match(/t=(\d+)/);
    const trackId = spotifyMatch ? spotifyMatch[1] : null;

    if (trackId) {
      spotifyContainer.style.display = 'block';
      spotifyCustomization.style.display = 'flex';
      renderMusicGroup.style.display = 'flex';

      let iframe = spotifyContainer.querySelector('iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.width = "100%";
        iframe.height = "152";
        iframe.frameBorder = "0";
        iframe.allowFullscreen = true;
        iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
        iframe.loading = "lazy";
        spotifyContainer.appendChild(iframe);
      }

      let src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
      const startTime = parseInt(inputMusicTime.value.trim()) || (timeMatch ? parseInt(timeMatch[1]) : 0);
      if (startTime > 0) {
        src += `&t=${startTime}`;
      }
      iframe.src = src;

      const name = inputMusicName.value.trim() || "Ivy";
      const artist = "Frank Ocean";
      renderMusic.innerHTML = `<span class="music-note-icon">♫</span> ${name} &bull; ${artist}`;
    } else {
      spotifyContainer.style.display = 'none';
      spotifyCustomization.style.display = 'none';
      renderMusicGroup.style.display = 'flex';
      renderMusic.innerHTML = `<span class="music-note-icon">♫</span> ${val}`;
    }

    inputMusic.addEventListener('input', updateSpotifyEmbed);
    inputMusicName.addEventListener('input', updateSpotifyEmbed);
    inputMusicTime.addEventListener('input', updateSpotifyEmbed);

    // Caption
    inputCaption.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) {
        renderCaptionGroup.style.display = 'block';
        renderCaption.textContent = ' ' + val; // Space after username
      } else {
        renderCaptionGroup.style.display = 'none';
        renderCaption.textContent = '';
      }
    });

    // Initial caption display
    const initialCaption = inputCaption.value.trim();
    if (initialCaption) {
      renderCaptionGroup.style.display = 'block';
      renderCaption.textContent = ' ' + initialCaption;
    }

    // Likes
    inputLikes.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      renderLikes.textContent = val || '1,234 likes';
    });


    // --- Comments Builder ---
    let mockComments = [];

    function renderComments() {
      // Clear lists
      mockCommentsList.innerHTML = '';
      renderCommentsGroup.innerHTML = '';

      mockComments.forEach((comment, index) => {
        // 1. Control Panel List Item
        const li = document.createElement('li');
        li.innerHTML = `
        <span><b>${escapeHTML(comment.user)}</b> ${escapeHTML(comment.text)}</span>
        <button class="remove-comment" data-index="${index}">X</button>
      `;
        mockCommentsList.appendChild(li);

        // 2. Replica Render Item
        const div = document.createElement('div');
        div.className = 'mock-comment-row';
        div.innerHTML = `<span class="username">${escapeHTML(comment.user)}</span> <span class="caption-text">${escapeHTML(comment.text)}</span>`;
        renderCommentsGroup.appendChild(div);
      });

      // Attach remove listeners
      document.querySelectorAll('.remove-comment').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.getAttribute('data-index'));
          mockComments.splice(idx, 1);
          renderComments();
        });
      });
    }

    btnAddComment.addEventListener('click', () => {
      const user = inputCommentUser.value.trim();
      const text = inputCommentText.value.trim();
      if (user && text) {
        mockComments.push({ user, text });
        inputCommentUser.value = '';
        inputCommentText.value = '';
        renderComments();
      }
    });

    // Simple HTML escaper to prevent injection if someone pastes weird stuff
    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g,
        tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag));
    }


    // --- Image Uploading ---

    // Avatar Upload
    inputAvatar.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          renderAvatar.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Trigger file input cleanly
    btnUpload.addEventListener('click', (e) => {
      // Let the native input overlapping it handle the click, just a visual helper if needed
      // The relative wrapper handles this gracefully.
    });

    // Carousel Upload
    let carouselImages = []; // Array of { dataUrl, x: 50, y: 50, scale: 1 }
    let currentEditIndex = null;


    function handleFilesSelection(files) {
      if (files.length === 0) return;

      // Reset previous
      carouselImages = [];
      imageEditPanel.style.display = 'none';
      currentEditIndex = null;

      let loadedCount = 0;

      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          carouselImages[index] = {
            dataUrl: event.target.result,
            x: 50,
            y: 50,
            scale: 1
          };

          loadedCount++;
          if (loadedCount === files.length) {
            buildCarousel();
          }
        };
        reader.readAsDataURL(file);
      });
    }

    inputFiles.addEventListener('change', (e) => {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      handleFilesSelection(files);
    });

    inputFolder.addEventListener('change', (e) => {
      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      // Natural Sort (numba1, numba2... numba10)
      files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
      handleFilesSelection(files);
    });

    function buildCarousel() {
      carouselTrack.innerHTML = '';
      carouselDotsContainer.innerHTML = '';
      fileListPreview.innerHTML = '';

      carouselImages.forEach((item, index) => {
        // 1. Add to thumb preview in control panel
        const wrapper = document.createElement('div');
        wrapper.className = 'thumb-wrapper';

        const thumb = document.createElement('img');
        thumb.src = item.dataUrl;
        thumb.setAttribute('data-index', index);
        thumb.draggable = true;

        if (index === currentEditIndex) {
          thumb.classList.add('selected');
        }

        thumb.addEventListener('click', () => {
          currentEditIndex = index;
          buildCarousel();
          imageEditPanel.style.display = 'block';
          cropX.value = carouselImages[index].x;
          cropY.value = carouselImages[index].y;
          cropZoom.value = carouselImages[index].scale || 1;
        });

        // Replace Badge
        const replaceBtn = document.createElement('div');
        replaceBtn.className = 'replace-badge';
        replaceBtn.innerHTML = '&#8634;'; // Replace symbol
        replaceBtn.title = 'Replace this image';
        replaceBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          currentEditIndex = index;
          inputReplace.click();
        });

        wrapper.appendChild(thumb);
        wrapper.appendChild(replaceBtn);
        fileListPreview.appendChild(wrapper);

        // Drag and Drop ordering
        thumb.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', index.toString());
        });

        thumb.addEventListener('dragover', (e) => {
          e.preventDefault();
          thumb.classList.add('drag-over');
        });

        thumb.addEventListener('dragleave', () => {
          thumb.classList.remove('drag-over');
        });

        thumb.addEventListener('drop', (e) => {
          e.preventDefault();
          thumb.classList.remove('drag-over');
          const draggedIndexStr = e.dataTransfer.getData('text/plain');
          if (!draggedIndexStr) return;
          const draggedIndex = parseInt(draggedIndexStr, 10);
          const targetIndex = index;

          if (draggedIndex !== targetIndex && !isNaN(draggedIndex)) {
            // Swap in array
            const draggedItem = carouselImages.splice(draggedIndex, 1)[0];
            carouselImages.splice(targetIndex, 0, draggedItem);

            // Adjust currentEditIndex if affected
            if (currentEditIndex === draggedIndex) currentEditIndex = targetIndex;
            else if (currentEditIndex === targetIndex) currentEditIndex = draggedIndex;

            buildCarousel(); // Re-render everything
          }
        });

        // 2. Add to carousel replica
        const frame = document.createElement('div');
        frame.className = 'carousel-frame';
        frame.id = `frame-${index}`;
        const replicaImg = document.createElement('img');
        replicaImg.src = item.dataUrl;
        replicaImg.id = `replica-img-${index}`;
        replicaImg.style.objectPosition = `${item.x}% ${item.y}%`;
        replicaImg.style.transform = `scale(${item.scale || 1})`;
        replicaImg.style.transition = 'transform 0.1s ease-out'; // Smooth zoom

        frame.appendChild(replicaImg);
        carouselTrack.appendChild(frame);

        // 3. Add pagination dot
        if (carouselImages.length > 1) {
          const dot = document.createElement('div');
          dot.className = `dot ${index === 0 ? 'active' : ''}`;
          dot.id = `dot-${index}`;
          carouselDotsContainer.appendChild(dot);
        }
      });

      setupIntersectionObserver();
      updateArrowVisibility();
    }

    // Handle individual image replacement
    inputReplace.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('image/') && currentEditIndex !== null) {
        const reader = new FileReader();
        reader.onload = (event) => {
          carouselImages[currentEditIndex].dataUrl = event.target.result;
          buildCarousel();
        };
        reader.readAsDataURL(file);
      }
      // Reset value so same file can be chosen again if needed
      e.target.value = '';
    });

    // --- Carousel Navigation Arrows ---
    btnPrev.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: -carouselTrack.clientWidth, behavior: 'smooth' });
    });

    btnNext.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: carouselTrack.clientWidth, behavior: 'smooth' });
    });

    function updateArrowVisibility() {
      if (carouselImages.length <= 1) {
        btnPrev.style.display = 'none';
        btnNext.style.display = 'none';
        return;
      }

      const scrollLeft = carouselTrack.scrollLeft;
      const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;

      btnPrev.style.display = scrollLeft <= 0 ? 'none' : 'flex';
      btnNext.style.display = scrollLeft >= maxScroll - 5 ? 'none' : 'flex';
    }

    carouselTrack.addEventListener('scroll', updateArrowVisibility);

    // --- Carousel Drag to Scroll (Desktop) ---
    let isDown = false;
    let startX;
    let scrollLeft;

    carouselTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      carouselTrack.style.cursor = 'grabbing';
      // Temporarily disable snap during drag for smoother manual control
      carouselTrack.style.scrollSnapType = 'none';
      startX = e.pageX - carouselTrack.offsetLeft;
      scrollLeft = carouselTrack.scrollLeft;
    });

    carouselTrack.addEventListener('mouseleave', () => {
      isDown = false;
      carouselTrack.style.cursor = 'grab';
      carouselTrack.style.scrollSnapType = 'x mandatory';
    });

    carouselTrack.addEventListener('mouseup', () => {
      isDown = false;
      carouselTrack.style.cursor = 'grab';
      carouselTrack.style.scrollSnapType = 'x mandatory';
      // The browser will naturally snap to the closest image now
    });

    carouselTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carouselTrack.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast multiplier
      carouselTrack.scrollLeft = scrollLeft - walk;
    });

    // --- Crop Sliders Handling ---
    cropX.addEventListener('input', (e) => {
      if (currentEditIndex !== null) {
        carouselImages[currentEditIndex].x = e.target.value;
        const img = document.getElementById(`replica-img-${currentEditIndex}`);
        if (img) img.style.objectPosition = `${e.target.value}% ${carouselImages[currentEditIndex].y}%`;
      }
    });

    cropY.addEventListener('input', (e) => {
      if (currentEditIndex !== null) {
        carouselImages[currentEditIndex].y = e.target.value;
        const img = document.getElementById(`replica-img-${currentEditIndex}`);
        if (img) img.style.objectPosition = `${carouselImages[currentEditIndex].x}% ${e.target.value}%`;
      }
    });

    cropZoom.addEventListener('input', (e) => {
      if (currentEditIndex !== null) {
        carouselImages[currentEditIndex].scale = e.target.value;
        const img = document.getElementById(`replica-img-${currentEditIndex}`);
        if (img) img.style.transform = `scale(${e.target.value})`;
      }
    });

    // --- Carousel Scroll Tracking ---
    let observer;

    function setupIntersectionObserver() {
      if (observer) observer.disconnect();

      // We only need dots if more than 1 image
      if (carouselImages.length <= 1) return;

      const frames = document.querySelectorAll('.carousel-frame');
      const dots = document.querySelectorAll('.dot');

      const options = {
        root: carouselTrack,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when an image is 50% in view
      };

      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Find which index
            const id = entry.target.id;
            const indexMatch = id.match(/frame-(\d+)/);
            if (indexMatch) {
              const activeIndex = parseInt(indexMatch[1]);

              // Update dots
              dots.forEach((dot, idx) => {
                if (idx === activeIndex) {
                  dot.classList.add('active');
                } else {
                  dot.classList.remove('active');
                }
              });
            }
          }
        });
      }, options);

      frames.forEach(frame => observer.observe(frame));
    }

    // --- Initialization ---
    function initDefaults() {
      // Fetch user-defined absolute paths via our local python API
      fetch('http://localhost:3001/api/defaults')
        .then(res => {
          if (!res.ok) throw new Error('API not available');
          return res.json();
        })
        .then(data => {
          console.log("Loaded defaults API:", data);
          // 1. Set Avatar if found
          if (data.avatar) {
            renderAvatar.src = data.avatar;
          }

          // 2. Load Carousel Images if found
          if (data.carousel && data.carousel.length > 0 && carouselImages.length === 0) {
            carouselImages = data.carousel.map((imgData, index) => {
              return {
                dataUrl: imgData.dataUrl,
                x: 50,
                y: 50,
                scale: 1
              };
            });
            buildCarousel();
          }

          // 3. Initialize other defaults
          updateSpotifyEmbed();
          renderHeaderTime.textContent = inputTime.value.trim() ? ` \u2022 ${inputTime.value.trim()}` : '';
          renderUsername.textContent = inputUsername.value.trim() || 'fawazz_ai';
          renderCaptionUsername.textContent = inputUsername.value.trim() || 'fawazz_ai';
        })
        .catch(err => {
          console.log("No default paths API found or error:", err);
        });
    }

    // Start init process
    initDefaults();

  });
