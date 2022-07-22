import { expect, test } from '@playwright/test';

const baseUrl = 'http://localhost:3000/';

test('user journey with login', async ({ page }) => {
  await page.goto(baseUrl);
  // go to log  in
  await page.locator('data-test-id=login-index').click();
  await expect(page).toHaveURL(`${baseUrl}login`);
  // log in as test
  await page.fill('data-test-id=username', 'test');
  await page.fill('data-test-id=password', 'test');
  await page.locator('data-test-id=login').click();
  //  discovery page
  await expect(page).toHaveURL(`${baseUrl}discovery`);
  // click on "filters"
  await page.locator('data-test-id=filters').click();
  const title = page.locator('h1');
  await expect(title).toHaveText('Start discovering');
  // move one of the sliders
  await page.locator('div:nth-child(4) > .rc-slider').click();
  // go back to the discovery page
  await page.locator('data-test-id=tick').click();
  await expect(page).toHaveURL(`${baseUrl}discovery`);
  // go to the swiping mode
  await page.locator('img[alt="filter"]').nth(1).click();
  await expect(page).toHaveURL('http://localhost:3000/discovery-playmode');
  // go to a buddy profile from the discovery mode
  await page.locator('.css-1dvgo2x-UserProfile').click();
  await page
    .locator('text=View Profile1, 12 0 km awayrockbluesjazz100% match >> a')
    .click();
  await expect(page).toHaveURL('http://localhost:3000/users/usersbyid/9');
  // go back to the discovery
  await page.locator('img[alt="back button"]').click();
  await expect(page).toHaveURL('http://localhost:3000/discovery');
  // click on the chat button on the bottom
  await page.locator('data-test-id=to-chats').click();
  await expect(page).toHaveURL(`${baseUrl}chats/overview`);
  await expect(title).toHaveText('Chats');
  // click on the avatar
  await page.locator('data-test-id=user-avatar').click();
  await expect(page).toHaveURL(`${baseUrl}users/private-profile`);
  //  try to update the name to Test1 Test1
  await page.locator('data-test-id=update-user-info').click();
  await expect(page).toHaveURL(
    `${baseUrl}users/update-private-profile/personal-info`,
  );
  await page.fill('data-test-id=update-first-name', 'Test 1');
  await page.fill('data-test-id=update-last-name', 'Test 1');
  await page.locator('data-test-id=confirm').click();
  await expect(page).toHaveURL(`${baseUrl}users/private-profile`);
  // go to a buddy profile
  await page.goto(`${baseUrl}users/usersbyid/5`);
  // go to the conversation with the user 5 and write a message
  await page.locator('data-test-id=send-message').click();
  await expect(page).toHaveURL(`${baseUrl}chats/13`);
  // Click textarea
  await page.locator('textarea').click();
  // Fill textarea
  await page.locator('textarea').fill('Hi');
  // Press Enter
  await page.locator('textarea').press('Enter');
  // get the suggestion of the closest studio
  await page.locator('data-test-id=location-image').click();
  await expect(page).toHaveURL('http://localhost:3000/chats/studios-map/13');
  await expect(title).toHaveText('Closest studio to both of you');
  // Go to the profile and log out
  // Click on the avatar
  await page.locator('[data-test-id="user-avatar"]').click();
  await expect(page).toHaveURL('http://localhost:3000/users/private-profile');
  // Click on the logout button
  await page.locator('a:has-text("Log out")').click();
  await expect(page).toHaveURL('http://localhost:3000/');
});
