<%--
/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
--%>

<%@ include file="/init.jsp" %>

<%
FeatureFlagsDisplayContext featureFlagsDisplayContext = (FeatureFlagsDisplayContext)request.getAttribute(WebKeys.PORTLET_DISPLAY_CONTEXT);

String displayStyle = featureFlagsDisplayContext.getDisplayStyle();

SearchContainer<FeatureFlagDisplay> searchContainer = featureFlagsDisplayContext.getSearchContainer();
%>

<clay:container-fluid>
	<clay:sheet>
		<clay:sheet-header>
			<h2 class="sheet-title"><%= featureFlagsDisplayContext.getTitle() %></h2>

			<div class="sheet-text"><%= featureFlagsDisplayContext.getDescription() %></div>
		</clay:sheet-header>

		<%
			System.out.println("OrderByCol: " + searchContainer.getOrderByCol());
			System.out.println("getOrderByTypeParam: " + searchContainer.getOrderByTypeParam());
			System.out.println("Total: " + searchContainer.getTotal());
		%>

		<clay:sheet-section>
			<react:component
				module="js/FeatureFlagList"
				props='<%=
					HashMapBuilder.<String, Object>put(
						"featureFlags", searchContainer.getResults()
					).build()
				%>'
			/>
		</clay:sheet-section>
	</clay:sheet>
</clay:container-fluid>