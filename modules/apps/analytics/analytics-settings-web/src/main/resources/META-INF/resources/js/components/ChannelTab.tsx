/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {Text} from '@clayui/core';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import {ClayCheckbox, ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayManagementToolbar from '@clayui/management-toolbar';
import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';
import ClayTable from '@clayui/table';
import React, {useEffect, useState} from 'react';

interface IChannelTab {
	description?: string;
}

const filterItems = [
	// TODO: Replace strings on label for Langs

	{label: 'Channel Name', onClick: () => alert('Filter clicked')},
	{label: 'Related Site', onClick: () => alert('Filter clicked')},
	{label: 'Assigned Property', onClick: () => alert('Filter clicked')},
];

const mockedData = [
	{
		id: '1',
		checked: false,
		name: 'beryl 1',
		property: 'property 1',
		relatedSite: 'site 1',
	},
	{
		id: '2',
		checked: false,
		name: 'beryl 2',
		property: 'property 2',
		relatedSite: 'site 2',
	},
	{
		id: '3',
		checked: false,
		name: 'beryl 3',
		property: 'property 3',
		relatedSite: 'site 3',
	},
	{
		id: '4',
		checked: false,
		name: 'beryl 4',
		property: 'property 4',
		relatedSite: 'site 4',
	},
];

const ChannelTab: React.FC<IChannelTab> = () => {
	const [searchMobile, setSearchMobile] = useState(false);
	const [delta, setDelta] = useState(5);

	const deltas = [
		{
			href: '#1',
			label: 1,
		},
		{
			label: 2,
		},
		{
			href: '#3',
			label: 3,
		},
		{
			label: 4,
		},
	];

	const [checked, setChecked] = useState(false);
	const [dinamico, setDinamico] = useState([]);

	useEffect(() => {
		setDinamico(mockedData);
	}, []);

	function handleCheckboxChange(id) {
		setDinamico(
			dinamico.map((dinamico) =>
				dinamico.id === id
					? {...dinamico, checked: !dinamico.checked}
					: dinamico
			)
		);
	}

	// const handleCheckboxChange = (itemId: any) => {
	// 	const filter = mockedData.filter((id) => id === itemId);
	// 	console.log(filter);
	// };

	return (
		<>
			<div className="mt-3">
				<Text as="p" color="secondary" size={3}>
					CHANNELS can only be assigned to a single property at a
					time. Sites belonging to a channel will be automatically
					selected when a channel has been selected.
				</Text>
			</div>

			<ClayManagementToolbar>
				<ClayManagementToolbar.ItemList>
					<ClayManagementToolbar.Item>
						{/* TODO: include request to backend on onChange event when BE endpoint is done */}

						<ClayCheckbox checked={false} onChange={() => {}} />
					</ClayManagementToolbar.Item>

					<ClayDropDownWithItems
						items={filterItems}
						trigger={
							<ClayButton
								className="nav-link"
								displayType="unstyled"
							>
								<span className="navbar-breakpoint-down-d-none">
									<span className="navbar-text-truncate">
										Order
									</span>

									<ClayIcon
										className="inline-item inline-item-after"
										symbol="caret-bottom"
									/>
								</span>

								<span className="navbar-breakpoint-d-none">
									<ClayIcon symbol="filter" />
								</span>
							</ClayButton>
						}
					/>

					<ClayManagementToolbar.Item>
						<ClayButton
							className="nav-link nav-link-monospaced"
							displayType="unstyled"
							onClick={() => {}}
						>
							<ClayIcon symbol="order-arrow" />
						</ClayButton>
					</ClayManagementToolbar.Item>
				</ClayManagementToolbar.ItemList>

				<ClayManagementToolbar.Search showMobile={searchMobile}>
					<ClayInput.Group>
						<ClayInput.GroupItem>
							<ClayInput
								aria-label="Search"
								className="form-control input-group-inset input-group-inset-after"
								placeholder="Search"
								type="text"
							/>

							<ClayInput.GroupInsetItem after tag="span">
								<ClayButtonWithIcon
									className="navbar-breakpoint-d-none"
									displayType="unstyled"
									onClick={() => setSearchMobile(false)}
									symbol="times"
								/>

								<ClayButtonWithIcon
									displayType="unstyled"
									symbol="search"
									type="submit"
								/>
							</ClayInput.GroupInsetItem>
						</ClayInput.GroupItem>
					</ClayInput.Group>
				</ClayManagementToolbar.Search>

				<ClayManagementToolbar.ItemList>
					<ClayManagementToolbar.Item className="navbar-breakpoint-d-none">
						<ClayButton
							className="nav-link nav-link-monospaced"
							displayType="unstyled"
							onClick={() => setSearchMobile(true)}
						>
							<ClayIcon symbol="search" />
						</ClayButton>
					</ClayManagementToolbar.Item>
				</ClayManagementToolbar.ItemList>
			</ClayManagementToolbar>

			<ClayTable>
				<ClayTable.Head>
					<ClayTable.Row>
						<ClayTable.Cell className="w-auto"></ClayTable.Cell>

						<ClayTable.Cell headingCell>
							Channel Name
						</ClayTable.Cell>

						<ClayTable.Cell headingCell>
							Related Site
						</ClayTable.Cell>

						<ClayTable.Cell expanded headingCell>
							Assigned Property
						</ClayTable.Cell>
					</ClayTable.Row>
				</ClayTable.Head>

				<ClayTable.Body>
					{mockedData.map((item) => (
						<ClayTable.Row key={item.id}>
							<ClayTable.Cell>
								<ClayCheckbox
									checked={item.checked}
									id={item.id}
									onChange={() =>
										handleCheckboxChange(item.id)
									}
								/>
							</ClayTable.Cell>

							<ClayTable.Cell>{item.name}</ClayTable.Cell>

							<ClayTable.Cell>{item.relatedSite}</ClayTable.Cell>

							<ClayTable.Cell>{item.property}</ClayTable.Cell>
						</ClayTable.Row>
					))}
				</ClayTable.Body>
			</ClayTable>

			<ClayPaginationBarWithBasicItems
				activeDelta={delta}
				defaultActive={1}
				deltas={[4, 8, 20, 40, 60].map((size) => ({
					label: size,
				}))}
				onDeltaChange={setDelta}
				totalItems={mockedData.length}
			/>
		</>
	);
};

export default ChannelTab;
