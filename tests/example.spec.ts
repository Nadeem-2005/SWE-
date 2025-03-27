import { test, expect } from '@playwright/test';

test('testing title of the page',async ({page})=>{
  await page.goto('http://localhost:3000')
  await expect(page).toHaveTitle(/Connect +/)
})  

test('testing sign in', async ({ page }) => {
  await page.goto('http://localhost:3000/sign-in');

  const emailField = page.locator('input[name="identifier"]');
  await emailField.evaluate((el) => el.removeAttribute('readonly'));

  await emailField.fill('manish.r2022@vitstudent.ac.in');

  await page.locator('button:has-text("Continue")').click();

  await page.waitForURL('**/sign-in/factor-one'); 
  const passwordField = page.locator('input[name="password"]');
  await passwordField.evaluate((el) => el.removeAttribute('readonly'));

  await passwordField.fill('Thugtools23-');

  await page.locator('button:has-text("Continue")').click();

  await page.waitForURL('http://localhost:3000');
  await expect(page).toHaveURL('http://localhost:3000');
});

test('starting an instant meet',async({page})=>{

  await page.goto('http://localhost:3000/sign-in');

  const emailField = page.locator('input[name="identifier"]');
  await emailField.evaluate((el) => el.removeAttribute('readonly'));

  await emailField.fill('manish.r2022@vitstudent.ac.in');

  await page.locator('button:has-text("Continue")').click();

  await page.waitForURL('**/sign-in/factor-one'); 
  const passwordField = page.locator('input[name="password"]');
  await passwordField.evaluate((el) => el.removeAttribute('readonly'));

  await passwordField.fill('Thugtools23-');

  await page.locator('button:has-text("Continue")').click();

  await page.waitForURL('http://localhost:3000');
  await expect(page).toHaveURL('http://localhost:3000');

  const newMeet = page.locator('section.bg-orange-1:has-text("New Meeting")');
  await newMeet.click();
  

  const nextButton=page.locator('button:has-text("Start Meeting")')
  await nextButton.waitFor({state:'visible'})
  await nextButton.click()

  await page.waitForURL(/.*\/meeting\/.*/, {timeout:100000});
  await expect(page).toHaveURL(/.*\/meeting\/.*/);
})

test('schedule a meet',async({page})=>{
  await page.goto('http://localhost:3000/sign-in');

  const emailField = page.locator('input[name="identifier"]');
  await emailField.evaluate((el) => el.removeAttribute('readonly'));

  await emailField.fill('manish.r2022@vitstudent.ac.in');

  await page.locator('button:has-text("Continue")').click();

  await page.waitForURL('**/sign-in/factor-one'); 
  const passwordField = page.locator('input[name="password"]');
  await passwordField.evaluate((el) => el.removeAttribute('readonly'));

  await passwordField.fill('Thugtools23-');

  await page.locator('button:has-text("Continue")').click();

  await page.waitForURL('http://localhost:3000');
  await expect(page).toHaveURL('http://localhost:3000');
  const newMeet = page.locator('section.bg-purple-1:has-text("Schedule Meeting")');
  await newMeet.click();

  const timeInput = await page.locator('input.w-full.rounded.bg-dark-3');

  const currentValue = await timeInput.getAttribute('value');

  const futureDate = new Date();
  futureDate.setMinutes(futureDate.getMinutes() + 10);

  const formattedDate = futureDate.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  await timeInput.fill(formattedDate);

  const scheduleButton = await page.locator('button:has-text("Schedule Meeting")');

  await scheduleButton.waitFor({ state: 'visible' });
  await scheduleButton.click();
})
