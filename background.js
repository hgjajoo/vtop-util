chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'useSaved') {
      chrome.storage.sync.get(['loginData'], (result) => {
          if (result.loginData) {
              console.log('Using saved credentials');
              redirectToLogin(result.loginData);
          } else {
              console.log('No saved credentials found');
          }
      });
  } else if (message.action === 'saveCredentials') {
      const loginData = { username: message.username, password: message.password };
      chrome.storage.sync.set({ loginData }, () => {
          console.log('Credentials saved');
          redirectToLogin(loginData);
      });
  }
});

function redirectToLogin(loginData) {
  chrome.tabs.create({ url: 'https://vtop.vitbhopal.ac.in/vtop/login' }, (newTab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === newTab.id && changeInfo.status === 'complete') {
              console.log('Login page loaded');
              chrome.scripting.executeScript({
                  target: { tabId: newTab.id },
                  func: autofillLogin,
                  args: [loginData]
              }, () => {
                  console.log('Content script executed');
                  chrome.tabs.onUpdated.removeListener(listener);
              });
          }
      });
  });
}

function autofillLogin(loginData) {
  document.getElementById('username').value = loginData.username;
  document.getElementById('password').value = loginData.password;
  alert('Please solve the CAPTCHA manually to proceed.');
}
