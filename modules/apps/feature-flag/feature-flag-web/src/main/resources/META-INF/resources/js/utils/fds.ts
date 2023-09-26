/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export type TFeatureFlags = {
	dependenciesFulfilled: boolean;
	dependencyKeys: Array<string>;
	description: string;
	enabled: boolean;
	key: string;
	title: string;
};

export const defaultDataSetProps = {
	actionParameterName: '',
	currentURL: window.location.pathname + window.location.search,
	customViewsEnabled: false,
	pagination: {
		deltas: [
			{
				label: 4,
			},
			{
				label: 8,
			},
			{
				label: 20,
			},
			{
				label: 40,
			},
			{
				label: 60,
			},
		],
		initialDelta: 0,
		initialPageNumber: 0,
	},
	showManagementBar: true,
	showPagination: true,
	showSearch: true,
};
