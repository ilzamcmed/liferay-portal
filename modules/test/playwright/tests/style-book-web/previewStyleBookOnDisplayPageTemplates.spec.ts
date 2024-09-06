/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page, expect, mergeTests} from '@playwright/test';

import {isolatedSiteTest} from '../../fixtures/isolatedSiteTest';
import {loginTest} from '../../fixtures/loginTest';
import {pageEditorPagesTest} from '../../fixtures/pageEditorPagesTest';
import {styleBookPageTest} from '../../fixtures/styleBookPageTest';
import {workflowPagesTest} from '../../fixtures/workflowPagesTest';
import {PageEditorPage} from '../../pages/layout-content-page-editor-web/PageEditorPage';
import {DisplayPageTemplatesPage} from '../../pages/layout-page-template-admin-web/DisplayPageTemplatesPage';
import {StyleBooksPage} from '../../pages/style-book-web/StyleBooksPage';
import fillAndClickOutside from '../../utils/fillAndClickOutside';
import getRandomString from '../../utils/getRandomString';
import {waitForSuccessAlert} from '../../utils/waitForSuccessAlert';
import {blogsPagesTest} from '../blogs-web/fixtures/blogsPagesTest';

const test = mergeTests(
	blogsPagesTest,
	isolatedSiteTest,
	loginTest(),
	pageEditorPagesTest,
	styleBookPageTest,
	workflowPagesTest
);

const addHeading = async (
	pageEditorPage: PageEditorPage,
	publishButton: Locator
) => {
	const headingId = await pageEditorPage.getFragmentId('Heading');

	expect(await pageEditorPage.isActive(headingId)).toBe(true);

	await publishButton.click();
};

const changeStyleAndCheckPreview = async (
	colorHEX: string,
	colorRGB: string,
	displayPageTemplatesPage: DisplayPageTemplatesPage,
	page: Page,
	pageEditorPage: PageEditorPage,
	site: Site,
	styleBooksPage: StyleBooksPage,
	templateName: string
) => {
	await styleBooksPage.goto(site.friendlyUrlPath);

	await page.getByRole('button', {name: /more actions/i}).click();
	await page.getByRole('menuitem', {name: 'Edit'}).click();
	await page.getByRole('button', {name: 'Color System'}).click();
	await page.getByRole('menuitem', {name: 'General'}).click();

	const colorInput = page
		.getByLabel('Body Color')
		.getByLabel('Color')
		.locator('.layout__color-picker__input');

	await fillAndClickOutside(page, colorInput, colorHEX);

	expect(page.getByText('Saved')).toBeVisible();

	const publishButton = page.getByRole('button', {
		name: 'Publish',
	});

	await publishButton.click();

	await test.step('Publish and verify the style', async () => {
		await page
			.getByRole('dialog')
			.getByRole('button', {
				name: 'Publish',
			})
			.click();
		await waitForSuccessAlert(page, 'Success:Your request');
	});

	await displayPageTemplatesPage.goto(site.friendlyUrlPath);

	await page.getByRole('link', {name: templateName}).click();
	await page.getByLabel('Page Design Options').click();
	await page.getByRole('tab', {name: 'Style Book'}).click();
	await page.getByLabel('Test Style Book Name').click();

	const headingId = await pageEditorPage.getFragmentId('Heading');

	const fragmentColor = await pageEditorPage.getFragmentStyle({
		fragmentId: headingId,
		isTopperStyle: true,
		style: 'color',
	});

	expect(fragmentColor).toBe(colorRGB);
};

test('Add a heading fragment and view the display page templates is shown in preview type selector', async ({
	displayPageTemplatesPage,
	page,
	pageEditorPage,
	site,
	styleBooksPage,
}) => {
	const publishButton = page.getByRole('button', {name: 'Publish'});
	const displaPageTemplateName = getRandomString();

	await test.step('Create style book and view the fragments is selected in the preview type selector', async () => {
		const publishButton = page.getByRole('button', {
			name: 'Publish',
		});
		await styleBooksPage.goto(site.friendlyUrlPath);

		await styleBooksPage.createStyleBook('Test Style Book Name');

		await publishButton.click();

		await page
			.getByRole('dialog')
			.getByRole('button', {name: 'Publish'})
			.click();

		await page.getByRole('button', {name: 'More actions'}).click();
		await page.getByRole('menuitem', {name: 'Edit'}).click();

		await expect(
			page.getByRole('button', {name: 'Fragments'})
		).toBeVisible();
	});

	await test.step('Create and publish a new page template for web content article and basic web content', async () => {
		await displayPageTemplatesPage.goto(site.friendlyUrlPath);
		await displayPageTemplatesPage.createTemplate({
			contentSubtype: 'Basic Web Content',
			contentType: 'Web Content Article',
			name: displaPageTemplateName,
		});

		const pageTemplate = page.getByRole('link', {
			name: displaPageTemplateName,
		});

		await pageTemplate.click();

		await pageEditorPage.addFragment(
			'Basic Components',
			'Heading',
			page.locator('#page-editor div').first()
		);

		await addHeading(pageEditorPage, publishButton);

		await changeStyleAndCheckPreview(
			'#666666',
			'rgb(102, 102, 102)',
			displayPageTemplatesPage,
			page,
			pageEditorPage,
			site,
			styleBooksPage,
			displaPageTemplateName
		);
	});

	await test.step('View the items shown in dropdown menu of preview item selector then change the preview item to the first display page template', async () => {
		await styleBooksPage.goto(site.friendlyUrlPath);

		await page.getByRole('button', {name: 'More actions'}).click();
		await page.getByRole('menuitem', {name: 'Edit'}).click();
		await page.getByRole('button', {name: 'Color System'}).click();
		await page.getByRole('menuitem', {name: 'General'}).click();

		const colorInput = page
			.getByLabel('Body Color')
			.getByLabel('Color')
			.locator('.layout__color-picker__input');

		await fillAndClickOutside(page, colorInput, '#005566');

		expect(page.getByText('Saved')).toBeVisible();

		await publishButton.waitFor();
		await publishButton.click();

		await page
			.getByRole('dialog')
			.getByRole('button', {name: /publish/i})
			.click();

		await waitForSuccessAlert(page, 'Success:Your request');

		await displayPageTemplatesPage.goto(site.friendlyUrlPath);

		await page.getByRole('link', {name: displaPageTemplateName}).click();
		await page.getByLabel('Page Design Options').click();
		await page.getByRole('tab', {name: 'Style Book'}).click();
		await page.getByLabel('Test Style Book Name').click();

		const headingId = await pageEditorPage.getFragmentId('Heading');

		const fragmentColor = await pageEditorPage.getFragmentStyle({
			fragmentId: headingId,
			isTopperStyle: true,
			style: 'color',
		});

		expect(fragmentColor).toBe('rgb(0, 85, 102)');
	});
});
