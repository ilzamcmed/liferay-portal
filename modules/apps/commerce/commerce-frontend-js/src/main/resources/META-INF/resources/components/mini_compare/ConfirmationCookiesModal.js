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

import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import {Text} from '@clayui/core';
import {ClayToggle} from '@clayui/form';
import ClayModal from '@clayui/modal';
import {COOKIE_TYPES, checkConsent, setCookie, sub} from 'frontend-js-web';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

const ConfirmationCookiesModal = ({
	observer,
	onClose,
	onDeclineFunctionalCookie,
}) => {
	const [functionalCookies, setFunctionalCookies] = useState(true);
	const [performanceCookies, setPerformanceCookies] = useState(
		checkConsent(COOKIE_TYPES.PERFORMANCE)
	);
	const [personalizationCookies, setPersonalizationCookies] = useState(
		checkConsent(COOKIE_TYPES.PERSONALIZATION)
	);
	const [displayAlert, setDisplayAlert] = useState(true);

	const alertCookies = (alertType, alertTitle, alertMessage) => {
		Liferay.Util.openToast({
			message: alertMessage,
			title: alertTitle,
			toastProps: {
				autoClose: 5000,
			},
			type: alertType,
		});
	};

	const handleSetCookies = ({functional, performance, personalization}) => {
		setCookie(
			'CONSENT_TYPE_FUNCTIONAL',
			functional,
			COOKIE_TYPES.FUNCTIONAL
		);

		setCookie(
			'CONSENT_TYPE_PERFORMANCE',
			performance,
			COOKIE_TYPES.PERFORMANCE
		);

		setCookie(
			'CONSENT_TYPE_PERSONALIZATION',
			personalization,
			COOKIE_TYPES.PERSONALIZATION
		);
	};

	const handleConfirm = () => {
		handleSetCookies({
			functionalCookies,
			performanceCookies,
			personalizationCookies,
		});
		if (!functionalCookies) {
			alertCookies(
				'warning',
				Liferay.Language.get('commerce-cookies-rejected'),
				Liferay.Language.get('commerce-cookies-rejected-description')
			);
			onDeclineFunctionalCookie();
		}
		else {
			alertCookies(
				'success',
				Liferay.Language.get('commerce-cookies-accepted'),
				Liferay.Language.get('commerce-cookies-accepted-description')
			);
		}
		onClose();
	};

	const handleDeclineAll = () => {
		handleSetCookies({
			functionalCookies: false,
			performanceCookies: false,
			personalizationCookies: false,
		});
		setFunctionalCookies(false);
		setPerformanceCookies(false);
		setPersonalizationCookies(false);
		alertCookies(
			'warning',
			Liferay.Language.get('commerce-cookies-rejected'),
			Liferay.Language.get('commerce-cookies-rejected-description')
		);
		onClose();
		onDeclineFunctionalCookie();
	};

	const handleAcceptAll = () => {
		handleSetCookies({
			functionalCookies: true,
			performanceCookies: true,
			personalizationCookies: true,
		});
		setFunctionalCookies(true);
		setPerformanceCookies(true);
		setPersonalizationCookies(true);
		alertCookies(
			'success',
			Liferay.Language.get('commerce-cookies-accepted'),
			Liferay.Language.get('commerce-cookies-accepted-description')
		);
		onClose();
	};

	const CookieComponent = ({
		description,
		necessaryCookie = false,
		onToggle,
		title,
		toggled,
	}) => {
		return (
			<div>
				<div className="d-flex justify-content-between">
					<Text as="p" monospaced weight="bold">
						{title}
					</Text>

					{necessaryCookie ? (
						<Text as="p" color="primary">
							{Liferay.Language.get('always-active')}
						</Text>
					) : (
						<ClayToggle onToggle={onToggle} toggled={toggled} />
					)}
				</div>

				<Text as="p">{description}</Text>
			</div>
		);
	};

	return (
		<ClayModal className="cookies-modal" observer={observer}>
			<div className="minium-frame">
				<ClayModal.Header>
					{Liferay.Language.get('product-comparison-cookies-title')}
				</ClayModal.Header>

				<ClayModal.Body>
					{displayAlert && (
						<ClayAlert
							displayType="info"
							onClose={() => setDisplayAlert(false)}
							title={`${Liferay.Language.get('info')}:`}
						>
							<span
								dangerouslySetInnerHTML={{
									__html: sub(
										Liferay.Language.get(
											'commerce-info-cookies-alert-x'
										),
										`<strong>${Liferay.Language.get(
											'cookies-title[CONSENT_TYPE_FUNCTIONAL]'
										)}</strong>`
									),
								}}
							/>
						</ClayAlert>
					)}

					<CookieComponent
						description={Liferay.Language.get(
							'cookies-description[CONSENT_TYPE_NECESSARY]'
						)}
						necessaryCookie
						title={Liferay.Language.get(
							'cookies-title[CONSENT_TYPE_NECESSARY]'
						)}
					/>

					<CookieComponent
						description={Liferay.Language.get(
							'cookies-description[CONSENT_TYPE_FUNCTIONAL]'
						)}
						onToggle={() =>
							setFunctionalCookies(!functionalCookies)
						}
						title={Liferay.Language.get(
							'cookies-title[CONSENT_TYPE_FUNCTIONAL]'
						)}
						toggled={functionalCookies}
					/>

					<CookieComponent
						description={Liferay.Language.get(
							'cookies-description[CONSENT_TYPE_PERFORMANCE]'
						)}
						onToggle={() =>
							setPerformanceCookies(!performanceCookies)
						}
						title={Liferay.Language.get(
							'cookies-title[CONSENT_TYPE_PERFORMANCE]'
						)}
						toggled={performanceCookies}
					/>

					<CookieComponent
						description={Liferay.Language.get(
							'cookies-description[CONSENT_TYPE_PERSONALIZATION]'
						)}
						onToggle={() =>
							setPersonalizationCookies(!personalizationCookies)
						}
						title={Liferay.Language.get(
							'cookies-title[CONSENT_TYPE_PERSONALIZATION]'
						)}
						toggled={personalizationCookies}
					/>
				</ClayModal.Body>

				<ClayModal.Footer
					last={
						<ClayButton.Group spaced>
							<ClayButton
								displayType="confirm"
								onClick={handleConfirm}
							>
								{Liferay.Language.get('confirm')}
							</ClayButton>

							<ClayButton
								displayType="secondary"
								onClick={handleAcceptAll}
							>
								{Liferay.Language.get('accept-all')}
							</ClayButton>

							<ClayButton
								displayType="primary"
								onClick={handleDeclineAll}
							>
								{Liferay.Language.get('decline-all')}
							</ClayButton>
						</ClayButton.Group>
					}
				/>
			</div>
		</ClayModal>
	);
};

ConfirmationCookiesModal.propTypes = {
	observer: PropTypes.any,
	onClose: PropTypes.func,
	onDeclineFunctionalCookie: PropTypes.func,
};

export default ConfirmationCookiesModal;
