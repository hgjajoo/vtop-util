console.log('Content script loaded');

// Function to wait for an element to be available
function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback(element);
    } else {
        setTimeout(() => waitForElement(selector, callback), 500);
    }
}

// Function to simulate key presses
function simulateKeyPresses(keyPresses) {
    keyPresses.forEach((keyPress, index) => {
        setTimeout(() => {
            console.log(`Simulating ${keyPress.count} key presses of ${keyPress.key}`);
            for (let i = 0; i < keyPress.count; i++) {
                const event = new KeyboardEvent('keydown', { key: keyPress.key });
                document.dispatchEvent(event);
                console.log(`Key press: ${keyPress.key}`);
            }
        }, index * keyPress.delay); // Adjust the delay between key presses as needed
    });
}

// Main function to handle login automation
function automateLogin() {
    chrome.storage.sync.get(['loginData'], (result) => {
        if (result.loginData) {
            console.log('Login data found:', result.loginData);

            waitForElement('#username', (usernameField) => {
                waitForElement('#password', (passwordField) => {
                    usernameField.value = result.loginData.username;
                    passwordField.value = result.loginData.password;
                    alert('Please solve the CAPTCHA manually to proceed.');

                    // Wait for the user to solve the CAPTCHA and log in
                    const observer = new MutationObserver((mutations, observer) => {
                        if (document.querySelector('body')) {
                            console.log('Body element detected');
                            observer.disconnect();
                            setTimeout(() => {
                                console.log('Starting navigation automation');
                                simulateKeyPresses([
                                    { key: 'Tab', count: 9, delay: 1500 },
                                    { key: 'Enter', count: 1, delay: 1000 },
                                    { key: 'Tab', count: 6, delay: 1500 },
                                    { key: 'Enter', count: 1, delay: 1000 },
                                    { key: 'Tab', count: 8, delay: 1500 },
                                    { key: 'Enter', count: 1, delay: 1000 },
                                    { key: 'ArrowDown', count: 2, delay: 2500 },
                                    { key: 'Enter', count: 1, delay: 2500 },
                                    { key: 'Tab', count: 1, delay: 2500 },
                                    { key: 'Enter', count: 1, delay: 2500 }
                                ]);
                            }, 9000); 
                        }
                    });

                    observer.observe(document.body, { childList: true, subtree: true });
                });
            });
        } else {
            console.log('No login data found');
        }
    });
}

automateLogin();
