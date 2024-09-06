/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page, expect} from '@playwright/test';

import fillAndClickOutside from '../../utils/fillAndClickOutside';
import {PORTLET_URLS} from '../../utils/portletUrls';
import {waitForSuccessAlert} from '../../utils/waitForSuccessAlert';

export class StyleBooksPage {
	readonly page: Page;

	readonly storyBook: Locator;

	constructor(page: Page) {
		this.page = page;

		this.storyBook = this.page.locator(
			'input[name=_com_liferay_style_book_web_internal_portlet_StyleBookPortlet_keywords][type=search]'
		);
	}

	async goto(siteUrl?: Site['friendlyUrlPath']) {
		await this.page.goto(
			`/group${siteUrl || '/guest'}${PORTLET_URLS.styleBooks}`
		);
	}

	async createStyleBook(styleBookName: string) {
		await this.page.getByRole('button', {exact: true, name: 'Add'}).click();

		await this.page.getByPlaceholder('Name').fill(styleBookName);

		await this.page.getByRole('button', {name: 'Save'}).click();

		await this.page
			.getByText('Success:Your request completed successfully.')
			.waitFor();

		const loadingAnimation = await this.page.locator(
			'.style-book-editor__page-preview .loading-animation'
		);

		await loadingAnimation.waitFor();
		await loadingAnimation.waitFor({state: 'hidden'});
	}

	async deleteStyleBook(styleBookName: string) {
		await this.storyBook.fill(styleBookName);

		await this.page.getByTitle('Search for', {exact: true}).click();

		await expect(
			this.page.getByText(`1 Result Found for "${styleBookName}"`)
		).toBeVisible();

		await this.page.getByLabel('More actions').click();

		await this.page.getByRole('menuitem', {name: 'Delete'}).click();

		await this.page.getByRole('button', {name: 'Delete'}).click();
	}

	async editStyleBook(styleBookName: string) {
		await this.storyBook.fill(styleBookName);

		await this.page.getByTitle('Search for', {exact: true}).click();

		await expect(
			this.page.getByText(`1 Result Found for "${styleBookName}"`)
		).toBeVisible();

		await this.page.getByLabel('More actions').click();

		await this.page.getByRole('menuitem', {name: 'Edit'}).click();
	}

	async updateTokenInputColor(label: string, colorHEX: string) {
		const colorInput = this.page
			.getByLabel(label)
			.getByLabel('Color')
			.locator('.layout__color-picker__input');

		await fillAndClickOutside(this.page, colorInput, colorHEX);
	}

	async publishStyleBook() {
		await this.page.getByRole('button', {name: 'Publish'}).click();

		await this.page
			.getByRole('dialog')
			.getByRole('button', {name: 'Publish'})
			.click();

		await waitForSuccessAlert(this.page, 'Success:Your request');
	}
}
