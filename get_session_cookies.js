const {Builder, By, Key, until} = require('selenium-webdriver');

const sleep = function(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

async function getSessionCookies(username, password) {
    let driver = await new Builder().forBrowser('firefox').build();

    try {
        await driver.get("https://khanacademy.org/login");
        var usernameBox = await driver.findElement(By.id('uid-identity-text-field-0-email-or-username'));
        var passwordBox = await driver.findElement(By.id('uid-identity-text-field-1-password'));

        usernameBox.sendKeys(username);
        passwordBox.sendKeys(password);

        await sleep(2000);

        passwordBox.sendKeys(Key.RETURN);

        await sleep(12000);

        return await driver.manage().getCookies();
    } finally {
        await driver.quit();
    }
}

module.exports = getSessionCookies;