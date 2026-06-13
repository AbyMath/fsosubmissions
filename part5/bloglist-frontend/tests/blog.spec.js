import { test, expect } from '@playwright/test'
import { resetDb, createUser, loginWith } from './helpers.js'

test.describe('Blog app', () => {
  test.beforeEach(async () => {
    await resetDb()
    await createUser()
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page)
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByRole('textbox').nth(0).fill('Test Blog')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('http://test.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.locator('.blog').filter({ hasText: 'Test Blog' })
      ).toBeVisible()
    })

    test('blog can be liked twice', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByRole('textbox').nth(0).fill('Like Test')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('http://test.com')

      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog').filter({ hasText: 'Like Test' })

      await blog.getByRole('button', { name: 'view' }).click()

      const likeButton = blog.getByRole('button', { name: 'like' })

      await likeButton.click()
      await expect(blog.locator('.likes-count')).toHaveText('1')

      await likeButton.click()
      await expect(blog.locator('.likes-count')).toHaveText('2')
    })

    test('user can delete blog', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByRole('textbox').nth(0).fill('Delete Test')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('http://test.com')

      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog').filter({ hasText: 'Delete Test' })

      await blog.getByRole('button', { name: 'view' }).click()

      page.once('dialog', dialog => dialog.accept())

      await blog.getByRole('button', { name: 'remove' }).click()

      await expect(
        page.locator('.blog').filter({ hasText: 'Delete Test' })
      ).toHaveCount(0)
    })

    test('only creator sees delete button', async ({ page, request }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByRole('textbox').nth(0).fill('Owner Test')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('http://test.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'otheruser',
          name: 'Other User',
          password: 'password'
        }
      })

      await page.locator('input[type="text"]').fill('otheruser')
      await page.locator('input[type="password"]').fill('password')

      await page.getByRole('button', { name: 'login' }).click()

      const blog = page.locator('.blog').filter({ hasText: 'Owner Test' })

      await blog.getByRole('button', { name: 'view' }).click()

      await expect(
        blog.getByRole('button', { name: 'remove' })
      ).toHaveCount(0)
    })

    test('blogs are ordered by likes', async ({ page }) => {
      const createBlog = async title => {
        await page.getByRole('button', { name: 'create new blog' }).click()

        await page.getByRole('textbox').nth(0).fill(title)
        await page.getByRole('textbox').nth(1).fill('Author')
        await page.getByRole('textbox').nth(2).fill('http://test.com')

        await page.getByRole('button', { name: 'create' }).click()

        await expect(
          page.locator('.blog').filter({ hasText: title })
        ).toBeVisible()
      }

      await createBlog('Low likes')
      await createBlog('Medium likes')
      await createBlog('High likes')

      const high = page.locator('.blog').filter({ hasText: 'High likes' })
      await high.getByRole('button', { name: 'view' }).click()

      const highLike = high.getByRole('button', { name: 'like' })

      await highLike.click()
      await expect(high.locator('.likes-count')).toHaveText('1')

      await highLike.click()
      await expect(high.locator('.likes-count')).toHaveText('2')

      const medium = page.locator('.blog').filter({ hasText: 'Medium likes' })
      await medium.getByRole('button', { name: 'view' }).click()

      await medium.getByRole('button', { name: 'like' }).click()
      await expect(medium.locator('.likes-count')).toHaveText('1')

      const blogs = await page.locator('.blog').allTextContents()

      expect(blogs[0]).toContain('High likes')
      expect(blogs[1]).toContain('Medium likes')
      expect(blogs[2]).toContain('Low likes')
    })
  })
})