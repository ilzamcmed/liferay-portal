/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export declare type TFeatureFlags = {
	companyId: string;
	dependenciesFulfilled: boolean;
	dependencyKeys: Array<string>;
	description: string;
	enabled: boolean;
	key: string;
	title: string;
};
export interface featureFlagItem<T> {
	itemData: T;
}
export declare const defaultDataSetProps: {
	actionParameterName: string;
	currentURL: string;
	customViewsEnabled: boolean;
	pagination: {
		deltas: {
			label: number;
		}[];
		initialDelta: number;
		initialPageNumber: number;
	};
	showManagementBar: boolean;
	showPagination: boolean;
	showSearch: boolean;
};
