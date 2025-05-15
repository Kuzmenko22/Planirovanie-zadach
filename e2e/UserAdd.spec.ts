import { test, expect } from '@playwright/test';

test('создание пользователя STUDENT через форму, отображение в таблице', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/api/auth/callback/nodemailer?callbackUrl=http%3A%2F%2Flocalhost%3A3000&token=5199b48eb0d8f4345a5a387b6cd7b3b567b6d8716f8fd594e409728a064e4e3f&email=775%40mail.ru'
  );

  await page.getByRole('link', { name: 'Пользователи' }).click();
  await page.waitForURL('**/user');
  await expect(page).toHaveURL(/.*\/user/);

  await page.getByRole('button', { name: 'Добавить пользователя' }).click();

  await expect(page.locator('input[name="firstname"]')).toBeVisible();

  const email = `test_student_${Date.now()}@example.com`;

  await page.locator('input[name="firstname"]').fill('Тест');
  await page.locator('input[name="surname"]').fill('Тестов');
  await page.locator('input[name="lastname"]').fill('Тестович');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('select[name="role"]').selectOption('STUDENT');

  await page.getByRole('button', { name: 'Создать' }).click();

  await page.waitForURL('**/user');
  await page.waitForLoadState('networkidle');

  await expect(page.locator('table')).toContainText(email);
});
