import i18next from 'i18next';
import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import { Navigate } from 'react-router';

i18next.addResourceBundle('tr', 'anomalyPage', tr);
i18next.addResourceBundle('ar', 'anomalyPage', ar);
i18next.addResourceBundle('en', 'anomalyPage', ar);

const Anomaly = lazy(() => import('./AnomalyPage'));

/**
 * The Example page route.
 */
const AnomalyRoute: FuseRouteItemType = {
	path: 'anomaly',
	children: [
		{
			path: '',
			element: <Navigate to='all' />
		},
		{
			path: ":tab",
			element: <Anomaly />
		},
		{
			path: ":tab/:id",
			element: <Anomaly />
		}
	]
};

export default AnomalyRoute;
