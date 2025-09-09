// Init Quill editor
var quill = new Quill('#editor-container', {
  modules: { toolbar: "#toolbar" },
  theme: 'snow'
});

// Live word count
function updateWordCount() {
  const text = quill.getText().trim();
  const words = text === "" ? 0 : text.split(/\s+/).filter(Boolean).length;
  document.getElementById('wordCount').textContent = "Words: " + words;
}
quill.on('text-change', updateWordCount);
updateWordCount();

// Local autosave
const STORAGE_KEY = "snapnote_content";
let saveTimeout;
quill.on('text-change', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, quill.root.innerHTML);
  }, 700);
});

// Restore from localStorage
document.getElementById('loadBtn').onclick = function() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) quill.root.innerHTML = saved;
  updateWordCount();
};

// Download as TXT
document.getElementById('saveBtn').onclick = function() {
  const text = quill.getText();
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "snapnote_note.txt";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

// Clear note
document.getElementById('clearBtn').onclick = function() {
  if (confirm("Clear all notes? This cannot be undone.")) {
    quill.root.innerHTML = '';
    localStorage.removeItem(STORAGE_KEY);
    updateWordCount();
  }
};

// Initial load from storage
window.addEventListener('DOMContentLoaded', function() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) quill.root.innerHTML = saved;
  updateWordCount();
});

// Register service worker for offline/app support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
