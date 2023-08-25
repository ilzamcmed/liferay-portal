/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.feature.flag.web.internal.jaxrs.application;

import com.liferay.feature.flag.web.internal.feature.flag.FeatureFlagsBagProvider;
import com.liferay.feature.flag.web.internal.company.feature.flags.CompanyFeatureFlags;
import com.liferay.feature.flag.web.internal.company.feature.flags.CompanyFeatureFlagsProvider;
import com.liferay.feature.flag.web.internal.model.FeatureFlag;
import com.liferay.feature.flag.web.internal.model.FeatureFlagDisplay;
import com.liferay.feature.flag.web.internal.model.FeatureFlagWrapper;
import com.liferay.petra.function.transform.TransformUtil;
import com.liferay.portal.kernel.util.ArrayUtil;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.Portal;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.jaxrs.whiteboard.JaxrsWhiteboardConstants;

/**
 * @author Drew Brokke
 */
@Component(
	property = {
		JaxrsWhiteboardConstants.JAX_RS_APPLICATION_BASE + "=/com-liferay-feature-flag-web",
		JaxrsWhiteboardConstants.JAX_RS_NAME + "=com.liferay.feature.flag.web.internal.jaxrs.application.FeatureFlagApplication",
		"auth.verifier.auth.verifier.PortalSessionAuthVerifier.urls.includes=/*",
		"auth.verifier.guest.allowed=false", "liferay.oauth2=false"
	},
	service = Application.class
)
public class FeatureFlagApplication extends Application {

	@Path("/set-enabled")
	@POST
	public Response confirm(
		@Context HttpServletRequest httpServletRequest,
		@Context HttpServletResponse httpServletResponse,
		@FormParam("companyId") long companyId,
		@FormParam("enabled") boolean enabled, @FormParam("key") String key) {

		long companyId = _portal.getCompanyId(httpServletRequest);

		_companyFeatureFlagsProvider.setEnabled(companyId, key, enabled);

		CompanyFeatureFlags companyFeatureFlags =
			_companyFeatureFlagsProvider.getOrCreateCompanyFeatureFlags(
				companyId);

		List<FeatureFlag> dependencyFeatureFlags = TransformUtil.transform(
			_getFeatureFlagDependencies(companyFeatureFlags, key),
			this::_toRawFeatureFlag);

		return Response.ok(
			HashMapBuilder.put(
				"dependentFeatureFlags",
				TransformUtil.transform(
					dependencyFeatureFlags,
					featureFlag -> new FeatureFlagDisplay(
						TransformUtil.transform(
							_getFeatureFlagDependencies(
								companyFeatureFlags, featureFlag.getKey()),
							this::_toRawFeatureFlag),
						featureFlag, httpServletRequest.getLocale()))
			).build(),
			MediaType.APPLICATION_JSON
		).build();
	}

	public Set<Object> getSingletons() {
		return Collections.singleton(this);
	}

	private List<FeatureFlag> _getFeatureFlagDependencies(
		CompanyFeatureFlags companyFeatureFlags, String key) {

		return companyFeatureFlags.getFeatureFlags(
			featureFlag -> ArrayUtil.contains(
				featureFlag.getDependencyKeys(), key));
	}

	private FeatureFlag _toRawFeatureFlag(FeatureFlag featureFlag) {
		Class<?> featureFlagWrapperClass = FeatureFlagWrapper.class;

		while (featureFlagWrapperClass.isInstance(featureFlag)) {
			featureFlag = ((FeatureFlagWrapper)featureFlag).getFeatureFlag();
		}

		return featureFlag;
	}

	@Reference
	private FeatureFlagsBagProvider _featureFlagsBagProvider;

}