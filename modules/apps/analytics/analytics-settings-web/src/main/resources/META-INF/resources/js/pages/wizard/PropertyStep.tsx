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

import ClayButton from '@clayui/button';
import {useModal} from '@clayui/modal';
import React from 'react';

import AssignModal from '../../components/AssignModal';
import BasePage from '../../components/BasePage';

const Step = () => {
	const {observer, onOpenChange, open} = useModal();

	return (
		<BasePage title={Liferay.Language.get('property')}>
			{open && (
				<AssignModal
					observer={observer}
					onCloseModal={() => onOpenChange(false)}
				/>
			)}

			<ClayButton onClick={() => onOpenChange(true)}>
				Open modal
			</ClayButton>
		</BasePage>
	);
};

export default Step;
