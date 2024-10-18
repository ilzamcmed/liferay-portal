/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Locator, Page, expect} from '@playwright/test';

import {liferayConfig} from '../../../liferay.config';

export class ClientExtensionsPage {
	readonly configuredFromTableHeader: Locator;
	readonly deleteMenuItem: Locator;
	readonly editMenuItem: Locator;
	readonly nameTableHeader: Locator;
	readonly page: Page;
	readonly searchButton: Locator;
	readonly searchInput: Locator;
	readonly viewMenuItem: Locator;

	constructor(page: Page) {

		// action buttons

		this.configuredFromTableHeader = page.getByLabel('Configured From', {
			exact: true,
		});
		this.deleteMenuItem = page.getByRole('menuitem', {
			name: 'Delete',
		});
		this.editMenuItem = page.getByRole('menuitem', {
			name: 'Edit',
		});
		this.searchButton = page.getByRole('button', {name: 'Search'});

		this.searchInput = page.getByPlaceholder('Search');
		this.viewMenuItem = page.getByRole('menuitem', {
			name: 'View',
		});

		// table columns

		this.nameTableHeader = page.getByLabel('Name', {exact: true});
		this.page = page;
	}

	async assertIsConfiguredFrom(
		clientExtensionName: string,
		configuredFrom: string
	) {
		await expect(
			this.getRowByText(clientExtensionName).locator('td').nth(3)
		).toHaveText(configuredFrom);
	}

	async assertName(clientExtensionName: string) {
		await expect(
			this.getRowByText(clientExtensionName).locator('td').nth(0)
		).toBeVisible();
	}

	async deleteClientExtension(clientExtensionName: string) {
		await this.openItemActionsDropdown(clientExtensionName);

		this.page.on('dialog', (dialog) => dialog.accept());

		await this.deleteMenuItem.click();
	}

	async editClientExtension(clientExtensionName: string) {
		await this.openItemActionsDropdown(clientExtensionName);

		await this.editMenuItem.click();

		// Wait for page to load

		expect(
			this.page.locator(
				'#cke__com_liferay_client_extension_web_internal_portlet_ClientExtensionAdminPortlet_description'
			)
		).toBeVisible();
	}

	async goto() {
		await this.page.goto(
			`${liferayConfig.environment.baseUrl}/group/guest/~/control_panel/manage` +
				'?p_p_id=com_liferay_client_extension_web_internal_portlet_ClientExtensionAdminPortlet'
		);

		// Wait for page to load

		expect(this.page.locator('.pagination-results')).toBeVisible();
	}

	async searchClientExtension(clientExtensionName: string) {
		await this.searchInput.fill(clientExtensionName);

		await this.searchButton.click();
	}

	async viewClientExtension(clientExtensionName: string) {
		await this.openItemActionsDropdown(clientExtensionName);

		await this.viewMenuItem.click();
	}

	async openItemActionsDropdown(clientExtensionName: string) {
		await this.page
			.locator('tr')
			.filter({has: this.page.getByText(clientExtensionName)})
			.getByRole('button', {
				name: 'Actions',
			})
			.click();
	}

	getRowByText(text: string) {
		return this.page
			.locator('tbody')
			.locator('tr')
			.filter({
				has: this.page.getByText(text, {exact: true}).first(),
			});
	}
}
