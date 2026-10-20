(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const toast = $('#toast');
  let toastTimer;
  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // Mobile navigation
  const menuToggle = $('#menuToggle');
  const nav = $('.desktop-nav');
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';
  });
  $$('.desktop-nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  }));

  // Search + category filters
  let activeFilter = 'all';
  function filterCards() {
    const query = $('#searchInput').value.trim().toLowerCase();
    $$('.highlight-card').forEach(card => {
      const categoryMatch = activeFilter === 'all' || card.dataset.category === activeFilter;
      const searchMatch = !query || (card.dataset.search + ' ' + card.textContent).toLowerCase().includes(query);
      card.classList.toggle('hidden', !(categoryMatch && searchMatch));
    });
  }
  $('#searchInput').addEventListener('input', filterCards);
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    filterCards();
  }));

  // Sample video modal
  const videoDialog = $('#videoDialog');
  const sampleVideo = $('#sampleVideo');
  function openSample() {
    if (!videoDialog.open) videoDialog.showModal();
    sampleVideo.play().catch(() => {});
  }
  $$('[data-play-sample]').forEach(button => button.addEventListener('click', openSample));
  $('#closeDialog').addEventListener('click', () => {
    sampleVideo.pause();
    videoDialog.close();
  });
  videoDialog.addEventListener('click', event => {
    if (event.target === videoDialog) {
      sampleVideo.pause();
      videoDialog.close();
    }
  });

  // Upload and local video preview
  const input = $('#videoInput');
  const dropZone = $('#dropZone');
  const userVideo = $('#userVideo');
  const videoFrame = $('#videoFrame');
  const analyzeBtn = $('#analyzeBtn');
  const videoName = $('#videoName');
  const videoDuration = $('#videoDuration');
  const result = $('#analysisResult');
  const moments = $('#moments');
  let localVideoUrl = null;
  let videoLength = 0;

  $('#chooseVideo').addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    if (input.files && input.files[0]) loadVideo(input.files[0]);
  });
  ['dragenter', 'dragover'].forEach(type => dropZone.addEventListener(type, event => {
    event.preventDefault();
    dropZone.classList.add('dragging');
  }));
  ['dragleave', 'drop'].forEach(type => dropZone.addEventListener(type, event => {
    event.preventDefault();
    dropZone.classList.remove('dragging');
  }));
  dropZone.addEventListener('drop', event => {
    const file = [...(event.dataTransfer?.files || [])].find(item => item.type.startsWith('video/'));
    if (file) loadVideo(file);
    else notify('Please drop a video file.');
  });

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  function loadVideo(file) {
    if (!file.type.startsWith('video/')) {
      notify('Choose a supported video file.');
      return;
    }
    if (localVideoUrl) URL.revokeObjectURL(localVideoUrl);
    localVideoUrl = URL.createObjectURL(file);
    userVideo.src = localVideoUrl;
    videoFrame.classList.add('has-video');
    videoName.textContent = file.name;
    videoDuration.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB · Reading duration…`;
    analyzeBtn.disabled = true;
    moments.innerHTML = '';
    result.innerHTML = '<span class="result-icon">✦</span><div><strong>Video ready to review</strong><p>Press “Find highlights” to create sample moments. This static demo uses generated timestamps, not AI recognition.</p></div>';
    userVideo.onloadedmetadata = () => {
      videoLength = userVideo.duration || 0;
      videoDuration.textContent = Number.isFinite(videoLength) ? `${formatTime(videoLength)} total · Local preview` : 'Local preview';
      analyzeBtn.disabled = false;
    };
    userVideo.onerror = () => {
      notify('This video could not be previewed in your browser. Try an MP4 or WebM file.');
    };
  }

  analyzeBtn.addEventListener('click', () => {
    if (!videoLength || !Number.isFinite(videoLength)) {
      notify('Wait for the video duration to load, then try again.');
      return;
    }
    moments.innerHTML = '';
    const labels = ['Possible scoring play', 'Fast-break moment', 'Defensive sequence', 'Late-game moment', 'Potential highlight'];
    const count = Math.min(5, Math.max(1, Math.floor(videoLength / 12)));
    const times = [];
    for (let i = 0; i < count; i++) {
      const t = Math.min(Math.max(0, videoLength - 1), videoLength * ((i + 1) / (count + 1)));
      times.push(t);
    }
    times.forEach((time, index) => {
      const button = document.createElement('button');
      button.className = 'moment';
      button.innerHTML = `<b>▶ ${formatTime(time)}</b><small>${labels[index % labels.length]}</small>`;
      button.addEventListener('click', () => {
        userVideo.currentTime = time;
        userVideo.play().catch(() => {});
      });
      moments.appendChild(button);
    });
    result.innerHTML = `<span class="result-icon">✦</span><div><strong>${count} sample moments ready</strong><p>Tap any timestamp to jump to that part of your video. These are evenly spaced demo markers, not detected plays or exported clips.</p></div>`;
    notify('Sample highlight markers generated.');
  });

  // Like, follow and share interactions
  $$('.like-btn').forEach(button => button.addEventListener('click', () => {
    const liked = button.classList.toggle('liked');
    const count = button.querySelector('span');
    const number = Number(count.textContent);
    count.textContent = String(number + (liked ? 1 : -1));
    button.firstChild.textContent = liked ? '♥ ' : '♡ ';
  }));
  $$('.follow-btn').forEach(button => button.addEventListener('click', () => {
    const following = button.classList.toggle('following');
    button.textContent = following ? '✓ Following' : '+ Follow';
    notify(following ? 'Following in this demo.' : 'Unfollowed in this demo.');
  }));
  $$('.share-btn').forEach(button => button.addEventListener('click', async () => {
    const card = button.closest('.highlight-card');
    const title = $('h3', card).textContent;
    try {
      if (navigator.share) await navigator.share({ title: 'HoopClips', text: title, url: location.href + '#explore' });
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(location.href + '#explore');
        notify('Page link copied. Share it with your crew!');
      } else notify('Use your browser address bar to share this page.');
    } catch (error) {
      if (error.name !== 'AbortError') notify('Sharing is unavailable in this browser.');
    }
  }));

  // Demo auth modal
  const authDialog = $('#authDialog');
  function showAuth(isSignup) {
    $('#authTitle').textContent = isSignup ? 'Join the community' : 'Welcome back, hooper';
    $('#authCopy').textContent = isSignup ? 'Create a demo profile to start sharing your game.' : 'This sign-in preview is for the static demo only.';
    $('#authSubmit').textContent = isSignup ? 'Create demo profile' : 'Continue demo';
    if (!authDialog.open) authDialog.showModal();
  }
  $('#signupBtn').addEventListener('click', () => showAuth(true));
  $('#loginBtn').addEventListener('click', () => showAuth(false));
  $('#closeAuth').addEventListener('click', () => authDialog.close());
  $('#authForm').addEventListener('submit', event => {
    event.preventDefault();
    authDialog.close();
    notify('Thanks! Account creation is not connected in this front-end demo.');
    event.currentTarget.reset();
  });

  $('#loadMore').addEventListener('click', () => notify('You’re all caught up with the sample highlights.'));
  window.addEventListener('beforeunload', () => {
    if (localVideoUrl) URL.revokeObjectURL(localVideoUrl);
  });
})();