/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayCheckbox} from '@clayui/form';
import React from 'react';
interface IGlobalCETCheckbox {
	value: boolean;
	onChange: any;
}

export function GlobalCETCheckbox({onChange, value}: IGlobalCETCheckbox) {
	return <ClayCheckbox checked={value} onChange={onChange} />;
}
