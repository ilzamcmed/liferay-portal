/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page, expect, mergeTests} from '@playwright/test';

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
	styleBooksPage: StyleBooksPage,
	templateName: string
) => {
	const publishButton = page.getByRole('button', {
		name: 'Publish',
	});

	await styleBooksPage.goto();
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

	// Publish and verify the style

	const publishTemplate = async () => {
		await publishButton.waitFor();
		await publishButton.click();
		await page
			.getByRole('dialog')
			.getByRole('button', {name: /publish/i})
			.click();
		await waitForSuccessAlert(page, 'Success:Your request');
	};
	await publishTemplate();

	await displayPageTemplatesPage.goto();

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

test('Create Style Book and View the Fragments is selected in the preview type selector', async ({
	page,
	styleBooksPage,
}) => {
	const publishButton = page.getByRole('button', {
		name: 'Publish',
	});
	await styleBooksPage.goto();
	await styleBooksPage.createStyleBook('Test Style Book Name');
	await publishButton.click();
	await page
		.getByRole('dialog')
		.getByRole('button', {name: /publish/i})
		.click();

	await page.getByRole('button', {name: /more actions/i}).click();
	await page.getByRole('menuitem', {name: 'Edit'}).click();
	await expect(page.getByRole('button', {name: 'Pages'})).toBeVisible();
});

test('Add a Heading fragment to the first display page template for Web Content Article and Basic Web Content and view the Display Page Templates is shown in preview type selector', async ({
	displayPageTemplatesPage,
	page,
	pageEditorPage,
	styleBooksPage,
}) => {
	const publishButton = page.getByRole('button', {name: 'Publish'});

	// Create and publish a new page template

	await displayPageTemplatesPage.goto();
	await displayPageTemplatesPage.createTemplate({
		contentSubtype: 'Basic Web Content',
		contentType: 'Web Content Article',
		name: 'Web Content DPT 1',
	});

	const pageTemplate = page.getByRole('link', {
		name: 'Web Content DPT 1',
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
		styleBooksPage,
		'Web Content DPT 1'
	);
});

test('Add a Heading fragment to a display page template and preview the effects on the display page template for Blogs Entry', async ({
	displayPageTemplatesPage,
	page,
	pageEditorPage,
	styleBooksPage,
}) => {
	const publishButton = page.getByRole('button', {name: 'Publish'});
	const displayPageTemplateName = getRandomString();

	// Create and publish a new page template

	await displayPageTemplatesPage.goto();
	await displayPageTemplatesPage.createTemplate({
		contentType: 'Blogs Entry',
		name: displayPageTemplateName,
	});
	const pageTemplate = page.getByRole('link', {
		name: displayPageTemplateName,
	});

	await pageTemplate.click();

	await pageEditorPage.addFragment(
		'Basic Components',
		'Heading',
		page.locator('#page-editor div').first()
	);

	await addHeading(pageEditorPage, publishButton);

	await changeStyleAndCheckPreview(
		'#995511',
		'rgb(153, 85, 17)',
		displayPageTemplatesPage,
		page,
		pageEditorPage,
		styleBooksPage,
		displayPageTemplateName
	);
});

test('Add a Heading fragment to a display page template for Document and Basic Document', async ({
	displayPageTemplatesPage,
	page,
	pageEditorPage,
	styleBooksPage,
}) => {
	const publishButton = page.getByRole('button', {name: 'Publish'});
	const displayPageTemplateName = getRandomString();

	// Create and publish a new page template

	await displayPageTemplatesPage.goto();
	await displayPageTemplatesPage.createTemplate({
		contentSubtype: 'Basic Document',
		contentType: 'Document',
		name: displayPageTemplateName,
	});
	await page
		.getByRole('link', {
			name: displayPageTemplateName,
		})
		.click();

	await pageEditorPage.addFragment(
		'Basic Components',
		'Heading',
		page.locator('#page-editor div').first()
	);

	await addHeading(pageEditorPage, publishButton);

	await changeStyleAndCheckPreview(
		'#556622',
		'rgb(85, 102, 34)',
		displayPageTemplatesPage,
		page,
		pageEditorPage,
		styleBooksPage,
		displayPageTemplateName
	);
});

test('Add a Heading fragment display page template and preview the effects on the display page template for Category', async ({
	displayPageTemplatesPage,
	page,
	pageEditorPage,
	styleBooksPage,
}) => {
	const publishButton = page.getByRole('button', {name: 'Publish'});
	const displayPageTemplateName = getRandomString();

	// Create and publish a new page template

	await displayPageTemplatesPage.goto();
	await displayPageTemplatesPage.createTemplate({
		contentType: 'Category',
		name: displayPageTemplateName,
	});
	await page.getByRole('link', {name: displayPageTemplateName}).click();

	await pageEditorPage.addFragment(
		'Basic Components',
		'Heading',
		page.locator('#page-editor div').first()
	);

	await addHeading(pageEditorPage, publishButton);

	await changeStyleAndCheckPreview(
		'#227777',
		'rgb(34, 119, 119)',
		displayPageTemplatesPage,
		page,
		pageEditorPage,
		styleBooksPage,
		displayPageTemplateName
	);
});

test('View the Items shown in dropdown menu of preview item selector then change the preview item to the first display page template', async ({
	displayPageTemplatesPage,
	page,
	pageEditorPage,
	styleBooksPage,
}) => {
	const publishButton = page.getByRole('button', {name: 'Publish'});
	await styleBooksPage.goto();
	await page.getByRole('button', {name: /more actions/i}).click();
	await page.getByRole('menuitem', {name: 'Edit'}).click();

	await page.getByRole('button', {name: 'Pages'}).click();
	await page.getByRole('menuitem', {name: 'Display Page Template'}).click();

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

	await displayPageTemplatesPage.goto();

	await page.getByRole('link', {name: 'Web Content DPT 1'}).click();
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
