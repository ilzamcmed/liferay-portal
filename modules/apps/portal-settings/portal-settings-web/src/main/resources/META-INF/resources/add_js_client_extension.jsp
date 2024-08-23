<%--
/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
--%>

<%@ include file="/init.jsp" %>

<h3 class="sheet-subtitle"><liferay-ui:message key="client extension javascript" /></h3>

<aui:fieldset cssClass="global-js-cets-configuration">
	<react:component
		module="{addJsClientExtension} from portal-settings-web"
		props='<%=
			HashMapBuilder.<String, Object>put(
				"globalJSCETs", new String[] {"name", "banana", "abacate"}
			).build()
		%>'
	/>
</aui:fieldset>