import App from '../components/app/App'
import BrowsePage from '../pages/browse/BrowsePage'
import PartyPage from '../pages/party/PartyPage'
import SearchPage from '../pages/search/SearchPage'
import AboutPage from '../pages/about/AboutPage'
import HelpPage from '../pages/help/HelpPage'


export const routes = {
	path: '/',
	component: App,
	childRoutes: [
		{
			indexRoute: {
				component: BrowsePage
			}
		},
		{
			path: '/party/:partyId',
			component: PartyPage
		},
		{
			path: '/search/:query',
			components: SearchPage
		},
		{
			path: '/about',
			components: AboutPage
		},
		{
			path: '/help',
			components: HelpPage
		}
	]
};