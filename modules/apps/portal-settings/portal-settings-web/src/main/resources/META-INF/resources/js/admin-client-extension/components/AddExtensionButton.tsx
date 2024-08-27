/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import React, {useState} from 'react';

import {
	IScriptLocationOptions,
	SCRIPT_LOCATION_LABELS,
} from '../GlobalJSCETConfiguration';

interface IAddExtensionButton {
	addGlobalJSCET: (scriptLocation: IScriptLocationOptions) => unknown;
	isReadOnly: boolean;
	portletNamespace: string;
}

export const AddExtensionButton = ({
	addGlobalJSCET,
	isReadOnly,
	portletNamespace,
}: IAddExtensionButton) => {
	const [active, setActive] = useState(false);
	const dropdownTriggerId = `${portletNamespace}_GlobalJSCETsConfigurationAddExtensionButton`;

	return (
		<ClayDropDownWithItems
			active={active}
			items={SCRIPT_LOCATION_LABELS.map(({label, scriptLocation}) => ({
				label,
				onClick: () => addGlobalJSCET(scriptLocation),
			}))}
			menuElementAttrs={{
				'aria-labelledby': dropdownTriggerId,
			}}
			onActiveChange={setActive}
			trigger={
				<ClayButton
					className="c-mb-3"
					disabled={isReadOnly}
					displayType="secondary"
					type="button"
				>
					<ClayIcon className="c-mr-2" symbol="plus" />

					{Liferay.Language.get('add-javascript-client-extensions')}
				</ClayButton>
			}
		/>
	);
};
