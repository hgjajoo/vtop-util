document.getElementById('useSaved').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'useSaved' });
  });
  
  document.getElementById('enterNew').addEventListener('click', () => {
    document.getElementById('credentialsForm').classList.remove('hidden');
  });
  
  document.getElementById('saveCredentials').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    chrome.runtime.sendMessage({ action: 'saveCredentials', username, password });
  });
  