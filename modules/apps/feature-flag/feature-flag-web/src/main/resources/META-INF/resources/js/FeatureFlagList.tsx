/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {sub} from 'frontend-js-web';
import React, {useState} from 'react';

import FeatureFlagToggle from './FeatureFlagToggle';
import {TFeatureFlags, defaultDataSetProps, featureFlagItem} from './utils/fds';

interface Props {
	featureFlags: Array<TFeatureFlags>;
}

const FeatureFlagList: React.FC<Props> = ({featureFlags}) => {
	const [items, setItems] = useState(featureFlags);

	const featureFlagsDataRenderer = (
		values: featureFlagItem<TFeatureFlags>
	) => {
		const {
			companyId,
			dependenciesFulfilled,
			dependencyKeys,
			description,
			enabled,
			key,
			title,
		} = values.itemData;

		const dependency = dependencyKeys.map((dep: string) => dep);

		return (
			<div
				className="align-items-start d-flex justify-content-between"
				key={key}
			>
				<div>
					<strong>{title}</strong>

					<span className="text-muted"> ({key})</span>

					<p className="mb-1">{description}</p>

					{!!dependencyKeys.length && (
						<p>
							{sub(Liferay.Language.get('dependencies-x'), [
								(dependency as unknown) as string,
							])}
						</p>
					)}
				</div>

				<FeatureFlagToggle
					ariaDescribedBy={description}
					companyId={companyId}
					disabled={!dependenciesFulfilled}
					featureFlagKey={key}
					inputName={key}
					labelOff={Liferay.Language.get('disabled')}
					labelOn={Liferay.Language.get('enabled')}
					onItemsChange={(newItems) =>
						setItems((items) =>
							items.map((item) => {
								const newItem = newItems.find(
									(newItem) => newItem.key === item.key
								);

								if (newItem) {
									return newItem;
								}

								return item;
							})
						)
					}
					toggled={enabled}
				/>
			</div>
		);
	};

	const dataSetProps = {
		...defaultDataSetProps,
		customDataRenderers: {
			featureFlagsDataRenderer,
		},
		filters: [
			{
				label: Liferay.Language.get('enabled'),
				value: 'enabled', // Add filtering from backend
			},
			{
				label: Liferay.Language.get('disabled'),
				value: 'disabled', // Add filtering from backend
			},
		],
		id: 'FeatureFlagFDSViews',
		items,
		sort: [], // Add sorting from backend
		views: [
			{
				contentRenderer: 'list',
				name: 'list',
				schema: {
					titleRenderer: {
						component: featureFlagsDataRenderer,
					},
				},
				thumbnail: 'list',
			},
		],
	};

	return <FrontendDataSet {...dataSetProps} />;
};

export default FeatureFlagList;
