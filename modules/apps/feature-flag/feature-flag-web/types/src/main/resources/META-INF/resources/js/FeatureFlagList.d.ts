/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import {TFeatureFlags} from './utils/fds';
interface Props {
	featureFlags: Array<TFeatureFlags>;
}
declare const FeatureFlagList: React.FC<Props>;
export default FeatureFlagList;
