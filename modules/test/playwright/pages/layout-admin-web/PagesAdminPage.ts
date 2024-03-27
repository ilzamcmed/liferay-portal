/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Page} from '@playwright/test';

import {clickAndExpectToBeHidden} from '../../utils/clickAndExpectToBeHidden';
import {clickAndExpectToBeVisible} from '../../utils/clickAndExpectToBeVisible';
import {PORTLET_URLS} from '../../utils/portletUrls';

export class PagesAdminPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto(siteUrl?: Site['friendlyUrlPath']) {
		await this.page.goto(
			`/group${siteUrl || '/guest'}${PORTLET_URLS.pages}`
		);
	}

	async gotoPagesConfiguration() {
		await this.goto();

		await clickAndExpectToBeVisible({
			autoClick: true,
			target: this.page.getByRole('menuitem', {name: 'Configuration'}),
			trigger: this.page.getByTestId('headerOptions'),
		});
	}

	async selectThemeCSSClientExtension(clientExtensionName: string) {
		await this.gotoPagesConfiguration();

		await this.page
			.locator(
				'#_com_liferay_layout_admin_web_portlet_GroupPagesPortlet_themeCSSReplacementExtension'
			)
			.click();

		const iframe = this.page.locator(
			'#selectThemeCSSClientExtension_iframe_'
		);

		await iframe.waitFor({
			state: 'visible',
		});

		const clientExtension = this.page
			.frameLocator('#selectThemeCSSClientExtension_iframe_')
			.getByTestId('rowItemContent')
			.filter({hasText: clientExtensionName});

		await clickAndExpectToBeHidden({
			target: iframe,
			trigger: clientExtension,
		});

		await this.page
			.getByRole('button', {
				exact: true,
				name: 'Save',
			})
			.click();
	}

	async selectJavaScriptClientExtension(clientExtensionName: string) {
		await this.gotoPagesConfiguration();

		await this.page.getByRole('tab', {name: 'JavaScript'}).click();

		await this.page.getByRole('button', {name: 'Add JavaScript Client Extensions' }).click();

		await this.page.getByText('In Page Head').click();

		const iframe = this.page.locator(
			'#selectGlobalJSCETs_iframe_'
		);

		await iframe.waitFor({
			state: 'visible',
		});

		await this.page
			.frameLocator('#selectGlobalJSCETs_iframe_').getByLabel(clientExtensionName).check();

		const addButton = this.page.getByRole('button', {exact: true, name: 'Add' })

		const clientExtensionEntry = this.page.getByRole('cell', {name: clientExtensionName})

		await clickAndExpectToBeVisible({target: clientExtensionEntry, trigger: addButton })

		await this.page.getByRole('button', {exact: true, name: 'Save',}).click();
	}
}
