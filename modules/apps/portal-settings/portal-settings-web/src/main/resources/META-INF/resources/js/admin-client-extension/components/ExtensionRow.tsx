/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClaySelectWithOption} from '@clayui/form';
import ClayTable from '@clayui/table';
import classNames from 'classnames';
import React, {useMemo} from 'react';

import {
	DEFAULT_LOAD_TYPE_OPTION,
	IGlobalJSCET,
	ILoadTypeOptions,
} from '../GlobalJSCETConfiguration';
import {GlobalCETCheckbox} from './GlobalCETCheckbox';
import {GlobalCETOptionsDropDown} from './GlobalCETOptionsDropDown';

export interface IExtensionRowProps {
	deleteGlobalJSCET: (globalJSCET: IGlobalJSCET) => unknown;
	globalJSCET: IGlobalJSCET;
	handleRestrictedToAdmin: (restrictedToAdmin: boolean) => void;
	order: number;
	portletNamespace: string;
	restrictedValue: boolean;
	updateGlobalJSCET: <T extends keyof IGlobalJSCET>(
		globalJSCET: IGlobalJSCET,
		propName: T,
		value: IGlobalJSCET[T]
	) => unknown;
}

export function ExtensionRow({
	deleteGlobalJSCET,
	globalJSCET,
	handleRestrictedToAdmin,
	order,
	portletNamespace,
	restrictedValue,
	updateGlobalJSCET,
}: IExtensionRowProps) {
	const disabled = globalJSCET.inherited;
	const dropdownTriggerId = `${portletNamespace}_GlobalJSCETsConfigurationOptionsButton_${globalJSCET.cetExternalReferenceCode}`;

	const LOAD_TYPE_OPTIONS: Array<{
		label: string;
		value: ILoadTypeOptions;
	}> = [
		{label: 'default', value: 'default'},
		{label: 'async', value: 'async'},
		{label: 'defer', value: 'defer'},
	];

	const getLoadTypeOptions = (scriptElementAttributesJSON: any) => {
		const loadTypeOptions = LOAD_TYPE_OPTIONS;

		if (!scriptElementAttributesJSON) {
			return loadTypeOptions;
		}

		return loadTypeOptions.filter(
			(option) => scriptElementAttributesJSON[option.label] !== false
		);
	};

	const getPredefinedLoadType = (scriptElementAttributesJSON: any) => {
		if (!scriptElementAttributesJSON) {
			return null;
		}

		if (scriptElementAttributesJSON.async) {
			return 'async';
		}
		else if (scriptElementAttributesJSON.defer) {
			return 'defer';
		}

		return null;
	};

	const scriptElementAttributesJSONString =
		globalJSCET.scriptElementAttributesJSON;

	const scriptElementAttributesJSON = useMemo(() => {
		if (!scriptElementAttributesJSONString) {
			return null;
		}

		return JSON.parse(scriptElementAttributesJSONString);
	}, [scriptElementAttributesJSONString]);

	const dropdownItems = [
		{
			label: Liferay.Language.get('delete'),
			onClick: () => deleteGlobalJSCET(globalJSCET),
			symbolLeft: 'trash',
		},
	];

	const predefinedLoadType = getPredefinedLoadType(
		scriptElementAttributesJSON
	);

	if (predefinedLoadType && predefinedLoadType !== globalJSCET.loadType) {
		updateGlobalJSCET(
			globalJSCET,
			'loadType',
			predefinedLoadType as ILoadTypeOptions
		);
	}

	return (
		<ClayTable.Row
			className={classNames({disabled})}
			key={globalJSCET.cetExternalReferenceCode}
		>
			<ClayTable.Cell>{order}</ClayTable.Cell>

			<ClayTable.Cell expanded>{globalJSCET.name}</ClayTable.Cell>

			<ClayTable.Cell noWrap>
				<ClaySelectWithOption
					className="load-type-select"
					defaultValue={
						globalJSCET.loadType ||
						predefinedLoadType ||
						DEFAULT_LOAD_TYPE_OPTION
					}
					disabled={disabled || !!predefinedLoadType}
					onChange={(event) =>
						updateGlobalJSCET(
							globalJSCET,
							'loadType',
							event.target.value as ILoadTypeOptions
						)
					}
					options={getLoadTypeOptions(scriptElementAttributesJSON)}
					sizing="sm"
				/>
			</ClayTable.Cell>

			<ClayTable.Cell className="table-column-text-center">
				<GlobalCETCheckbox
					onChange={handleRestrictedToAdmin(
						globalJSCET.restrictedToAdmin
					)}
					value={restrictedValue}
				/>
			</ClayTable.Cell>

			<ClayTable.Cell>
				{disabled ? null : (
					<GlobalCETOptionsDropDown
						dropdownItems={dropdownItems}
						dropdownTriggerId={dropdownTriggerId}
					/>
				)}
			</ClayTable.Cell>
		</ClayTable.Row>
	);
}
