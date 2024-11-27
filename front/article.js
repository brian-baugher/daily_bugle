const title = document.getElementById('title');
const urlParams = new URLSearchParams(window.location.search);
title.innerHTML = urlParams.get('title')