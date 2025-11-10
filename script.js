const imageInput = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const statusText = document.getElementById('statusText');
const resultsEl = document.getElementById('results');

let model = null;

async function loadModel() {
  try {
    statusText.textContent = 'Loading model...';
    model = await mobilenet.load();
    statusText.textContent = 'Model loaded';
  } catch (err) {
    console.error('Model load failed', err);
    statusText.textContent = 'Model load failed — check console';
  }
}

imageInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  preview.src = url;
  preview.onload = () => { URL.revokeObjectURL(url); };
});

async function classifyImage() {
  if (!model) {
    statusText.textContent = 'Model not ready';
    return;
  }
  if (!preview || !preview.src) {
    statusText.textContent = 'No image selected';
    return;
  }
  try {
    statusText.textContent = 'Classifying…';
    const preds = await model.classify(preview, 5);
    showPredictions(preds);
    statusText.textContent = 'Done';
  } catch (err) {
    console.error('Classification error', err);
    statusText.textContent = 'Classification failed — check console';
  }
}

function showPredictions(preds) {
  resultsEl.innerHTML = '';
  if (!preds || preds.length === 0) {
    resultsEl.textContent = 'No predictions';
    return;
  }
  const ul = document.createElement('ul');
  preds.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${escapeHtml(p.className)} — ${(p.probability * 100).toFixed(2)}%`;
    ul.appendChild(li);
  });
  resultsEl.appendChild(ul);
}

function escapeHtml(s = '') {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

window.addEventListener('load', loadModel);
