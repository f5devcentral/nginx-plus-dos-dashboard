/**
 * Copyright 2022-present, F5, Inc.
 * Copyright 2017-present, Igor Meleshchenko
 * Copyright 2022-present, Eyal Pery
 * All rights reserved.
 *
 */

import React from 'react';
import IndexBox from './indexbox/indexbox.jsx';
import AlertsCount from './alertscount/alertscount.jsx';
import DataBinder from '../../databinder/databinder.jsx';
import { apiDos } from '../../../api';
import calculateProtectedObjects from '../../../calculators/protectedobjects';

export class ProtectedObjects extends React.Component {
	render() {
		const { props: { data, store } } = this;
		const stats = data.protected_objects.__STATS;

		return (
			<IndexBox
				title="Dos"
				status={store.__STATUSES.protected_objects.status}
				href="#protected_objects"
			>
				<AlertsCount
					href="#protected_objects"
					total={stats.total}
					alerts={stats.alerts}
				/>
			</IndexBox>
		);
	}
}

export default DataBinder(ProtectedObjects, [
	apiDos.protected_objects.process(calculateProtectedObjects)
]);
