/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayTable from '@clayui/table';
import {openSelectionModal, openToast} from 'frontend-js-web';
import React, {useMemo, useState} from 'react';

import {AddExtensionButton} from './components/AddExtensionButton';
import {ExtensionRow} from './components/ExtensionRow';
import {GlobalCETOrderHelpIcon} from './components/GlobalCETOrderHelpIcon';


export type ILoadTypeOptions = 'default' | 'async' | 'defer';
export type IScriptLocationOptions = string;

export interface IGlobalJSCET {
	cetExternalReferenceCode: string;
	inherited: boolean;
	loadType?: ILoadTypeOptions;
	name: string;
	restrictedToAdmin: boolean;
	scriptElementAttributesJSON?: string;
	scriptLocation?: IScriptLocationOptions;
}

interface IGlobalJSCETGroup {
	items: Array<{
		globalJSCET: IGlobalJSCET;
		order: number;
		restrictedToAdmin: boolean;
	}>;
	scriptLocation: IScriptLocationOptions;
}

interface IProps {
	globalJSCETSelectorURL: string;
	globalJSCETs: IGlobalJSCET[];
	isReadOnly: boolean;
	portletNamespace: string;
	selectGlobalJSCETsEventName: string;
}

export const DEFAULT_LOAD_TYPE_OPTION: ILoadTypeOptions = 'default';

export const SCRIPT_LOCATION_LABELS = [
	{label: Liferay.Language.get('in-page-head'), scriptLocation: 'head'},
	{label: Liferay.Language.get('in-page-bottom'), scriptLocation: 'bottom'},
];

const DEFAULT_SCRIPT_LOCATION_OPTION: IScriptLocationOptions = 'bottom';

const GlobalJSCETConfiguration = ({
	globalJSCETSelectorURL,
	globalJSCETs: initialGlobalJSCETs,
	isReadOnly,
	portletNamespace,
	selectGlobalJSCETsEventName,
}: IProps) => {
	const fixedGlobalJSCETs = useMemo(
		() =>
			initialGlobalJSCETs.filter((globalJSCET) => globalJSCET.inherited),
		[initialGlobalJSCETs]
	);

	const [globalJSCETs, setGlobalJSCETs] = useState(() =>
		initialGlobalJSCETs.filter((globalJSCET) => !globalJSCET.inherited)
	);

	const deleteGlobalJSCET = (deletedGlobalJSCET: IGlobalJSCET) => {
		setGlobalJSCETs((previousGlobalJSCETs) =>
			previousGlobalJSCETs.filter(
				(globalJSCET) =>
					globalJSCET.cetExternalReferenceCode !==
					deletedGlobalJSCET.cetExternalReferenceCode
			)
		);
	};

	const updateGlobalJSCET = <T extends keyof IGlobalJSCET>(
		globalJSCET: IGlobalJSCET,
		propName: T,
		value: IGlobalJSCET[T]
	) => {
		setGlobalJSCETs((previousGlobalJSCETs) =>
			previousGlobalJSCETs.map((oldGlobalJSCET) =>
				oldGlobalJSCET === globalJSCET
					? {...globalJSCET, [propName]: value}
					: oldGlobalJSCET
			)
		);
	};

	const allGlobalJSCETs = useMemo(() => {
		const globalJSCETsGroups = new Map<
			IScriptLocationOptions,
			IGlobalJSCETGroup
		>();

		[...fixedGlobalJSCETs, ...globalJSCETs].forEach((globalJSCET) => {
			const groupId =
				globalJSCET.scriptLocation || DEFAULT_SCRIPT_LOCATION_OPTION;

			if (!globalJSCETsGroups.has(groupId)) {
				globalJSCETsGroups.set(groupId, {
					items: [],
					scriptLocation: groupId,
				});
			}

			const group = globalJSCETsGroups.get(groupId)!;

			group.items.push({globalJSCET, order: 0, restrictedToAdmin: true});
		});

		let order = 1;
		const sortedGroups: IGlobalJSCETGroup[] = [];

		SCRIPT_LOCATION_LABELS.forEach(({scriptLocation}) => {
			const group = globalJSCETsGroups.get(scriptLocation);

			if (!group || !group.items.length) {
				return;
			}

			sortedGroups.push({
				items: group.items.map((item) => ({...item, order: order++})),
				scriptLocation,
			});
		});

		return sortedGroups;
	}, [fixedGlobalJSCETs, globalJSCETs]);

	const addGlobalJSCET = (scriptLocation: IScriptLocationOptions) => {
		openSelectionModal<{value: string[]}>({
			multiple: true,
			onSelect(selectedItems: any) {
				if (!selectedItems.value) {
					return;
				}

				setGlobalJSCETs((previousGlobalJSCETs) => {
					const duplicatedGlobalJSCETs: IGlobalJSCET[] = [];

					const nextGlobalJSCETs: IGlobalJSCET[] = [];

					selectedItems.value.forEach((selectedItem: any) => {
						const nextGlobalJSCET: IGlobalJSCET = {
							inherited: false,
							scriptLocation,
							...(JSON.parse(selectedItem) as {
								cetExternalReferenceCode: string;
								name: string;
							}),
							restrictedToAdmin: false,
						};

						const isDuplicated = previousGlobalJSCETs.some(
							(previousGlobalJSCET) =>
								nextGlobalJSCET.cetExternalReferenceCode ===
									previousGlobalJSCET.cetExternalReferenceCode &&
								nextGlobalJSCET.scriptLocation ===
									previousGlobalJSCET.scriptLocation
						);

						if (isDuplicated) {
							duplicatedGlobalJSCETs.push(nextGlobalJSCET);
						}
						else {
							nextGlobalJSCETs.push(nextGlobalJSCET);
						}
					});

					if (duplicatedGlobalJSCETs.length) {
						openToast({
							autoClose: true,
							message: `${Liferay.Language.get(
								'some-client-extensions-were-not-added-because-they-are-already-applied-to-this-page'
							)} (${duplicatedGlobalJSCETs
								.map((globalJSCET) => globalJSCET.name)
								.join(', ')})`,
							type: 'warning',
						});
					}

					return [
						...previousGlobalJSCETs.filter(
							(previousGlobalJSCET) =>
								!nextGlobalJSCETs.some(
									(globalJSCET) =>
										globalJSCET.cetExternalReferenceCode ===
										previousGlobalJSCET.cetExternalReferenceCode
								)
						),
						...nextGlobalJSCETs,
					];
				});
			},
			selectEventName: selectGlobalJSCETsEventName,
			title: Liferay.Language.get('select-javascript-client-extensions'),
			url: globalJSCETSelectorURL,
		});
	};

	//   TODO: Handle with endpoint to post changes



	return (
		<>
			<div className="global-js-cets-configuration">
				{globalJSCETs.map(
					({cetExternalReferenceCode, loadType, scriptLocation}) => (
						<input
							key={cetExternalReferenceCode}
							name={`${portletNamespace}globalJSCETs`}
							type="hidden"
							value={`${cetExternalReferenceCode}_${
								loadType || DEFAULT_LOAD_TYPE_OPTION
							}_${scriptLocation || DEFAULT_SCRIPT_LOCATION_OPTION}`}
						/>
					)
				)}

				<AddExtensionButton
					addGlobalJSCET={addGlobalJSCET}
					isReadOnly={isReadOnly}
					portletNamespace={portletNamespace}
				/>

				{allGlobalJSCETs.length ? (
					<ClayTable>
						<ClayTable.Head>
							<ClayTable.Row>
								<ClayTable.Cell headingCell>
									<GlobalCETOrderHelpIcon
										buttonId={`${portletNamespace}_GlobalJSCETsConfigurationOrderHelpIcon`}
										title={Liferay.Language.get(
											'loading-order'
										)}
									>
										<div>
											{Liferay.Language.get(
												'client-extension-load-order-is-determined-by-inheritance-and-placement'
											)}
										</div>

										<div>
											{Liferay.Language.get(
												'admin-client-extension-tooltip'
											)}
										</div>
									</GlobalCETOrderHelpIcon>
								</ClayTable.Cell>

								<ClayTable.Cell expanded headingCell>
									{Liferay.Language.get('name')}
								</ClayTable.Cell>

								<ClayTable.Cell headingCell noWrap>
									{Liferay.Language.get('load')}
								</ClayTable.Cell>

								<ClayTable.Cell headingCell noWrap>
									{Liferay.Language.get(
										'restricted-to-admin-pages'
									)}	
								</ClayTable.Cell>

								<ClayTable.Cell headingCell>
									<span className="sr-only">
										{Liferay.Language.get('options')}
									</span>
								</ClayTable.Cell>
							</ClayTable.Row>
						</ClayTable.Head>

						<ClayTable.Body>
							{allGlobalJSCETs.map(({items, scriptLocation}) => {
								return (
									<React.Fragment key={scriptLocation}>
										<ClayTable.Row>
											<ClayTable.Cell
												className="c-py-2 list-group-header-title"
												colSpan={5}
											>
												{scriptLocation === 'bottom'
													? Liferay.Language.get(
															'page-bottom-js-client-extensions'
														)
													: Liferay.Language.get(
															'page-head-js-client-extensions'
														)}
											</ClayTable.Cell>
										</ClayTable.Row>

										{items.map(
											({
												globalJSCET,
												order,
											}) => (
												<ExtensionRow
													deleteGlobalJSCET={
														deleteGlobalJSCET
													}
													globalJSCET={globalJSCET}
													handleRestrictedToAdmin={() =>
														updateGlobalJSCET
													}
													key={
														globalJSCET.cetExternalReferenceCode
													}
													order={order}
													portletNamespace={
														portletNamespace
													}
													restrictedValue={
														globalJSCET.restrictedToAdmin
													}
													updateGlobalJSCET={
														updateGlobalJSCET
													}
												/>
											)
										)}
									</React.Fragment>
								);
							})}
						</ClayTable.Body>
					</ClayTable>
				) : (
					<p className="text-secondary">
						{Liferay.Language.get(
							'no-javascript-client-extensions-were-loaded'
						)}
					</p>
				)}
			</div>
		</>
	);
};

export default GlobalJSCETConfiguration;
