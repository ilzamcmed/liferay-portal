/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	FrontendDataSet,

	// @ts-ignore

} from '@liferay/frontend-data-set-web';
import {sub} from 'frontend-js-web';

// import classNames from 'classnames';

import React, {useState} from 'react';

import FeatureFlagToggle from './FeatureFlagToggle';
import {TFeatureFlags, defaultDataSetProps} from './utils/fds';

interface Props {
	featureFlags: Array<TFeatureFlags>;
}

const FeatureFlagList: React.FC<Props> = ({featureFlags}) => {
	const [items, setItems] = useState(featureFlags);

	const featureFlagsDataRenderer = (values: any) => {
		
		const {
			dependenciesFulfilled,
			dependencyKeys,
			description,
			enabled,
			key,
			title,
		} = values.itemData;

		const dep = dependencyKeys.map((dep: string) => dep);

		return (
			<div className="d-flex justify-content-between" key={key}>
				<div>
					<h5>
						<strong>{title}</strong>

						<span className="text-muted"> {key}</span>
					</h5>

					<h6 className="">{description}</h6>

					{!!dependencyKeys.length && (
						<h6 className="text-default">
							{sub(Liferay.Language.get('dependencies-x'), [
								(dep as unknown) as string,
							])}
						</h6>
					)}
				</div>

				<FeatureFlagToggle
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
		filters: items,
		id: '',
		items,

		// sorts={[{direction: 'desc', key: 'dateModified'}]},

		views: [
			{
				contentRenderer: 'list',
				name: 'list',
				schema: {
					titleRenderer: {
						component: featureFlagsDataRenderer,
						label: Liferay.Language.get('title'),
						name: 'title',
						type: 'internal',
					},
				},
				thumbnail: 'list',
			},
		],
	};

	return <FrontendDataSet {...dataSetProps} />;
};

export default FeatureFlagList;
