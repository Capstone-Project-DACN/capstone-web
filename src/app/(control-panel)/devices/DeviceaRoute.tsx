import i18next from 'i18next';
import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'devicesPage', en);
i18next.addResourceBundle('tr', 'devicesPage', tr);
i18next.addResourceBundle('ar', 'devicesPage', ar);

const Devices = lazy(() => import('./Devices'));

/**
 * The Example page route.
 */
const DevicesRoute: FuseRouteItemType = {
	path: '/devices',
	element: <Devices />
};

export default DevicesRoute;
