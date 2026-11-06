const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");

(async () => {
  const driver = await new Builder().forBrowser("chrome").build();
  try {
    const text = (id, value) => driver.wait(async () => (await driver.findElement(By.id(id)).getText()).includes(value), 3000);
    await driver.get(process.env.BASE_URL || "http://localhost:3000");
    const email = driver.findElement(By.id("email")), password = driver.findElement(By.id("password"));
    await email.sendKeys("test@example.com"); await password.sendKeys("pass");
    await driver.findElement(By.xpath("//button[text()='Register']")).click();
    await text("status", "Registration successful");
    await driver.findElement(By.xpath("//button[text()='Login']")).click();
    await text("status", "Login successful");
    await driver.findElement(By.id("search")).sendKeys("Laptop");
    await text("products", "Laptop");
    await driver.findElement(By.xpath("//li[contains(.,'Laptop')]//button")).click();
    await text("checkoutMessage", "Product added");
    await driver.executeScript("const e=arguments[0];e.value='2';e.dispatchEvent(new Event('change',{bubbles:true}))", await driver.findElement(By.css("input[aria-label='Laptop quantity']")));
    await text("checkoutMessage", "Cart updated");
    await driver.findElement(By.xpath("//button[text()='Remove']")).click();
    await text("checkoutMessage", "Product removed");
    await driver.findElement(By.xpath("//button[contains(.,'Add to cart')]")).click();
    await driver.findElement(By.xpath("//button[text()='Checkout']")).click();
    await text("checkoutMessage", "Order placed");
    await driver.findElement(By.xpath("//button[text()='View orders']")).click();
    await text("orders", "Order #1");
    console.log("TC01-TC07 passed");
  } finally { await driver.quit(); }
})().catch(error => { console.error(error); process.exit(1); });
