/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {isolatedSiteTest} from '../../fixtures/isolatedSiteTest';
import {loginTest} from '../../fixtures/loginTest';
import {pageEditorPagesTest} from '../../fixtures/pageEditorPagesTest';
import {styleBookPageTest} from '../../fixtures/styleBookPageTest';
import {workflowPagesTest} from '../../fixtures/workflowPagesTest';
import {clickAndExpectToBeVisible} from '../../utils/clickAndExpectToBeVisible';
import getRandomString from '../../utils/getRandomString';
import {blogsPagesTest} from '../blogs-web/fixtures/blogsPagesTest';

const test = mergeTests(
	blogsPagesTest,
	isolatedSiteTest,
	loginTest(),
	pageEditorPagesTest,
	styleBookPageTest,
	workflowPagesTest
);

test('Add a heading fragment and view the display page templates is shown in preview type selector', async ({
	displayPageTemplatesPage,
	page,
	pageEditorPage,
	site,
	styleBooksPage,
}) => {
	const displayPageTemplateNameBlogsEntry = 'Blogs ' + getRandomString();
	const displayPageTemplateNameCategory = 'Category ' + getRandomString();
	const displayPageTemplateNameDocuments = 'Documents ' + getRandomString();
	const displayPageTemplateNameWebContent1 = 'Web-1 ' + getRandomString();
	const displayPageTemplateNameWebContent2 = 'Web-2 ' + getRandomString();
	const styleBookName = getRandomString();

	const placeHeadingFragmentAndSelectText = async () => {
		await pageEditorPage.addFragment(
			'Basic Components',
			'Heading',
			page.locator('#page-editor div').first()
		);

		await page.getByLabel('Browser').click();
		await page.getByLabel('Select Heading').click();
		await page.getByLabel('Select element-text').click();
	};

	await test.step('Create and publish a new page template for web content article and basic web content 1', async () => {
		await displayPageTemplatesPage.goto(site.friendlyUrlPath);

		await displayPageTemplatesPage.createTemplate({
			contentSubtype: 'Basic Web Content',
			contentType: 'Web Content Article',
			name: displayPageTemplateNameWebContent1,
		});

		await displayPageTemplatesPage.editTemplate(
			displayPageTemplateNameWebContent1
		);

		await placeHeadingFragmentAndSelectText();

		await page.getByLabel('Field').selectOption('JournalArticle_title');

		await displayPageTemplatesPage.publishTemplate();
	});

	await test.step('Create and publish a new page template for web content article and basic web content 2', async () => {
		await displayPageTemplatesPage.goto(site.friendlyUrlPath);

		await displayPageTemplatesPage.createTemplate({
			contentSubtype: 'Basic Web Content',
			contentType: 'Web Content Article',
			name: displayPageTemplateNameWebContent2,
		});

		await displayPageTemplatesPage.editTemplate(
			displayPageTemplateNameWebContent2
		);

		await placeHeadingFragmentAndSelectText();

		await page.getByLabel('Field').selectOption('JournalArticle_title');

		await displayPageTemplatesPage.publishTemplate();
	});

	await test.step('Create and publish a new page template for blogs entry', async () => {
		await displayPageTemplatesPage.goto(site.friendlyUrlPath);

		await displayPageTemplatesPage.createTemplate({
			contentType: 'Blogs Entry',
			name: displayPageTemplateNameBlogsEntry,
		});

		await displayPageTemplatesPage.editTemplate(
			displayPageTemplateNameBlogsEntry
		);

		await placeHeadingFragmentAndSelectText();

		await page.getByLabel('Source').selectOption('structure');

		await page.getByLabel('Field').selectOption('BlogsEntry_content');

		await displayPageTemplatesPage.publishTemplate();
	});

	await test.step('Create and publish a new page template for document and basic document', async () => {
		await displayPageTemplatesPage.goto(site.friendlyUrlPath);

		await displayPageTemplatesPage.createTemplate({
			contentSubtype: 'Basic Document',
			contentType: 'Document',
			name: displayPageTemplateNameDocuments,
		});

		await displayPageTemplatesPage.editTemplate(
			displayPageTemplateNameDocuments
		);

		await placeHeadingFragmentAndSelectText();

		await page.getByLabel('Source').selectOption('structure');

		await page.getByLabel('Field').selectOption('FileEntry_authorName');

		await displayPageTemplatesPage.publishTemplate();
	});

	await test.step('Create and publish a new page template for category', async () => {
		await displayPageTemplatesPage.goto(site.friendlyUrlPath);

		await displayPageTemplatesPage.createTemplate({
			contentType: 'Category',
			name: displayPageTemplateNameCategory,
		});

		await displayPageTemplatesPage.editTemplate(
			displayPageTemplateNameCategory
		);

		await placeHeadingFragmentAndSelectText();

		await page.getByLabel('Source').selectOption('structure');

		await page.getByLabel('Field').selectOption('AssetCategory_name');

		await displayPageTemplatesPage.publishTemplate();
	});

	await test.step('Create style book and view the display page template is selected in the preview type selector', async () => {
		await styleBooksPage.goto(site.friendlyUrlPath);

		await styleBooksPage.createStyleBook(styleBookName);
		await styleBooksPage.publishStyleBook();

		await styleBooksPage.editStyleBook(styleBookName);

		await expect(
			page.getByRole('button', {name: 'Display Page Templates'})
		).toBeVisible();
	});

	await test.step('View the items shown in dropdown menu of preview item selector then change the preview item for each display page template', async () => {
		const selectOptionAndUpdateColor = async (
			selectButton: string,
			selectMenuItem: string,
			colorHEX: string,
			colorRGB: string
		) => {
			await page.getByRole('button', {name: selectButton}).click();
			await page.getByRole('menuitem', {name: selectMenuItem}).click();

			await styleBooksPage.updateTokenInputColor('Body Color', colorHEX);

			expect(page.getByText('Saved')).toBeVisible();

			const heading = page
				.frameLocator('iframe')
				.getByRole('heading', {name: 'Heading Example'});

			const fragmentColor = await heading.evaluate((element) => {
				const computedStyle = window.getComputedStyle(element);

				return computedStyle.color;
			});

			expect(fragmentColor).toBe(colorRGB);
		};

		await page.getByRole('button', {name: 'Color System'}).click();
		await page.getByRole('menuitem', {name: 'General'}).click();

		await selectOptionAndUpdateColor(
			displayPageTemplateNameCategory,
			displayPageTemplateNameCategory,
			'#227777',
			'rgb(34, 119, 119)'
		);

		await styleBooksPage.updateTokenInputColor('Body Color', '#227777');

		expect(page.getByText('Saved')).toBeVisible();

		await selectOptionAndUpdateColor(
			displayPageTemplateNameCategory,
			displayPageTemplateNameDocuments,
			'#556622',
			'rgb(85, 102, 34)'
		);

		await selectOptionAndUpdateColor(
			displayPageTemplateNameDocuments,
			displayPageTemplateNameBlogsEntry,
			'#995511',
			'rgb(153, 85, 17)'
		);

		await selectOptionAndUpdateColor(
			displayPageTemplateNameBlogsEntry,
			displayPageTemplateNameWebContent2,
			'#666666',
			'rgb(102, 102, 102)'
		);
	});

	await test.step('View the more button to select a display page template from select modal and change preview', async () => {
		await clickAndExpectToBeVisible({
			autoClick: true,
			target: page.getByRole('button', {name: 'More'}),
			trigger: page.getByRole('button', {
				name: displayPageTemplateNameWebContent2,
			}),
		});

		await page
			.locator('iframe[title="Select"]')
			.contentFrame()
			.getByRole('button', {
				name: 'Select ' + displayPageTemplateNameWebContent1,
			})
			.click();

		const loadingAnimation = page.locator('.loading-animation').first();
		await loadingAnimation.waitFor();
		await loadingAnimation.waitFor({state: 'hidden'});

		await styleBooksPage.updateTokenInputColor('Body Color', '#005566');

		expect(page.getByText('Saved')).toBeVisible();

		await styleBooksPage.publishStyleBook();
	});
});
